# MyTravelLine Frontend — Monorepo

This is the frontend monorepo for MyTravelLine, a travel agency website.
It uses **npm workspaces** and contains two deployable apps and one shared package.

## Repository layout

```
my-travelline-frontend/
├── apps/
│   ├── mytravelline/    # Customer-facing website  (my-travelline.com)
│   └── admin/           # Admin dashboard  (admin.my-travelline.com)
├── packages/
│   └── shared/          # @my-travelline/shared — types + LoadingSpinner
└── public/              # Static assets (logo.svg, logo.png) shared by both apps
```

## Running locally

```bash
npm install                      # install all workspaces from root
cd apps/mytravelline && npm run dev    # http://localhost:5173
cd apps/admin  && npm run dev    # http://localhost:5174
```

Both apps proxy `/api` to `http://localhost:8080` in dev.
Start the backend first: `~/Projects/my-travelline-backend`

## Building

```bash
# from repo root — builds all workspaces
npm run build

# or per app
cd apps/mytravelline && npm run build
cd apps/admin  && npm run build
```

## Testing & linting

```bash
npm test          # runs tests in all workspaces
npm run lint      # lints all workspaces
```

## Environment variables

Each app reads these at build time (set in GitHub Actions as `vars.*`).
Copy `.env.example` to `.env.local` inside each app for local overrides.

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (e.g. `http://localhost:8080`) |
| `VITE_S3_BASE_URL` | S3 bucket base URL for media images (e.g. `https://my-travelline-media-prod.s3.eu-north-1.amazonaws.com`) |
| `VITE_DEFAULT_CURRENCY` | Default currency code (e.g. `USD`). Falls back to `USD` if unset. |

`VITE_S3_BASE_URL` is required for any image to appear. The `imageUrl()` helper in `apps/mytravelline/src/lib/imageUrl.ts` prepends this to raw S3 keys stored in `coverImage` fields. Without it, all images silently render as `src=""` and make no network request.

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

## apps/mytravelline

Routes: `/`, `/tours`, `/tours/:slug`, `/destinations`, `/destinations/:slug`,
`/gallery`, `/blog`, `/blog/:slug`, `/about`, `/contact`

- No authentication
- Simple Axios client (`src/api/client.ts`) — no JWT interceptors
- Public API endpoints only (`src/api/endpoints.ts`)

### Key components

| File | Purpose |
|---|---|
| `src/components/PageShell.tsx` | Wraps every page — renders `PageBackground`, `Navbar`, `<main>`, `Footer` |
| `src/components/Navbar.tsx` | Sticky navbar with language switcher, currency switcher, Book Now CTA |
| `src/components/Footer.tsx` | Glass footer strip with logo + copyright + Privacy/Terms/Support links |
| `src/components/PageBackground.tsx` | Fixed-position gradient background + accent orbs |
| `src/components/ui/T.tsx` | Translatable element wrapper — adds `data-translatable="true"` for language-change animation |
| `src/components/ui/TourCard.tsx` | Tour card used on Home and Tours pages |

### Internationalisation (i18n)

The public app supports **three locales: English (`en`), Armenian (`hy`), Russian (`ru`)**.

- Locale files: `src/locales/{en,hy,ru}/translation.json`
- Library: `react-i18next`, initialised in `src/i18n.ts`
- Preferred language is persisted in `localStorage` under key `i18n_language`

**Adding or updating translated strings:**
1. Add the key + English value to `src/locales/en/translation.json`
2. Add the Armenian translation to `src/locales/hy/translation.json`
3. Add the Russian translation to `src/locales/ru/translation.json`
4. Use `t('key')` in components

**`T` component** (`src/components/ui/T.tsx`):
Wrap any visible translated string in `<T>` so it participates in the language-change animation. It renders as `<span>` by default; use `as` prop to change the tag.

```tsx
<T as="h2">{t('home.featuredTours')}</T>
<T>{t('common.exploreTours')}</T>
```

Do **not** wrap dynamic data (tour names, prices, API content) in `<T>` — only wrap `t()` calls.

**Language transition animation** (`src/context/LanguageTransitionContext.tsx`):
All `[data-translatable]` elements fade out simultaneously, the language switches while invisible, then they stagger back in over 160ms. Triggered via `useLangTransition().triggerChange(lang)`. The `busy` flag is exposed to disable language buttons during the transition.

