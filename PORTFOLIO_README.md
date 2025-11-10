# Professional Portfolio CMS

This project is a React 19 portfolio front-end backed by an Express API that powers a lightweight CMS. All portfolio content (profile, case studies, and insights) is stored as JSON and can be managed through secure HTTP endpoints.

## Highlights

- **Dynamic content** served from an Express API with file-based persistence.
- **Secure admin endpoints** protected by a bearer token (`CMS_ADMIN_TOKEN`).
- **React Query data layer** keeps the UI in sync with backend changes.
- **Type-safe validation** using Zod for all incoming payloads.
- **Vite proxy** in development so the client can call the API without CORS headaches.

## Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Wouter, @tanstack/react-query
- **Backend:** Express 4, TypeScript, Zod, Node 20+
- **Build tooling:** esbuild, pnpm, tsx

## Project Structure

```
.
├── client/                # React application
│   ├── public/            # Static assets
│   └── src/
│       ├── api/           # Axios client + CMS API wrappers
│       ├── components/    # UI + layout primitives
│       ├── hooks/         # React Query hooks for content
│       ├── lib/           # SEO helpers and utilities
│       └── pages/         # Route components
├── server/                # Express API
│   ├── data/              # JSON content storage (mutable at runtime)
│   ├── routes/            # CMS routes
│   ├── middleware/        # Auth middleware
│   └── contentStore.ts    # File persistence helpers
├── shared/                # Shared TypeScript types
├── dist/                  # Production build output
└── PORTFOLIO_README.md    # This document
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install dependencies

```bash
pnpm install
```

### Environment variables

Create a `.env` file in the project root:

```bash
# Required for CMS write operations
CMS_ADMIN_TOKEN=your-secret-admin-token-here

# Optional server configuration
PORT=4000

# Optional client API configuration (defaults are fine for most cases)
# VITE_API_BASE_URL=/api
# VITE_API_PROXY_TARGET=http://localhost:4000

# Optional data directory override
# CMS_DATA_DIR=./server/data
```

| Variable | Description | Default |
| --- | --- | --- |
| `CMS_ADMIN_TOKEN` | **Required** token for POST/PUT/DELETE CMS endpoints | _(none)_ |
| `PORT` | Port for the Express server | `4000` |
| `VITE_API_BASE_URL` | API base URL used by the client | `/api` |
| `VITE_API_PROXY_TARGET` | Vite dev proxy target | `http://localhost:4000` |
| `CMS_DATA_DIR` | Directory for JSON content storage | `./server/data` |

### Run in development

**Easiest way** - Start both client and server together in one command:

```bash
pnpm dev
```

This uses `concurrently` to run both the Express API server (port `4000`) and the Vite dev server (port `3000`) simultaneously with color-coded output.

**Alternative** - Run separately in two terminals:

```bash
# Terminal 1
pnpm dev:server

# Terminal 2
pnpm dev:client
```

The Vite dev server proxies `/api/*` requests to the Express server at `http://localhost:4000`, so the client can call the API without CORS issues.

> **Note:** If you see `ECONNREFUSED` errors in the browser console, make sure the Express server is running.

## Build & Production

Create a production build of both the client and the server:

```bash
pnpm build
```

This command:

1. Builds the React app into `dist/public`.
2. Bundles the Express server into `dist/index.js`.

Run the bundled server (serves static assets and the API from the same process):

```bash
pnpm start
```

Supply `CMS_ADMIN_TOKEN` (and `PORT`, if necessary) in the production environment.

## CMS API

All content lives under `/api/content`. Mutation endpoints require a bearer token that matches `CMS_ADMIN_TOKEN`.

### Authentication

Send an `Authorization` header with the value `Bearer <CMS_ADMIN_TOKEN>` when creating, updating, or deleting content.

### Endpoints

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/content` | Fetch profile, case studies, and insights in one request | No |
| `GET` | `/api/content/profile` | Fetch profile | No |
| `PUT` | `/api/content/profile` | Replace profile details | Yes |
| `GET` | `/api/content/case-studies` | Fetch all case studies | No |
| `POST` | `/api/content/case-studies` | Create a case study (ID auto-generated if omitted) | Yes |
| `PUT` | `/api/content/case-studies/:id` | Update a case study | Yes |
| `DELETE` | `/api/content/case-studies/:id` | Delete a case study | Yes |
| `GET` | `/api/content/insights` | Fetch all insights | No |
| `POST` | `/api/content/insights` | Create an insight | Yes |
| `PUT` | `/api/content/insights/:id` | Update an insight | Yes |
| `DELETE` | `/api/content/insights/:id` | Delete an insight | Yes |

### Example request

```bash
curl -X POST http://localhost:4000/api/content/case-studies \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Engagement",
    "client": "Acme Corp",
    "sector": "Enterprise Technology",
    "contractValue": "$5M",
    "outcome": "Won",
    "description": "Summary of the win...",
    "keyAchievements": ["Reduced delivery time by 30%"],
    "image": "https://example.com/image.jpg",
    "featured": true
  }'
```

### Storage

- Content is persisted under `server/data/*.json`.
- The server automatically reads from the existing files; no database is required.
- You can point to a different data directory by setting `CMS_DATA_DIR`.

## Frontend data layer

- `client/src/api` contains Axios-based helpers for the CMS endpoints.
- `client/src/hooks/useContent.ts` exposes `useProfile`, `useCaseStudies`, and `useInsights`, powered by React Query.
- Pages consume these hooks and render loading and error states gracefully.

## Updating content manually

You can edit the JSON files under `server/data` directly while the server is stopped. The next server start will pick up the changes.

## Troubleshooting

- **401 / 403 errors on write requests** — ensure `CMS_ADMIN_TOKEN` is set on the server and that your request includes a matching bearer token.
- **404 when updating/deleting** — confirm the ID exists. Use `GET /api/content/<collection>` to list the current items.
- **Dev server cannot reach API** — make sure `pnpm dev:server` is running on port `4000`. Override `VITE_API_PROXY_TARGET` if your API uses a different port.
- **TypeScript complaints about JSON imports** — the project does not import JSON directly; edit the data files or interact through the API instead.

## License

MIT

