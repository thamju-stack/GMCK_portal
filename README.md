# GMC Kozhikode — MERN Portal

Full-stack recreation of the GMC Kozhikode hospital portal. React + TypeScript client
(Vite, Tailwind CSS v4, Redux Toolkit + redux-persist, react-router) backed by an
Express + TypeScript API.

## Layout

```
GMCK_MERN/
├── client/   React SPA (Vite, Tailwind v4, Redux)
└── server/   Express API (Postgres/Neon + in-memory fallback)
```

## Requirements

- Node.js >= 20 (built with Node 25 / npm 11)
- Postgres (e.g. [Neon](https://neon.tech)) **optional** — without it the
  server runs an in-memory store (data resets on restart, clearly marked
  sample/placeholder).

## Run in development

```bash
# terminal 1 — API on http://127.0.0.1:5001
cd server && npm install && npm run dev

# terminal 2 — Vite on http://localhost:5173 (proxies /api → 5001)
cd client && npm install && npm run dev
```

First launch shows the onboarding flow (Welcome → Language → Home).
Admin portal: `http://localhost:5173/admin` — default `admin / admin123`
(change it via the Password tab; credentials live in `server/.env`).

## Run in production

```bash
cd client && npm run build      # → client/dist
cd server && npm run build && npm start
```

The API serves `client/dist` and SPA-routes all non-`/api` paths.

> Tip: `npm install` once at the repository root — npm workspaces installs
> both `client/` and `server/` together (a single hoisted `node_modules`).

## Deploy to Vercel

The repo is pre-wired for Vercel (root `package.json` + `vercel.json`):

1. Import the GitHub repo at **Root Directory `./`**.
2. Framework is auto-detected as **Other**; build runs `npm run build`
   (compiles the Vite client to `client/dist`), which `vercel.json`
   publishes as the output directory.
3. The Express API is exposed as a serverless function via `api/index.ts`;
   `vercel.json` rewrites `/api/*` to it and SPA-rewrites everything else
   to `index.html`.
4. Env vars (Vercel → Project → Settings → Environment Variables):
   - `JWT_SECRET` — **required**. Without it, admin login is disabled in
     production rather than silently falling back to an insecure default.
   - `ADMIN_USER`, `ADMIN_PASS` — optional, default to `admin` / `admin123`.
   - `DATABASE_URL` — optional but recommended, a Postgres connection string
     (e.g. from [Neon](https://neon.tech), available as a Vercel Marketplace
     integration). Without it the function uses an in-memory store that
     resets on every cold start (admin edits and appointment submissions are
     lost). With it, data persists the same way it does when self-hosting.

## API

| Method | Path                  | Auth | Purpose                           |
| ------ | --------------------- | ---- | --------------------------------- |
| GET    | `/api/health`         | -    | Health + storage mode             |
| GET    | `/api/bootstrap`      | -    | Departments, doctors, notices, notifications, OPD, emergency |
| POST   | `/api/appointments`   | -    | Submit an OPD appointment request |
| POST   | `/api/admin/login`    | -    | JWT login (httpOnly cookie)       |
| POST   | `/api/admin/logout`   | ✓    | Clear session                     |
| GET    | `/api/admin/me`       | ✓    | Current admin                     |
| PUT    | `/api/admin/password` | ✓    | Change password                   |
| POST   | `/api/admin/departments` | ✓ | Replace departments list          |
| POST   | `/api/admin/doctors`  | ✓    | Replace doctors list              |
| PUT    | `/api/admin/emergency`| ✓    | Update emergency/helpdesk info    |

## Conventions

- All data shown is **placeholder/sample** until the hospital publishes official content.
  Placeholders are surfaced in the UI with a "Sample data" banner.
- Real, intentional facts only: campus name/location and the Paadha indoor map
  (`https://maps.paadha.com/`), which always opens in a new tab.
- Routes parity with the legacy Flask portal: `/welcome`, `/language`, `/`,
  `/hospital`, `/search`, `/notices`, `/profile`, `/emergency`, `/departments`,
  `/department`, `/doctors`, `/doctor`, `/opd`, `/appointment`, `/navigation`,
  `/map`, `/tests`, `/test`, `/admissions`, `/academics`, `/academic-calendar`,
  `/library`, `/student`, `/notifications`, `/admin`.