# MyTravelLine Frontend

Frontend monorepo for [MyTravelLine](https://my-travelline.com) — a travel agency platform with a customer-facing website and an admin dashboard.

## Repository structure

```
my-travelline-frontend/
├── apps/
│   ├── public/          # Customer website  → my-travelline.com
│   └── admin/           # Admin dashboard   → admin.my-travelline.com
├── packages/
│   └── shared/          # @my-travelline/shared — shared types + UI components
└── public/              # Static assets (logo, favicon) shared by both apps
```

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form |
| HTTP | Axios |
| Notifications | react-hot-toast |
| Icons | react-icons |
| Testing | Vitest + Testing Library |
| CI/CD | GitHub Actions + AWS S3 + CloudFront |

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+
- Backend running at `http://localhost:8080` ([my-travelline-backend](https://github.com/lenamargariann/my-travelline-backend))

### Install

```bash
npm install
```

### Run

```bash
# Customer website — http://localhost:5173
cd apps/public && npm run dev

# Admin dashboard — http://localhost:5174
cd apps/admin && npm run dev
```

Both apps proxy `/api` requests to `http://localhost:8080` during development.

### Build

```bash
# Build all workspaces
npm run build

# Build a single app
cd apps/public && npm run build
cd apps/admin && npm run build
```

### Test & lint

```bash
npm test        # run tests across all workspaces
npm run lint    # lint all workspaces
```

## Apps

### `apps/public` — Customer website

No authentication required. Fetches data from public API endpoints.

| Route | Page |
|---|---|
| `/` | Home |
| `/tours` | Tour listing |
| `/tours/:slug` | Tour detail |
| `/destinations` | Destination listing |
| `/destinations/:slug` | Destination detail |
| `/gallery` | Photo gallery |
| `/blog` | Blog listing |
| `/blog/:slug` | Blog post |
| `/about` | About page |
| `/contact` | Contact form |

### `apps/admin` — Admin dashboard

JWT-authenticated. All routes except `/login` are protected.

| Route | Page |
|---|---|
| `/login` | Login |
| `/dashboard` | Stats overview |
| `/tours` | Tour management (CRUD + status) |
| `/categories` | Category management (CRUD) |
| `/destinations` | Destination management (CRUD) |
| `/bookings` | Booking management |
| `/contacts` | Contact message inbox |
| `/blog` | Blog post management (CRUD) |
| `/gallery` | Gallery image upload & management |
| `/reviews` | Review moderation |

Auth uses short-lived JWT access tokens with refresh tokens. On 401, the API client automatically attempts a token refresh; on failure it clears storage and redirects to `/login`.

## Shared package — `@my-travelline/shared`

Located at `packages/shared/src/`.

- **Types** (`types/index.ts`) — all domain and API types shared between both apps
- **LoadingSpinner** — shared UI component

```ts
import type { Tour, TourSummary, Booking } from '@my-travelline/shared';
import { LoadingSpinner } from '@my-travelline/shared';
```

The alias is resolved at build time via Vite path aliases — no separate build step needed for the shared package.

## Environment variables

Each app reads `VITE_API_BASE_URL` at build time. For local development, copy `.env.example` to `.env.local` inside each app directory.

| Variable | Used by |
|---|---|
| `VITE_API_BASE_URL` | Both apps (build time) |

## CI/CD

GitHub Actions runs on every push and pull request to `main` and `develop`.

```
push → lint → typecheck → test → build → deploy (main only)
```

Deployment uploads built assets to AWS S3 and invalidates the CloudFront distribution. Authentication uses GitHub OIDC — no stored AWS credentials.

| Job | Trigger | Target |
|---|---|---|
| `ci-public` | push / PR | Lint, typecheck, test, build public app |
| `ci-admin` | push / PR | Lint, typecheck, test, build admin app |
| `deploy-public` | push to `main` | S3 → CloudFront → `my-travelline.com` |
| `deploy-admin` | push to `main` | S3 → CloudFront → `admin.my-travelline.com` |

**Required GitHub Actions variables:**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `AWS_REGION` | AWS region |
| `S3_BUCKET_NAME` | S3 bucket for the public app |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution for the public app |
| `S3_ADMIN_BUCKET_NAME` | S3 bucket for the admin app |
| `CLOUDFRONT_ADMIN_DISTRIBUTION_ID` | CloudFront distribution for the admin app |

## Related

- **Backend:** [my-travelline-backend](https://github.com/lenamargariann/my-travelline-backend) — Spring Boot, port 8080