Animation keyframes are defined in `src/styles/global.css`:
- `langOut` — uniform fade out (0.15s ease-in, no stagger)
- `langIn` — fade + translateY(4px) in (0.22s ease-out, staggered via `--lang-delay` CSS custom property)

### Currency system

- Context: `src/context/CurrencyContext.tsx` + `src/context/currencyContextDef.ts`
- Hook: `src/hooks/useCurrency.ts` — exposes `selectedCurrency`, `setCurrency`, `formatPrice`
- Utility: `src/utils/currency.ts` — `SUPPORTED_CURRENCIES` list, `formatPrice()` formatter
- Persisted in `localStorage` under key `preferred_currency`
- API calls pass `currency` param so the backend returns pre-converted prices in `convertedPrice`

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
| `deploy-public` | push to main only | upload `apps/mytravelline/dist/` → S3 → invalidate CloudFront |
| `deploy-admin` | push to main only | upload `apps/admin/dist/` → S3 → invalidate CloudFront |

AWS auth uses GitHub OIDC (no stored keys):
`arn:aws:iam::947927347939:role/github-actions-mytravelline-frontend-prod`

**Required GitHub Actions variables (`vars.`):**

| Variable | Used by |
|---|---|
| `VITE_API_BASE_URL` | both build jobs |
| `VITE_S3_BASE_URL` | both build jobs |
| `AWS_REGION` | both deploy jobs |
| `S3_BUCKET_NAME` | deploy-public |
| `CLOUDFRONT_DISTRIBUTION_ID` | deploy-public |
| `S3_ADMIN_BUCKET_NAME` | deploy-admin |
| `CLOUDFRONT_ADMIN_DISTRIBUTION_ID` | deploy-admin |

---

## Brand

**Logo:** `public/logo.svg` (and `logo.png`). Always render using the actual SVG
file — never substitute with text or a placeholder div.

**Colors — CSS custom properties (define in `:root` of every page):**

```css
:root {
  --ink: #07202f; /* primary text */
  --ink-60: rgba(7, 32, 47, 0.60); /* secondary text */
  --ink-35: rgba(7, 32, 47, 0.35); /* muted / labels */
  --ink-18: rgba(7, 32, 47, 0.18); /* borders, dividers */
  --teal: #2E7D9C; /* brand blue-teal — primary accent */
  --orange: #CB2912; /* brand red — CTA, highlights */
}
```

