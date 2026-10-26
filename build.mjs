// BrainForKids — static build. `node build.mjs` → dist/ (Node 18+, no dependencies)
//   src/template.html + src/content/{he,en,ja}.json  →  dist/index.html (he), dist/en/, dist/ja/
//   site/  →  copied into dist/ as is
//
// Placeholders in the template:
//   {{a.b}}        text from the content file, HTML-escaped; ｜ becomes <wbr>
//   {{attr:a.b}}   same, for use inside attribute values (｜ removed)
//   {{lang}} {{dir}} {{path}} {{peLang}}   per-language values
//   {{cur:xx}}     aria-current="page" on the active language link
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');

const LANGS = [
  { lang: 'he', dir: 'rtl', path: '',    out: 'index.html' },
  { lang: 'en', dir: 'ltr', path: 'en/', out: 'en/index.html' },
  { lang: 'ja', dir: 'ltr', path: 'ja/', out: 'ja/index.html' },
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const lookup = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const template = fs.readFileSync(path.join(ROOT, 'src/template.html'), 'utf8');

fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'site'), DIST, { recursive: true });

for (const L of LANGS) {
  const content = JSON.parse(fs.readFileSync(path.join(ROOT, `src/content/${L.lang}.json`), 'utf8'));
  const vars = { lang: L.lang, dir: L.dir, path: L.path, peLang: L.path };
  const missing = [];

  const html = template.replace(/\{\{\s*([a-z]+:)?([\w.]+)\s*\}\}/g, (_, mod, key) => {
    if (mod === 'cur:') return key === L.lang ? 'aria-current="page"' : '';
    if (!mod && key in vars) return vars[key];
    const v = lookup(content, key);
    if (v === undefined) { missing.push(key); return ''; }
    if (mod === 'attr:') return esc(String(v).replace(/｜/g, ''));
    return esc(v).replace(/｜/g, '<wbr>');
  });

  if (missing.length) {
    console.error(`[${L.lang}] missing keys: ${[...new Set(missing)].join(', ')}`);
    process.exitCode = 1;
  }
  const out = path.join(DIST, L.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`built /${L.path}  (${L.lang}, ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
}
