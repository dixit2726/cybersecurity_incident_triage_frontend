# SOC Incident Triage Console — Frontend

A professional SOC analyst console (React + TanStack Start, Tailwind v4) that
connects to your existing FastAPI **Cybersecurity Incident Triage AI** backend
over HTTP. It contains **no mock data** — every alert, MITRE assessment,
threat-intelligence finding, playbook, CISA reference, and report rendered in
the UI comes from the backend, and each page shows an explicit empty state
until a real analysis has been run.

## Run locally

Prerequisites: Node.js 20+ (or Bun), and your FastAPI service running.

```sh
# 1. install dependencies
npm install        # or: bun install

# 2. point the console at your FastAPI service
cp .env.example .env
# .env already contains: VITE_API_BASE_URL=http://127.0.0.1:8000

# 3. start the dev server
npm run dev        # or: bun dev
```

Open http://localhost:8080.

## Connecting to your backend

The API base URL is resolved in this order:

1. the address saved on the in-app **Settings** page (per browser),
2. `VITE_API_BASE_URL` from the environment at build/dev time,
3. `http://127.0.0.1:8000` as the local default.

No public address is hard-coded. For a hosted deployment, set
`VITE_API_BASE_URL` to your own publicly reachable HTTPS FastAPI address, or
enter it on the Settings page.

**CORS:** the FastAPI service must allow the origin this console is served
from. Set `ALLOWED_ORIGINS` on the backend (comma-separated) before starting
it, e.g.:

```sh
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

## Pages

- **Analyze Alert** (`/`) — submit an alert to `POST /api/v1/triage`.
- **History** (`/history`) — incidents analyzed in this browser session.
- **Threat Intelligence** (`/threat-intelligence`) — backend TI findings.
- **MITRE ATT&CK** (`/mitre`) — backend technique assessments.
- **Playbooks** (`/playbooks`) — retrieved backend playbooks.
- **CISA Guidance** (`/cisa`) — backend-returned guidance.
- **Reports** (`/reports`) — verbatim JSON export of stored reports.
- **Settings** (`/settings`) — API address, health status, diagnostics.

All section pages show an empty state until an incident has actually been
analyzed; nothing is fabricated client-side.

## Tech

TanStack Start (React 19) + TanStack Router/Query, Tailwind CSS v4,
shadcn-style components. API client: `src/lib/soc/api.ts`.
