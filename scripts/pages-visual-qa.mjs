import { chromium } from 'playwright';
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';

const config = JSON.parse(await readFile(new URL('./pages-targets.json', import.meta.url), 'utf8'));
const outputDir = path.resolve('artifacts/pages-visual-audit');
await mkdir(outputDir, { recursive: true });

const cleanCell = value => String(value ?? '').replaceAll('|', '/').replaceAll('\n', ' ');
const results = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const site of config.sites) {
    for (const viewport of config.viewports) {
      const label = site.id + '-' + viewport.width + 'x' + viewport.height;
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const errors = [];
      const warnings = [];
      page.on('pageerror', error => errors.push('JavaScript: ' + error.message));
      page.on('console', message => {
        if (message.type() === 'error') warnings.push('Console: ' + message.text().slice(0, 280));
      });
      page.on('response', response => {
        if (response.status() < 400) return;
        try {
          const source = new URL(response.url());
          const target = new URL(page.url() || site.url);
          if (source.origin === target.origin) warnings.push('HTTP ' + response.status() + ': ' + source.pathname);
        } catch {}
      });
      const item = { site: site.id, url: site.url, viewport, ok: false, errors, warnings, screenshot: null };
      try {
        const response = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(700);
        item.status = response?.status() ?? 0;
        item.finalUrl = page.url();
        item.metrics = await page.evaluate(() => {
          const html = document.documentElement;
          const visible = el => Boolean(el.getClientRects().length) &&
            getComputedStyle(el).visibility !== 'hidden';
          const clickable = [...document.querySelectorAll('button, a[href], [role="button"]')].filter(visible);
          const images = [...document.querySelectorAll('img')];
          const fields = [...document.querySelectorAll('input:not([type="hidden"]), textarea, select')].filter(visible);
          const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
          const card = document.querySelector('article, .card, [class*="card"]');
          const rootStyles = getComputedStyle(document.body);
          const unlabelled = clickable.filter(el => {
            const name = (el.getAttribute('aria-label') || el.getAttribute('title') ||
              el.innerText || el.querySelector('img')?.getAttribute('alt') || '').trim();
            return !name;
          });
          const tinyTargets = clickable.filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44);
          });
          const brokenImages = images.filter(el => {
            if (!visible(el) || el.loading === 'lazy') return false;
            const r = el.getBoundingClientRect();
            if (r.top > innerHeight || r.bottom < 0) return false;
            return el.complete && el.naturalWidth === 0 && Boolean(el.currentSrc || el.src);
          });
          const overflowElements = [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect();
            return visible(el) && r.width > 0 && (r.right > innerWidth + 3 || r.left < -3);
          }).slice(0, 7).map(el => el.tagName.toLowerCase() +
            (el.id ? '#' + el.id : el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : ''));
          return {
            title: document.title,
            hasMain: Boolean(document.querySelector('main, [role="main"]')),
            hasHeading: Boolean(document.querySelector('h1')),
            headingCount: headings.length,
            navigationRegions: document.querySelectorAll('nav, [role="navigation"]').length,
            cardCount: document.querySelectorAll('article, .card').length,
            carouselCount: document.querySelectorAll('[aria-roledescription="carousel"], .carousel, .swiper').length,
            horizontalOverflow: html.scrollWidth > html.clientWidth + 2,
            overflowElements,
            unnamedControls: unlabelled.length,
            undersizedTargets: tinyTargets.length,
            missingImageAlt: images.filter(el => !el.hasAttribute('alt')).length,
            brokenVisibleImages: brokenImages.map(el => (el.currentSrc || el.src).slice(0, 180)),
            unlabeledFields: fields.filter(el => !(el.labels?.length ||
              el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title'))).length,
            placeholderLinks: clickable.filter(el => el.tagName === 'A' && el.getAttribute('href') === '#').length,
            reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
            designTokens: {
              bodyFont: rootStyles.fontFamily,
              foreground: rootStyles.color,
              background: rootStyles.backgroundColor,
              headingFont: document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).fontFamily : null,
              cardRadius: card ? getComputedStyle(card).borderRadius : null,
            },
          };
        });
        if (item.metrics.horizontalOverflow) errors.push('Overflow horizontal detectado');
        if (!item.metrics.hasHeading) warnings.push('Nenhum H1 encontrado');
        if (!item.metrics.hasMain) warnings.push('Nenhuma região main encontrada');
        if (item.metrics.unnamedControls) warnings.push(item.metrics.unnamedControls + ' controles sem nome acessível');
        if (item.metrics.undersizedTargets) warnings.push(item.metrics.undersizedTargets + ' alvos interativos menores que 44px');
        if (item.metrics.missingImageAlt) warnings.push(item.metrics.missingImageAlt + ' imagens sem atributo alt');
        if (item.metrics.brokenVisibleImages.length) warnings.push('Imagens visíveis com falha: ' + item.metrics.brokenVisibleImages.join(', '));
        if (item.metrics.unlabeledFields) warnings.push(item.metrics.unlabeledFields + ' campos visíveis sem rótulo');
        if (item.metrics.placeholderLinks) warnings.push(item.metrics.placeholderLinks + ' links com href="#"');
        if (item.status < 200 || item.status >= 400) errors.push('Navegação HTTP ' + item.status);
        const imagePath = path.join(outputDir, label + '.png');
        await page.screenshot({ path: imagePath, fullPage: true, animations: 'disabled', timeout: 30000 });
        item.screenshot = path.relative(process.cwd(), imagePath);
        item.ok = errors.length === 0;
      } catch (error) {
        errors.push('Falha na captura: ' + (error?.message || String(error)).slice(0, 500));
      } finally {
        results.push(item);
        console.log((item.ok ? 'PASS ' : 'FAIL ') + label + ': HTTP ' + (item.status ?? '?') + ' / ' + errors.join('; '));
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

const failures = results.filter(item => !item.ok);
const summary = [
  '# Auditoria visual centralizada — GitHub Pages', '',
  'Capturas de página inteira; movimento reduzido; verificação de console, JavaScript, overflow e semântica básica.',
  '',
  '| Projeto | Resolução | Resultado | HTTP | Erros | Avisos |',
  '|---|---|---|---:|---:|---:|',
  ...results.map(item => '| ' + [
    cleanCell(item.site), item.viewport.width + '×' + item.viewport.height,
    item.ok ? 'PASS' : 'FAIL', item.status ?? '—',
    item.errors.length, item.warnings.length
  ].join(' | ') + ' |'),
  '', '## Falhas e avisos', '',
  ...results.filter(item => item.errors.length || item.warnings.length).map(item =>
    '- ' + cleanCell(item.site) + ' (' + item.viewport.width + '×' + item.viewport.height + '): ' +
    [...item.errors, ...item.warnings].map(cleanCell).join('; ')),
  '', 'Total: ' + results.length + ' capturas; ' + failures.length + ' cenários com falhas.',
  'Os PNGs e o JSON de diagnóstico estão no artefato pages-visual-audit.'
].join('\n');
const inventory = [
  '# Inventário UX/UI — componentes e sinais de redesenho',
  '',
  'Gerado a partir do DOM publicado e das capturas Playwright; não é avaliação WCAG nem comparação pixel a pixel com referência aprovada.',
  '',
  '| Projeto | Resolução | Componentes | Sem rótulo | Alvos <44px | Imagens quebradas | Campos sem rótulo |',
  '|---|---|---|---:|---:|---:|---:|',
  ...results.map(item => {
    const m = item.metrics || {};
    const components = (m.cardCount ?? '—') + ' cards / ' + (m.carouselCount ?? '—') + ' carrosséis';
    return '| ' + [cleanCell(item.site), item.viewport.width + '×' + item.viewport.height,
      components, m.unnamedControls ?? '—', m.undersizedTargets ?? '—',
      m.brokenVisibleImages?.length ?? '—', m.unlabeledFields ?? '—'].join(' | ') + ' |';
  }),
  '',
  '## Critérios de revisão Image to Code',
  '',
  '1. Use os PNGs de página inteira como estado *antes*; compare com uma referência autorizada do mesmo projeto.',
  '2. Confira hierarquia tipográfica, espaçamento, grids, radii, ícones, imagens, foco e textos responsivos.',
  '3. Corrija o componente no repositório de origem; não remende apenas a captura ou o auditor.',
  '4. Rode novamente o Playwright e só promova a referência aprovada depois de revisar o resultado.',
  '',
  '## Tokens visuais observados',
  '',
  ...results.filter(item => item.viewport.width === 1440).map(item => {
    const d = item.metrics?.designTokens || {};
    return '- **' + cleanCell(item.site) + '**: fonte ' + cleanCell(d.bodyFont || '—') +
      '; texto ' + cleanCell(d.foreground || '—') + '; fundo ' + cleanCell(d.background || '—') +
      '; raio de card ' + cleanCell(d.cardRadius || '—');
  }),
  '',
  'Este relatório é somente de diagnóstico. Links, autenticação, animações e fluxos reais exigem testes específicos.'
].join('\n');
await writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(results, null, 2));
await writeFile(path.join(outputDir, 'report.md'), summary + '\n');
await writeFile(path.join(outputDir, 'ui-inventory.md'), inventory + '\n');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
if (failures.length && process.argv.includes('--strict')) process.exitCode = 1;
