# MyTravelLine Frontend — Monorepo

This is the frontend monorepo for MyTravelLine, a travel agency website.
It uses **npm workspaces** and contains two deployable apps and one shared package.

## Repository layout

```
my-travelline-frontend/
├── apps/
│   ├── public/          # Customer-facing website  (my-travelline.com)
│   └── admin/           # Admin dashboard  (admin.my-travelline.com)
├── packages/
│   └── shared/          # @my-travelline/shared — types + LoadingSpinner
└── public/              # Static assets (logo.png) shared by both apps
```

## Running locally

```bash
npm install                      # install all workspaces from root
cd apps/public && npm run dev    # http://localhost:5173
cd apps/admin  && npm run dev    # http://localhost:5174
```

Both apps proxy `/api` to `http://localhost:8080` in dev.
Start the backend first: `~/Projects/my-travelline-backend`

## Building

```bash
# from repo root — builds all workspaces
npm run build

# or per app
cd apps/public && npm run build
cd apps/admin  && npm run build
```

## Testing & linting

```bash
npm test          # runs tests in all workspaces
npm run lint      # lints all workspaces
```

## Environment variables

Each app reads `VITE_API_BASE_URL` at build time (set in GitHub Actions as `vars.VITE_API_BASE_URL`).
Copy `.env.example` to `.env.local` inside each app for local overrides.

## Shared package — @my-travelline/shared

Located at `packages/shared/src/`.

- **Types** (`packages/shared/src/types/index.ts`) — all domain and request/response interfaces
- **LoadingSpinner** (`packages/shared/src/components/LoadingSpinner.tsx`)

Import in either app:

```ts
import type { Tour, TourSummary } from '@my-travelline/shared';
import { LoadingSpinner } from '@my-travelline/shared';
```

The alias is resolved at build time via Vite and TypeScript paths — no build step needed for the shared package.

## apps/public

Routes: `/`, `/tours`, `/tours/:slug`, `/destinations`, `/destinations/:slug`,
`/gallery`, `/blog`, `/blog/:slug`, `/about`, `/contact`

- No authentication
- Simple Axios client (`src/api/client.ts`) — no JWT interceptors
- Public API endpoints only (`src/api/endpoints.ts`)

## apps/admin

Routes: `/login`, `/`, `/tours`, `/categories`, `/destinations`,
`/bookings`, `/messages`, `/blog`, `/gallery`, `/reviews`

- JWT auth with token refresh (`src/api/client.ts`)
- On 401 or logout → redirects to `/login`
- `ProtectedRoute` wraps all routes except `/login`
- Admin API endpoints only (`src/api/endpoints.ts`)

## CI/CD — GitHub Actions

Workflow: `.github/workflows/frontend-ci.yml`

| Job | Trigger | What it does |
|---|---|---|
| `ci-public` | push / PR to main, develop | lint → typecheck → test → build public app |
| `ci-admin` | push / PR to main, develop | lint → typecheck → test → build admin app |
| `deploy-public` | push to main only | upload `apps/public/dist/` → S3 → invalidate CloudFront |
| `deploy-admin` | push to main only | upload `apps/admin/dist/` → S3 → invalidate CloudFront |

AWS auth uses GitHub OIDC (no stored keys):
`arn:aws:iam::947927347939:role/github-actions-mytravelline-frontend-prod`

**Required GitHub Actions variables (`vars.`):**

| Variable | Used by |
|---|---|
| `VITE_API_BASE_URL` | both build jobs |
| `AWS_REGION` | both deploy jobs |
| `S3_BUCKET_NAME` | deploy-public |
| `CLOUDFRONT_DISTRIBUTION_ID` | deploy-public |
| `S3_ADMIN_BUCKET_NAME` | deploy-admin |
| `CLOUDFRONT_ADMIN_DISTRIBUTION_ID` | deploy-admin |

## Brand

**Logo:** `public/logo.png` (served by both apps)

**Colors:**
- Main text: `#0C0809`
- Brand blue: `#2E7D9C` (`primary-600` in Tailwind)
- Brand red: `#CB2912` (`accent-600` in Tailwind)
- Background: `#E8F9FF`

**Fonts:** Inter (body), Playfair Display (headings)

## Design direction

Modern, clean, travel-focused, trustworthy, responsive.
Rounded cards, soft spacing, clear CTAs. Inspired by traveldoor.ge style, not copied.

## Coding preferences

- Keep components reusable
- Use clean naming
- Avoid unnecessary dependencies
- Responsive layout — mobile-first
- Semantic HTML
- Do not break existing routes or components
- New shared types go in `packages/shared/src/types/index.ts`
- New shared UI components go in `packages/shared/src/components/` and must be re-exported from `packages/shared/src/index.ts`

## Related projects

Backend: `~/Projects/my-travelline-backend`
- Spring Boot, port 8080
- All API routes prefixed with `/api/`
- CORS allows origins configured via `ALLOWED_ORIGINS` env var
- Production value must include `https://my-travelline.com` and `https://admin.my-travelline.com`
