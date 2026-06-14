# AGENTS.md

## Project

Personal couple anniversary webapp. React frontend with Remotion video animations,
FastAPI backend for data persistence and LLM-based answer matching.

## Repo structure

```
couple_anniversary/          ← repo root
├── web/                     ← React 19 + Vite 8 + TypeScript frontend (@couple/web)
├── video/                   ← Remotion 4 compositions (@couple/video)
├── api/                     ← Python FastAPI backend
├── images/                  ← AI-generated character PNGs (final_home.png, final_muvim.png)
└── package.json             ← npm workspaces root (web + video only; api is Python)
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

### Backend (api/)
```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # fill in LLM key when chosen
python run.py            # uvicorn on :8000, auto-reload
```

API docs auto-generated at http://localhost:8000/docs (Swagger) and /redoc.

## Key architecture notes

- **Remotion Player** (`@remotion/player`) runs compositions *in the browser* as React —
  no server-side rendering needed unless you want downloadable MP4s later.
- `video/` is a workspace package (`@couple/video`) imported directly by `web/` —
  compositions are shared as source, not built artifacts.
- Backend uses **SQLite + aiosqlite** (zero config). Swap `DATABASE_URL` in `.env`
  for Postgres when needed.
- LLM provider is **not yet chosen**. Stub lives at `api/app/services/llm.py` —
  implement `match_answers()` there once provider is decided.
  Add the API key to `.env` (slots exist for OpenAI, Google, Anthropic).
- CORS is configured for `http://localhost:5173` in dev via `api/.env`.

## npm workspaces

`web/` depends on `@couple/video` via `"@couple/video": "*"`. Run `npm install`
from the repo root to link them. The root `package-lock.json` is intentionally
minimal; each workspace has its own.

## Google Stitch MCP

`opencode.json` enables the Stitch MCP server for UI design generation tools.
Use Stitch tools when creating or editing screen designs.
