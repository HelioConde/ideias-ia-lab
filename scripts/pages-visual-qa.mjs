import { chromium } from 'playwright';
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';

const config = JSON.parse(await readFile(new URL('./pages-targets.json', import.meta.url), 'utf8'));
const outputDir = path.resolve('artifacts/pages-visual-audit');
await mkdir(outputDir, { recursive: true });

const cleanCell = value => String(value ?? '').replaceAll('|', '/').replaceAll('\n', ' ');
const results = [];
const browser = await chromium.launch({ headless: true });
const essentialAsset = /\.(?:js|mjs|css)(?:$|[?#])/i;
const inProject = (url, siteUrl) => {
  try {
    const request = new URL(url);
    const project = new URL(siteUrl);
    return request.origin === project.origin && request.pathname.startsWith(project.pathname);
  } catch { return false; }
};

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
        if (response.status() < 400 || !inProject(response.url(), site.url)) return;
        const message = 'HTTP ' + response.status() + ': ' + new URL(response.url()).pathname;
        // Failed application JS/CSS breaks Pages. Image/favicon failures remain
        // warnings to be triaged with screenshots rather than hiding them.
        (essentialAsset.test(response.url()) ? errors : warnings).push(message);
      });
      page.on('requestfailed', request => {
        if (!inProject(request.url(), site.url)) return;
        const message = 'Request failed: ' + new URL(request.url()).pathname + ' — ' +
          (request.failure()?.errorText || 'unknown');
        (essentialAsset.test(request.url()) ? errors : warnings).push(message);
      });
      const item = { site: site.id, url: site.url, viewport, ok: false, errors, warnings, screenshot: null };
      try {
        const response = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(700);
        item.status = response?.status() ?? 0;
        item.finalUrl = page.url();
        item.metrics = await page.evaluate(() => {
          const html = document.documentElement;
          const clickable = [...document.querySelectorAll('button, a[href]')];
          return {
            title: document.title,
            hasMain: Boolean(document.querySelector('main, [role="main"]')),
            hasHeading: Boolean(document.querySelector('h1')),
            horizontalOverflow: html.scrollWidth > html.clientWidth + 2,
            unnamedControls: clickable.filter(el => {
              const name = (el.getAttribute('aria-label') || el.getAttribute('title') ||
                el.innerText || el.querySelector('img')?.getAttribute('alt') || '').trim();
              return !name && el.getClientRects().length > 0;
            }).length,
            htmlLanguage: document.documentElement.lang || '',
            hasViewportMeta: Boolean(document.querySelector('meta[name="viewport"]')),
            unlabeledFields: [...document.querySelectorAll('input, select, textarea')].filter(el => {
              if (el.type === 'hidden' || el.getClientRects().length === 0) return false;
              const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
              return !aria && ![...el.labels || []].length;
            }).length,
            missingImageAlternatives: [...document.images].filter(img => !img.hasAttribute('alt') && img.getClientRects().length > 0).length,
            below40pxTouchTargets: [...document.querySelectorAll('button, a[href], input, select')].filter(el => {
              if (el.getClientRects().length === 0) return false;
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40);
            }).length,
            viewportWidth: innerWidth,
            documentWidth: html.scrollWidth,
          };
        });
        if (item.metrics.horizontalOverflow) errors.push('Overflow horizontal detectado');
        if (!item.metrics.hasHeading) warnings.push('Nenhum H1 encontrado');
        if (!item.metrics.hasMain) warnings.push('Nenhuma região main encontrada');
        if (item.metrics.unnamedControls) warnings.push(item.metrics.unnamedControls + ' controles sem nome acessível');
        if (item.metrics.unlabeledFields) warnings.push(item.metrics.unlabeledFields + ' campos sem label acessível');
        if (item.metrics.missingImageAlternatives) warnings.push(item.metrics.missingImageAlternatives + ' imagens sem atributo alt');
        if (item.metrics.below40pxTouchTargets && viewport.width <= 768) warnings.push(item.metrics.below40pxTouchTargets + ' alvos pequenos (<40px)');
        if (!item.metrics.htmlLanguage) warnings.push('Documento sem atributo lang');
        if (!item.metrics.hasViewportMeta) warnings.push('Meta viewport ausente');
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
  '', '## Como interpretar', '',
  '- **FAIL:** erro JavaScript, CSS/JS não carregado, overflow do documento ou HTML indisponível.',
  '- **Aviso:** HTML sem semântica, recursos de imagem indisponíveis, controles sem nome ou alvos pequenos.',
  '- Dados de sites externos são diagnósticos: este workflow não altera projetos nem corrige telas automaticamente.',
  '- A validação WCAG completa, os fluxos transacionais e comparação visual Image to Code exigem testes específicos.',
  '',
  'Os PNGs e o JSON de diagnóstico estão no artefato pages-visual-audit.'
].join('\n');
await writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(results, null, 2));
await writeFile(path.join(outputDir, 'report.md'), summary + '\n');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
if (failures.length && process.argv.includes('--strict')) process.exitCode = 1;
