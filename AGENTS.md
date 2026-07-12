# AGENTS.md

## Project

Personal couple anniversary webapp. React frontend with Remotion video animations,
deployed as a static site to GitHub Pages.

## Repo structure

```
couple_anniversary/          ← repo root
├── web/                     ← React 19 + Vite 8 + TypeScript frontend (@couple/web)
├── video/                   ← Remotion 4 compositions (@couple/video)
├── images/                  ← AI-generated character PNGs (final_home.png, final_muvim.png)
└── package.json             ← npm workspaces root (web + video)
```

## Dev commands

### Frontend (web/)
```bash
npm run dev:web          # from repo root — starts Vite dev server on :5173
npm run build:web
```
Or from inside `web/`:
```bash
npm run dev
npm run build            # tsc -b && vite build
npm run lint
```

### Remotion (video/)
```bash
npm run dev:video        # from repo root — opens Remotion Studio
```
Or from inside `video/`:
```bash
npm run dev              # remotion studio
npm run build            # remotion bundle
npm run lint             # eslint src && tsc
```

## GitHub Pages Deployment

The app is deployed to GitHub Pages as a static site. Push to `main` to trigger
automatic deployment via `.github/workflows/deploy.yml`.

**Live URL:** `https://<username>.github.io/couple_anniversary/`

The Vite config uses `base: '/couple_anniversary/'` for correct asset paths.

## Key architecture notes

- **Remotion Player** (`@remotion/player`) runs compositions *in the browser* as React —
  no server-side rendering needed unless you want downloadable MP4s later.
- `video/` is a workspace package (`@couple/video`) imported directly by `web/` —
  compositions are shared as source, not built artifacts.
- The app is a **static site** with no backend — all data is hardcoded in the frontend.

## npm workspaces

`web/` depends on `@couple/video` via `"@couple/video": "*"`. Run `npm install`
from the repo root to link them. The root `package-lock.json` is intentionally
minimal; each workspace has its own.

## Google Stitch MCP

`opencode.json` enables the Stitch MCP server for UI design generation tools.
Use Stitch tools when creating or editing screen designs.
