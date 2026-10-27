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
          };
        });
        if (item.metrics.horizontalOverflow) errors.push('Overflow horizontal detectado');
        if (!item.metrics.hasHeading) warnings.push('Nenhum H1 encontrado');
        if (!item.metrics.hasMain) warnings.push('Nenhuma região main encontrada');
        if (item.metrics.unnamedControls) warnings.push(item.metrics.unnamedControls + ' controles sem nome acessível');
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
await writeFile(path.join(outputDir, 'diagnostics.json'), JSON.stringify(results, null, 2));
await writeFile(path.join(outputDir, 'report.md'), summary + '\n');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
if (failures.length && process.argv.includes('--strict')) process.exitCode = 1;
