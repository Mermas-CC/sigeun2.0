// Exporta los diagramas de sigeun2-arquitectura.html a PNG (2x) y SVG autónomo, en tema claro.
// Requiere Playwright con Chromium.
// Uso: node diagramas/fuente/exportar.mjs [--fonts-css ruta/fuentes-locales.css] [--shots carpeta]
//   --fonts-css  CSS con @font-face locales (si no hay acceso a Google Fonts al exportar)
//   --shots      además guarda capturas de página completa (claro, oscuro y móvil) para revisión
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, resolve, basename, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(here, '..');
const SRC = join(OUT_DIR, 'sigeun2-arquitectura.html');
const NAMES = ['01-arquitectura-microservicios', '02-saga-matricula', '03-migracion-strangler', '04-despliegue'];

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const fontsCss = opt('--fonts-css');
const shotsDir = opt('--shots');

let body = readFileSync(SRC, 'utf8');
let head = '';
let stageDir = OUT_DIR;
if (fontsCss) {
  // Página temporal junto al CSS de fuentes locales para que resuelvan sus rutas relativas
  stageDir = dirname(resolve(fontsCss));
  body = body.replace(/<link[^>]+fonts\.googleapis\.com\/css2[^>]+>/, '');
  head = `<link rel="stylesheet" href="${basename(fontsCss)}">`;
}
const wrap = (theme) => `<!doctype html><html lang="es" data-theme="${theme}"><head><meta charset="utf-8">` +
  `<meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${body}</body></html>`;
const stage = (theme) => {
  const p = join(stageDir, `_export-${theme}.html`);
  writeFileSync(p, wrap(theme));
  return pathToFileURL(p).href;
};

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1760, height: 1200 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(stage('light'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const count = await page.locator('svg.diagram').count();
  for (let i = 0; i < count; i++) {
    const name = NAMES[i] ?? `diagrama-${i + 1}`;
    // Escenario aislado con el SVG a su ancho natural
    await page.evaluate((idx) => {
      document.getElementById('export-stage')?.remove();
      const src = document.querySelectorAll('svg.diagram')[idx];
      const vb = src.viewBox.baseVal;
      const st = document.createElement('div');
      st.id = 'export-stage';
      st.style.cssText = 'position:absolute;left:0;top:0;padding:24px;background:var(--bg);z-index:9999';
      const c = src.cloneNode(true);
      c.style.cssText = `width:${vb.width}px;min-width:0;max-width:none;height:auto;display:block`;
      st.appendChild(c);
      document.body.appendChild(st);
      window.scrollTo(0, 0);
    }, i);
    await page.locator('#export-stage').screenshot({ path: join(OUT_DIR, `${name}.png`) });

    // SVG autónomo: estilos calculados en línea y fondo explícito
    const svg = await page.evaluate(() => {
      const c = document.querySelector('#export-stage svg');
      const props = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linejoin', 'paint-order',
        'opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing'];
      const all = [c, ...c.querySelectorAll('*')];
      for (const el of all) {
        const cs = getComputedStyle(el);
        for (const p of props) {
          const v = cs.getPropertyValue(p);
          if (v && v !== 'normal' && !(p === 'stroke-dasharray' && v === 'none')) el.setAttribute(p, v);
        }
        el.removeAttribute('class');
        el.removeAttribute('style');
      }
      const vb = c.viewBox.baseVal;
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('x', vb.x); bg.setAttribute('y', vb.y);
      bg.setAttribute('width', vb.width); bg.setAttribute('height', vb.height);
      bg.setAttribute('fill', getComputedStyle(document.body).backgroundColor);
      c.insertBefore(bg, c.firstChild);
      c.setAttribute('width', vb.width); c.setAttribute('height', vb.height);
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
    });
    writeFileSync(join(OUT_DIR, `${name}.svg`), svg);
    console.log('Exportado', name);
  }
  await page.evaluate(() => document.getElementById('export-stage')?.remove());

  if (shotsDir) {
    mkdirSync(shotsDir, { recursive: true });
    for (const theme of ['light', 'dark']) {
      const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await p.goto(stage(theme), { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: join(shotsDir, `pagina-${theme}.png`), fullPage: true });
      await p.close();
    }
    const m = await browser.newPage({ viewport: { width: 400, height: 860 } });
    await m.goto(stage('light'), { waitUntil: 'load' });
    await m.evaluate(() => document.fonts.ready);
    const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await m.screenshot({ path: join(shotsDir, 'pagina-movil.png'), fullPage: true });
    console.log('Desborde horizontal en móvil (px):', overflow);
    await m.close();
  }
} finally {
  await browser.close();
}