**Fonts — load both from Google Fonts on every page:**

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700&family=Noto+Sans:wght@300;400;500;600&family=Noto+Sans+Armenian:wght@300;400;500;600&display=swap');
```

| Role | Font | Weight |
|---|---|---|
| Display headings (h1, hero) | Nunito | 700–800, italic variant for accents |
| Section headings (h2, h3) | Nunito | 600–700 |
| Body / UI text | Noto Sans | 300–500 |
| Armenian script | Noto Sans Armenian | 300–500 |
| Buttons — primary | Nunito | 700 |
| Buttons — secondary / nav | Noto Sans | 400–500 |
| Stat numbers | Nunito | 800 |
| Labels / eyebrows | Noto Sans | 500–600, uppercase, letter-spacing 0.08–0.12em |

---

## Design system

### Background

Every page uses a **fixed, full-viewport light glassmorphism background** that does
not scroll with content. This keeps the gradient seamless no matter how tall the page is.

```css
html, body { margin: 0; padding: 0; background: #a8d4ee; }

.bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 90% 65% at 15%   0%,  #a8d8f5 0%, transparent 55%),
    radial-gradient(ellipse 65% 58% at 82% 100%,  #d4a8b8 0%, transparent 50%),
    radial-gradient(ellipse 50% 50% at 55%  35%,  #96ccec 0%, transparent 52%),
    linear-gradient(165deg, #c8e6f7 0%, #a8d4ee 28%, #82bfe0 58%, #5aadd4 100%);
}
```

Accent orbs (also `position: fixed`, `z-index: 0`, `pointer-events: none`):
- Top-left white bloom: `rgba(255,255,255,0.32)`, `filter: blur(90px)`
- Bottom-right brand-red bloom: `rgba(180,60,55,0.18)`, `filter: blur(90px)`
- Mid-right teal bloom: `rgba(140,200,235,0.30)`, `filter: blur(90px)`

Do not use any horizontal rule lines, repeating stripe patterns, or additional
overlay panels on top of this background — they fragment the gradient.

The page root wrapper (`min-height: 100vh`, `position: relative`) must **not** have
`overflow: hidden` — that clips the scrollable content.

### Glassmorphism surface (card / panel)

All content panels, cards, modals, and section wrappers use this recipe:

```css
background:    rgba(255,255,255,0.42);
backdrop-filter: blur(20px) saturate(160%);
-webkit-backdrop-filter: blur(20px) saturate(160%);
border:        1px solid rgba(255,255,255,0.75);
border-radius: 16px;           /* 20px for large section panels */
box-shadow:    0 4px 40px rgba(46,125,156,0.10),
               inset 0 1px 0 rgba(255,255,255,0.85);
```

Stronger glass (search bar, navbar):
```css
background:    rgba(255,255,255,0.58);
backdrop-filter: blur(28px) saturate(180%);
border:        1px solid rgba(255,255,255,0.88);
box-shadow:    0 6px 40px rgba(46,125,156,0.12),
               inset 0 1px 0 rgba(255,255,255,1.00);
```

### Navbar

- `position: sticky; top: 0; z-index: 20` — always sticky, never absolute
- Height: 66px, padding: 0 40px
- Uses the strong glass recipe above
- `border-bottom: 1px solid rgba(255,255,255,0.75)`
- Active nav link: `border-bottom: 1.5px solid var(--teal)` underline
- Language buttons: `32×32px`, `border-radius: 8px`, border `var(--ink-18)`;
  active state: `background: rgba(46,125,156,0.10)`, border `rgba(46,125,156,0.40)`;
  disabled (during language transition): `opacity: 0.55`, `cursor: not-allowed`
- Currency pill: same 8px radius, matches language button style
- "Book Now" CTA: `background: var(--orange)`, `border-radius: 8px`, Nunito 600,
  `box-shadow: 0 3px 14px rgba(203,41,18,0.28)`, hover lift + stronger shadow
- Entry animation: `slideDown` — `opacity: 0, translateY(-16px)` → normal, 0.65s

### Buttons

**Primary (red CTA):**
```css
padding: 13px 30px;
background: var(--orange);
border: none; border-radius: 10px;
color: #fff; font-family: 'Nunito'; font-size: 14px; font-weight: 700;
box-shadow: 0 4px 22px rgba(203,41,18,0.30);
```
Hover: `translateY(-2px)`, stronger shadow.

**Secondary (glass):**
```css
padding: 12px 28px;
background: rgba(255,255,255,0.58);
backdrop-filter: blur(16px);
border: 1.5px solid rgba(255,255,255,0.90);
border-radius: 10px;
color: var(--ink); font-family: 'Nunito'; font-size: 14px; font-weight: 500;
```
Hover: `background: rgba(255,255,255,0.78)`, `translateY(-2px)`.

### Eyebrow labels

Appear above section headings to provide context. Always wrap in `<T>` and use a
translation key — never hardcode the string:

```tsx
<T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>
  {t('section.eyebrow')}
</T>
```

```css
display: inline-block;
font-family: 'Noto Sans'; font-size: 10.5px; font-weight: 600;
letter-spacing: 0.12em; text-transform: uppercase;
color: var(--teal);
background: rgba(46,125,156,0.10);
border: 1px solid rgba(46,125,156,0.20);
padding: 5px 14px; border-radius: 30px;
```

### Section layout

Each content section below the hero:

```css
.section        { position: relative; z-index: 10; padding: 80px 40px; }
.section-inner  { max-width: 1100px; margin: 0 auto; /* glass panel recipe */ padding: 56px 60px; }
```

Section h2: Nunito 700, 42px, `color: var(--ink)`, `letter-spacing: -0.02em`
Section body text: Noto Sans 300, 15px, `color: var(--ink-60)`, `line-height: 1.75`

### Cards (tour, blog, destination)

```css
border-radius: 14px; overflow: hidden;
background: rgba(255,255,255,0.55);
border: 1px solid rgba(255,255,255,0.80);
box-shadow: 0 4px 20px rgba(46,125,156,0.08);
transition: transform 0.25s, box-shadow 0.25s;
```
Hover: `translateY(-6px)`, `box-shadow: 0 10px 30px rgba(46,125,156,0.15)`.

Card image area: real `<img>` from `imageUrl(coverImage)`. If no image, use a
`linear-gradient` placeholder based on the destination region's color palette.
**Do not use emoji or icons as image substitutes inside the image area.**

Card body: padding 18px 20px. Destination label: Noto Sans 500, 10.5px, uppercase,
`color: var(--ink-35)`. Title: Nunito 700, 18px, `color: var(--ink)`.
Price: Nunito 800, 20px, `color: var(--teal)`.

**TourCard footer** — stacked vertically: price → duration → CTA button. Never
put price and button side-by-side (long translations overflow on smaller cards).

Card footer CTA button (small, inline):
```css
display: inline-block;
background: rgba(46,125,156,0.10);
border: 1px solid rgba(46,125,156,0.20);
border-radius: 8px;
font-family: 'Nunito'; font-size: 12px; font-weight: 600; color: var(--teal);
```

### Animations

Use these named keyframes consistently across all pages (defined in `src/styles/global.css`):

```css
@keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideDown{ from { opacity:0; transform:translateY(-16px);} to { opacity:1; transform:translateY(0); } }
@keyframes sweep    { 0%{left:-100%;} 55%,100%{left:160%;} }
@keyframes pulse    { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.45);} 70%{box-shadow:0 0 0 6px rgba(34,197,94,0);} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0);} }
@keyframes langOut  { from { opacity:1; } to { opacity:0; } }
@keyframes langIn   { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
```

Stagger page load with `animation-delay` increments of ~0.12–0.15s per element.

### Icon usage policy

**Icons are used sparingly.** They are never decorative filler. Allowed uses:
- A single small indicator dot (e.g. live-status pulse dot) on a data card
- A directional arrow (`→`, `↓`) inline in button text or scroll hints
- A `✦` glyph in an eyebrow pill, used at most once per page

**Not allowed:**
- Emoji icons inside card bodies, feature tiles, or list items
- Icon-per-feature grids (replace with typographic treatments — bold label + short
  description, or a numbered list)
- Emoji substituting for real images in tour/destination card image areas
- More than one decorative glyph per section

---

## Page-by-page design direction

Every page shares the same fixed background, navbar, glass card system, font stack,
and color tokens. Each page has a **unique layout identity** — do not repeat the
hero search-bar pattern on inner pages.

### `/` — Home

- **Hero:** Full-viewport centered layout. Large Nunito display headline split
  across two lines (`font-weight: 400 italic` first line full-viewport-width,
  `font-weight: 400 italic` accent word). Eyebrow pill. Two CTA buttons. Integrated
  search bar (destination / departure / travelers) flush-connected to a 4-column
  stats strip below it. Three small absolute-positioned floating glass data cards
  on the sides.
- **Featured Tours:** 3-column card grid inside a glass section panel.
- **Why Us:** 2-column layout — editorial copy left, 2×2 feature tile grid right.
  Feature tiles use **text only** (bold title + short description) — no icons.

### `/tours` — Tour listing

- **Page header:** Centered. Eyebrow + h1. Short subheading.
- **Layout:** 3-column grid. Cards use real tour images.
  Filter bar above the grid — glass panel with category, destination, and search selectors.
- **No hero banner** — the fixed background gradient provides atmosphere.

### `/tours/:slug` — Tour detail

- **Layout:** 2-column above the fold — left ~58% is the tour image hero (full
  bleed, rounded corners, real photo from S3). Right ~38% is a glass booking
  panel: price, duration, group size, "Book Now" primary CTA, "Enquire" secondary.
- **Below fold:** Full-width glass section panels for description, itinerary
  (numbered days, no icons — just day number + title + description), and reviews.
- **Itinerary days:** Numbered with a large Nunito 800 day number in `var(--teal)`,
  no icons.
- **Booking panel labels** (Duration, Group size, Destination, Category) use
  `t('tours.detail.*')` keys — never hardcoded.

### `/destinations` — Destinations listing

- **Layout:** Editorial grid — large featured destination card (2-column width,
  taller image) paired with two smaller cards beside it. Alternates per row.
- **Card treatment:** Destination name overlaid on image with a glass name plate
  at the bottom of the card (`backdrop-filter: blur(12px)`, white text).
- **No icon decoration** — the photography and gradient placeholders carry the visual.

### `/destinations/:slug` — Destination detail

- **Hero:** Full-width image strip (560px tall) with the destination name as a
  large Nunito 700 overlay, centered, white, with a subtle dark gradient at the
  bottom of the image.
- **Below:** 2-column layout — left is editorial prose, right is a sticky glass
  sidebar showing tours available to that destination.

### `/gallery`

- **Layout:** Responsive CSS grid masonry (4 columns). No cards — images tile
  edge-to-edge with `gap: 4px`. Hovering an image shows a glass overlay with the
  caption, no icons.
- **Page header:** Minimal — just eyebrow + h1 + subheading, centered, above the grid.

### `/blog`

- **Layout:** Featured article at top (full-width card, image left ~45%, text right).
  Below: 3-column card grid of remaining posts.
- **Post cards:** Image, category eyebrow pill (dynamic tag from API), title in
  Nunito 600, date + reading time in Noto Sans 300 — no icons for date or time.

### `/blog/:slug` — Blog post

- **Layout:** Centered single-column prose, max-width 720px, inside a glass panel.
  Reading progress bar at top (thin teal line, `position: fixed` at very top of
  viewport, `z-index: 30`).
- **Typography:** Noto Sans 400 body, 16.5px, line-height 1.85. Drop cap on first
  paragraph (`::first-letter`, Nunito 700, 3.5× size). Section sub-headings:
  Nunito 600, 22px.

### `/about`

- **Layout:** Hero is a split panel — left: large editorial headline + 2 paragraphs
    + primary CTA. Right: a `2×2` glass stat grid (15 years / 85+ destinations /
      12K+ travelers / 4.9 rating) using Nunito 800 numbers, no icons.
  Stat labels use `t('about.stats.*')` keys.
- **Below:** Values section (4-column tile grid, text only), then full-width team
  section — horizontal scrollable strip of staff glass cards with colored initials
  circles (Nunito 600 initials, no avatar icons).

### `/contact`

- **Layout:** 2-column, `maxWidth: 860px`. Left: glass form panel (name, email,
  subject, message textarea × 4 rows, submit CTA). Right: glass info panel with
  address, phone, email, hours — and the **brand logo** (`/logo.svg`) filling the
  remaining height below the info rows.
- Both panels use `padding: 32px`, `borderRadius: 20px`, heading `fontSize: 24px`.
- **Form inputs:** `border-radius: 8px`, `border: 1px solid var(--ink-18)`,
  `background: rgba(255,255,255,0.55)`, `backdrop-filter: blur(10px)`.
  Focus state: `border-color: var(--teal)`, `box-shadow: 0 0 0 3px rgba(46,125,156,0.12)`.
- Right panel is `display: flex; flex-direction: column` so the logo area uses
  `flex: 1; minHeight: 80px` to fill remaining height without hardcoding sizes.

---

## Footer

Consistent across all pages. Glass strip at bottom of every page:

```css
position: relative; z-index: 10;
border-top: 1px solid rgba(255,255,255,0.45);
padding: 24px 40px;
background: rgba(255,255,255,0.25);
backdrop-filter: blur(20px);
```

Left: logo mark + copyright.
Right: Privacy · Terms · Support links, Noto Sans 13px, `color: var(--ink-35)`.
All link text uses `t('footer.privacy')`, `t('footer.terms')`, `t('footer.support')`.
No social icons.

---

## Coding preferences

- Keep components reusable
- Use clean naming — no `wrapper`, `container2`, `box-inner` etc.
- Avoid unnecessary dependencies
- Responsive layout — mobile-first; all grids collapse to single column below 768px
- Semantic HTML — `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` etc.
- Do not break existing routes or components
- New shared types go in `packages/shared/src/types/index.ts`
- New shared UI components go in `packages/shared/src/components/` and must be
  re-exported from `packages/shared/src/index.ts`
- The CI pipeline uses `--max-warnings 0` — fix all TypeScript and ESLint warnings
  before committing
- **All visible text must use `t()` — no hardcoded strings in JSX.** Wrap `t()` calls
  in `<T>` so they animate during language transitions. Dynamic API data (tour titles,
  prices, names from the backend) does not need `<T>`.

## Related projects

Backend: `~/Projects/my-travelline-backend`
- Spring Boot, port 8080
- All API routes prefixed with `/api/`
- CORS allows origins configured via `ALLOWED_ORIGINS` env var
- Production value must include `https://my-travelline.com` and `https://admin.my-travelline.com`
