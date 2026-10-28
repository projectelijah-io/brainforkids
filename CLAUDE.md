# BrainForKids — b4k.io

Static site for **BrainForKids (B4K)**, a Project Elijah venture: a public declaration for the next
generation of education. Tagline: **Rethinking Knowledge** / **מחשבה חדשה על ידע** / **知識を、考え直す**.
Three language versions — **Hebrew (default, RTL)**, English, Japanese — same setup as projectelijah.io.

## Structure

```
src/
  template.html        One page template with {{placeholders}}; built once per language
  content/             he.json · en.json · ja.json — ALL visible text, one file per language
build.mjs              `node build.mjs` → dist/ (Node, no dependencies)
site/                  Static assets copied into dist/ as is
  styles.css           All styles (design tokens in :root)
  favicon.svg          The 4 with the cyan signal dot
  images/og-*.jpg      Share images, one per language (1200×630)
dist/                  Build output, gitignored. dist/index.html = he, dist/en/, dist/ja/
netlify.toml           Build command + publish dir
```

## Content

- Edit text only in `src/content/*.json`; keep the three files' keys identical.
- The page follows the Declaration: hero → declaration → 01 The Teachers → 02 The School →
  03 The Vehicles → how knowledge travels (Spark · Deepen · Play) → teach (stage) → Herzliya pilot.
- Every Japanese string is a **draft awaiting native review** (`_review` in ja.json).
  `｜` marks a permitted line-break point (becomes `<wbr>`).
- "Matched Frequency" is presented as research we are setting out to build, not as an existing technology.

## Brand — Midnight Signal

- Mark: monoline geometric **B4K**; the 4's stem rises to a single glowing cyan dot (the raised hand,
  reduced to a signal). Defined once as the `#b4k` SVG symbol at the end of the template.
- Colors: Midnight #0A0F1F, Deep Ink #141C33, Signal Cyan #3DE0FF, Electric Blue #2F6BFF, Silver #9AA6C4, White.
- Type: Space Grotesk (Latin), Heebo (Hebrew), Noto Sans JP (Japanese). Thin weights, restraint.

## Conventions

- No inline styles — rules go in `styles.css`, colors via the `:root` variables.
- Logical CSS properties (`inline-start/end`, `block-start/end`) so the Hebrew version mirrors.
- Asset URLs are root-absolute (`/styles.css`), because pages live at `/`, `/en/`, `/ja/`.
- Pages work without JavaScript; animations respect `prefers-reduced-motion`.

## Local preview

`node build.mjs && npx serve dist`

## Deployment

Live domain: **b4k.io** (canonical, hreflang, og:url and share images all use it; brainforkids.io does not resolve).

Netlify, deployed from GitHub (push to the default branch triggers a deploy). Build `node build.mjs`, publish `dist`.
