# Pistachio — Patisserie & Kitchen

A complete, production-minded food ordering front end inspired by the Pistachio menu format. It is built with **React 19, TypeScript, Vite and a small Tailwind CSS layer for the header**, with no UI library and no runtime requests to an external image or font CDN.

The experience includes a responsive category menu, instant search/filter/sort, a persisted shopping bag, a delivery/pickup checkout with validation, and a pre-paint light/dark theme.

> **Demo notice:** this is an independent design/engineering demo, not an official Pistachio site. Branding, menu copy, prices, ratings, address and photography are illustrative and should be replaced before a commercial launch. See [Demo content to replace](#demo-content-to-replace).

![The Pistachio menu in light mode](./docs/preview-menu.webp)

<p align="center">
  <img src="./docs/preview-dark.webp" alt="The Pistachio hero in dark mode" width="58%" />
  &nbsp;
  <img src="./docs/preview-mobile.webp" alt="The mobile cart drawer" width="20%" />
</p>

## What is included

- **Fast ordering path** — short hero and menu copy, one-tap add-to-bag buttons and a focused delivery-or-pickup checkout.
- **Curved sticky header** — an off-white/deep-charcoal bar with gold-accented branding, centred Menu / Our story / Locations links, a live search capsule, an inline theme switch and an SVG bottom edge finished with a 1.5px gold rule and diffused shadow.
- **Five menu categories** — Breakfast & Sandwiches, Cakes, Signature Desserts, Drinks and Accessories — presented as a photographic category-card grid with a live item count and a forest-green “Everything” reset card.
- **Instant discovery** — client-side category filtering, text search (debounced through `useDeferredValue`) and four sort orders, with no page reloads.
- **Cart drawer** — quantity controls, line totals, free-delivery progress, persisted bag and mobile/desktop layouts.
- **Checkout flow** — delivery or pickup, cash or card on delivery, accessible inline validation, a simulated order placement and a confirmation screen.
- **Light/dark themes** — CSS custom-property palettes, pre-paint theme restoration, `0.4s` colour-only page transitions, a `300ms` header cross-fade and `prefers-reduced-motion` support.
- **Self-hosted responsive imagery** — AVIF, WebP and JPEG variants at three widths per image, with `<picture>`, `srcset`, `sizes`, lazy loading, intrinsic dimensions and an AVIF preload for the hero.
- **Self-hosted variable fonts** — Fraunces and Manrope, subset to the Latin character set.
- **Brand-coloured social links** — Instagram, WhatsApp and TikTok buttons in the footer and a fixed right-edge social rail, with official brand treatments, accessible labels and focus styles.
- **Accessible overlays** — focus trapping, Escape handling, focus restoration, scroll locking and semantic dialog labels.
- **No external runtime requests** — fonts, product photos, icons and favicon are all served from the deployment.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19.3 |
| Build | Vite 8.3 |
| Language | TypeScript 7 |
| Styling | Tailwind CSS 4 for the header + plain CSS custom properties for the rest |
| Images | Sharp 0.35 pipeline, AVIF/WebP/JPEG |
| State | React context + `localStorage` |
| Routing | None; intentionally a single client-rendered page |
| Fonts | Self-hosted Fraunces / Manrope variable WOFF2 |

Node **20.19+** is recommended (the project was verified on Node 24.22).

## Quick start

```bash
cd pistachio-menu
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

If PowerShell blocks `npm.ps1` on Windows, call `npm.cmd` instead:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### All commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run build` | Type-check and create the production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run images` | Regenerate every responsive image variant from `sources/` |

## Project structure

```text
pistachio-menu/
├─ index.html                    Theme boot script, SEO/schema, font + hero preloads
├─ public/
│  ├─ fonts/                     Self-hosted WOFF2 files (3)
│  ├─ icons/                     PWA icons (192/512)
│  ├─ images/
│  │  ├─ products/               20 products × 3 widths × 3 formats
│  │  ├─ hero/                   Hero image variants
│  │  └─ story/                  Story image variants
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ site.webmanifest
├─ scripts/
│  └─ optimize-images.mjs        Sharp pipeline (source mapping + resizing)
├─ src/
│  ├─ components/
│  │  ├─ Header, Hero, MenuSection, CategoryCards, MenuGrid
│  │  ├─ ProductCard, ResponsivePicture, QuantityControl
│  │  ├─ CartDrawer, CheckoutDialog, MobileNav, Toast
│  │  ├─ StorySection, Footer, Logo, ThemeToggle, SocialSidebar, Icons
│  ├─ context/
│  │  └─ CartContext.tsx         Persisted cart, validation and derived totals
│  ├─ data/
│  │  └─ menu.ts                 Typed products, categories and sort options
│  ├─ hooks/
│  │  ├─ useDialog.ts            Focus trap, Escape, scroll lock, focus restore
│  │  └─ useTheme.ts             Theme persistence + colour-only transition class
│  ├─ lib/
│  │  ├─ constants.ts            Delivery fee, thresholds, storage keys, social links
│  │  └─ format.ts               KWD formatting and money rounding
│  ├─ styles/
│  │  ├─ tailwind.css            Tailwind utilities, header palette and keyframes
│  │  ├─ tokens.css              Light/dark palettes and design tokens
│  │  ├─ base.css                Fonts, reset, shared primitives
│  │  ├─ layout.css              Hero, story, footer
│  │  ├─ menu.css                Category showcase, results bar, product grid
│  │  └─ overlays.css            Drawer, mobile nav, checkout, toast
│  ├─ App.tsx                    Page state, filtering, overlays, toasts
│  ├─ main.tsx                   React root + provider + style entry
│  └─ vite-env.d.ts
├─ docs/                         README preview images
├─ sources/                      Original photography + generated SVG (build-time only)
├─ tsconfig.json
└─ vite.config.ts
```

## How it works

### 1. Data first

`src/data/menu.ts` is the single source of truth. Products are typed, so a missing category or invalid sort value is caught by TypeScript. Each product stores an image **base path**; the actual format and width are chosen by the browser.

```ts
{
  id: 'pistachio-croissant',
  name: 'Pistachio Croissant',
  description: '24-layer butter croissant, pistachio cream and toasted Sicilian nuts.',
  price: 2.75,
  category: 'breakfast',
  imageBase: '/images/products/pistachio-croissant',
  imageAlt: 'A golden, flaky croissant dusted with sugar on a dark bakery counter.',
  badge: 'Bestseller',
  diet: 'Vegetarian',
}
```

The category cards, mobile navigation, footer links and counts are all derived from the same `CATEGORIES` array. The primary header keeps a shorter editorial nav in `Header.tsx`: **Menu** resets the filters and scrolls to the menu, while **Our story** and **Locations** anchor to `#story` and `#visit`.

### 2. Light/dark theme without a flash

The critical bit happens **before React or the stylesheet loads**, in `index.html`:

```html
<script>
  (() => {
    try {
      const stored = localStorage.getItem('pistachio-theme');
      const preferred = stored === 'light' || stored === 'dark'
        ? stored
        : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = preferred;
      document.documentElement.style.colorScheme = preferred;
      document.getElementById('theme-color').setAttribute(
        'content',
        preferred === 'dark' ? '#1a1d1a' : '#fafafa',
      );
    } catch {
      document.documentElement.dataset.theme = 'light';
    }
  })();
</script>
```

A tiny inline style block paints the correct page background immediately, and the boot script also sets the matching `<meta name="theme-color">` (`#fafafa` / `#1a1d1a`) before the browser chrome paints. `useTheme` keeps the toggle in sync, updates the meta tag, persists the choice as `pistachio-theme`, and adds a short-lived `theme-transitioning` class.

Only colour-related properties are animated during the switch:

```css
html.theme-transitioning body,
html.theme-transitioning body *,
html.theme-transitioning body *::before,
html.theme-transitioning body *::after {
  transition-property: background-color, color, border-color, fill, stroke, box-shadow !important;
  transition-duration: 0.4s !important;
  transition-timing-function: ease-in-out !important;
}
```

The header is the exception: it uses a tighter 300ms cross-fade, so a scoped rule re-declares the property list (without `stop-color`) to keep borders, the Moon/Sun swap and the shadow in step:

```css
html.theme-transitioning .site-header,
html.theme-transitioning .site-header *,
html.theme-transitioning .site-header *::before,
html.theme-transitioning .site-header *::after {
  transition-property: background-color, color, border-color, fill, stroke, box-shadow, opacity, transform !important;
  transition-duration: var(--header-transition-duration) !important;
  transition-timing-function: var(--header-transition-ease) !important;
}
```

The bar and the curve fill share `--header-bg` and the same `background-color` / `fill` / `color` transition, so the curved edge cannot lag a frame behind the bar. `will-change: background-color, fill` is scoped to the `theme-transitioning` class on the header, bar and curve, then released when the class is removed.

No width, height, margin or position is animated; the Moon and Sun icons are cross-faded inside a fixed 18px box, so the header never shifts. The class is removed after 460ms so ordinary hover/focus transitions keep their own timing. Every palette value lives in `src/styles/tokens.css`; changing a token updates both themes consistently.

### 3. Filtering and sorting

`App.tsx` owns `activeCategory`, `query` and `sort`. The query is passed through `useDeferredValue`, so typing remains responsive even when the grid is large. Filtering and sorting happen entirely in memory:

```ts
const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();
const filtered = PRODUCTS.filter((product) => {
  const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
  const matchesQuery = !normalizedQuery
    || `${product.name} ${product.description}`.toLocaleLowerCase().includes(normalizedQuery);
  return matchesCategory && matchesQuery;
});
```

The result count uses `role="status"`/`aria-live="polite"`, category cards expose `aria-pressed`, and resetting requires no network request.

### 4. Cart persistence

`CartProvider` stores only a lean array of identifiers and quantities:

```json
[{ "productId": "pistachio-croissant", "quantity": 2 }]
```

On reload, the cart is rebuilt from `PRODUCTS`, so stale prices or renamed products can never be restored. Invalid entries are discarded, duplicate IDs are removed, and quantities are clamped to **1–20**. Prices are recalculated with `roundMoney` to avoid floating-point artefacts at KWD's three decimal places.

Keys used:

- Cart: `pistachio.bag.v1`
- Theme: `pistachio-theme`

### 5. Overlay accessibility

`useDialog` is shared by the cart, mobile navigation and checkout:

- Locks body scroll while any dialog is open (reference-counted).
- Moves focus to `[data-autofocus]` or the first focusable element.
- Traps **Tab / Shift+Tab** inside the panel.
- Closes on **Escape** (unless an order is being submitted).
- Restores focus to the trigger on unmount.
- Compensates for scrollbar width to avoid layout shift.

The checkout also focuses the first invalid field after a failed submission and moves focus to the confirmation heading on success.

### 6. Images and the Sharp pipeline

`src/components/ResponsivePicture.tsx` is the only place that emits image markup:

```tsx
<picture>
  <source type="image/avif" srcSet={avifCandidates} sizes={sizes} />
  <source type="image/webp" srcSet={webpCandidates} sizes={sizes} />
  <img
    src={`${base}-${fallbackWidth}.jpg`}
    srcSet={jpegCandidates}
    sizes={sizes}
    width={width}
    height={height}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'}
    decoding="async"
    alt={alt}
  />
</picture>
```

The pipeline in `scripts/optimize-images.mjs` generates **198 files** from the source photography:

- Products: `240 / 480 / 800` px wide at `4:3`
- Hero: `640 / 960 / 1280` px wide at `4:5`
- Story: `480 / 800 / 1100` px wide at `4:3`
- Formats: AVIF (quality 52), WebP (quality 78), progressive mozjpeg JPEG (quality 80)

The total on-disk image set is about **4.3 MB**, but a visitor downloads only the handful of candidates they need — normally one AVIF per image. The hero is the only eager image and is preloaded with an AVIF `imagesrcset` in `index.html`.

`width`/`height` attributes plus CSS `aspect-ratio` reservations on the media frames prevent layout shift while images decode. Images below the fold use native `loading="lazy"`.

### 7. Cart and checkout rules

- Currency: **KWD**, shown as `KD 1.234` (three decimals).
- Delivery fee: **KD 1.000**.
- Free delivery from **KD 15.000**; pickup is always free.
- Checkout is intentionally a **front-end simulation**: it waits 650ms, generates a `PST-####` number and clears the bag. There is no server, payment processor, email or SMS integration.

The order confirmation is held in React state, so a refresh after ordering will not preserve it. This is expected for the demo and is the first thing to replace when connecting a backend.

### 8. Curved sticky header

`Header.tsx`, `ThemeToggle.tsx` and `SocialSidebar.tsx` are the Tailwind-heavy components. The header uses a 64px bar on small screens and 72px from `md`, plus a fixed 20px SVG curve, so the sticky header reserves exactly the `--header-height` values (84px / 92px) used by anchor scroll padding.

The bar and curve fill both use `--header-bg` (light `#FAFAFA`, dark `#1A1D1A`) with `text-charcoal dark:text-ivory` (`#2D3748` / `#EAE7E1`). Gold (`#D4AF37`) appears in the pistachio seed, the wordmark dot, the nav hover rule and the curve stroke. The curve is a separate SVG; its fill path overlaps the bar by 1px to hide the antialiasing seam, while the `1.5px` `#D4AF37` stroke keeps `vector-effect="non-scaling-stroke"` and a `drop-shadow(...)`. `preserveAspectRatio="none"` lets the curve stretch across every width while the gold rule stays crisp. The mobile search panel still uses `--header-curve-end` for its own surface.

The navigation reuses the app's existing state rather than introducing a router:

- **Menu** resets category, search and sort, then scrolls to `#menu`.
- **Our story** and **Locations** are native anchors to `#story` and `#visit`.
- **Search** is a controlled capsule from `lg` up. Below `lg`, the search icon opens a compact panel beneath the curve that shares the same `query` state. Typing a non-empty query resets the category to `all`; submitting scrolls to the filtered results.
- **Theme** is a compact Moon/Sun switch with `role="switch"` and `aria-checked`; it calls the shared `useTheme` hook.
- **Cart** opens the drawer, keeps `data-cart-button` for checkout focus restoration, and shows a gold `itemCount` badge ringed with the header surface. The `Bag` label appears from `md` up; the mobile hamburger opens the existing navigation drawer.

The header-specific colours are intentionally scoped: the page itself keeps the warm cream and forest-green Pistachio palette in `tokens.css`. Tailwind's `dark` variant is mapped to `[data-theme='dark']`, so `dark:` utilities follow the same pre-paint theme state as the rest of the app.

Tailwind is deliberately limited. `src/styles/tailwind.css` imports only the theme and utility layers (preflight is omitted), scans `src`, and defines the brand colours and display font. The existing reset is wrapped in `@layer base`, so utilities can override it while the legacy component CSS continues to own the rest of the page.

One small reset worth knowing: because preflight is omitted, the header search input explicitly sets `border-0 bg-transparent p-0 appearance-none`. Without that, the browser's default input border and padding draw a second white box inside the capsule.

### 9. Floating social rail

`SocialSidebar.tsx` renders one fixed `<nav>` at `right-0 top-1/2 -translate-y-1/2`, stacked vertically and kept below the dialog overlays in the stacking order. WhatsApp uses `#25D366`, Instagram uses its radial purple/magenta/orange gradient, and TikTok uses a black face inside a cyan-to-pink gradient rim. Each link slides 6px left on hover and keyboard focus, is labelled for screen readers, and opens in a new tab with `rel="noopener noreferrer"`.

The TikTok rim is built from a `p-px` gradient link with an inset black `<span>`, not a `bg-[linear-gradient(...)_padding-box,...]` utility. Tailwind emits `background-image` for `bg-[…]`, where box keywords are invalid and the browser would discard the declaration; the padded wrapper produces a valid 1px gradient border at every size.

## Build it yourself: recommended order

If you are recreating this from scratch, this sequence keeps the difficult parts isolated:

1. **Scaffold** a Vite React + TypeScript app and remove the template CSS.
2. **Set up tokens and theme boot** first: palettes, critical colours, `data-theme`, pre-paint script, and the short-lived transition class. Test reloads in both themes before adding components.
3. **Model the menu data** and render a static grid. Add filtering and sorting only after the data types are stable.
4. **Build the image pipeline** with Sharp and the source mapping. Generate all widths/formats once, then have components reference base paths.
5. **Add the cart context** with localStorage rehydration, clamping and derived totals. Keep only IDs in storage.
6. **Build overlays** with the shared dialog hook. Add focus trapping, Escape, scroll locking and focus restoration from the start.
7. **Implement checkout** as an explicit state machine: `details → submitting → success`. Validate on submit, focus the first error, and disable closing while submitting.
8. **Finish with performance and accessibility passes**: preload the hero, confirm AVIF selection, check CLS, test keyboard-only use, test 320px–1440px, verify no horizontal scroll, and run `typecheck` + `build`.
9. **Deploy the static `dist/` folder** and replace the demo metadata.

## Customising the menu

### Change prices or copy

Edit `src/data/menu.ts`. Category labels used in navigation also live there. Prices are numbers in KWD; format them with `formatPrice()` rather than hard-coding strings.

### Change delivery rules

Edit `src/lib/constants.ts`:

```ts
export const DELIVERY_FEE = 1;
export const FREE_DELIVERY_THRESHOLD = 15;
export const MAX_CART_QUANTITY = 20;
```

The cart drawer, checkout summary and copy all derive from these values.

### Add a product

1. Put the new photograph in `sources/`.
2. Add a mapping in `scripts/optimize-images.mjs`:
   ```js
   'my-new-cake': 'sources/my-new-cake.jpg',
   ```
3. Run `npm run images`.
4. Add a matching product object to `src/data/menu.ts`:
   ```ts
   imageBase: '/images/products/my-new-cake'
   ```
5. Run `npm run typecheck` and `npm run build`.

Use a photograph with enough resolution for the largest target (800px wide for products) and keep the subject centred; the pipeline crops to 4:3 around the centre.

### Add a category

Add an entry to `CATEGORIES` in `src/data/menu.ts`. `CategoryId`, the category cards, mobile navigation, counts and footer links update automatically. Add a matching entry to `CATEGORY_ART` in `src/components/CategoryCards.tsx` for the card photograph and blurb. The primary header keeps its curated shop links, so edit the nav in `src/components/Header.tsx` if the offer changes. Assign products to the new `id`; no CSS change is required.

### Replace the theme

All colours are semantic tokens in `src/styles/tokens.css`. Update both the light `:root` block and the `html[data-theme='dark']` block. Keep the `--feature-*` tokens for the dark forest story band if you want to preserve that section's contrast.

### Replace fonts or brand assets

- Fonts: replace files in `public/fonts/` and update the `@font-face` rules in `src/styles/base.css`; update preloads in `index.html`.
- Header logo: replace `public/images/logo.jfif` (144×140). Keep the same aspect ratio, or update the `width`/`height` attributes in `src/components/Header.tsx`.
- Logo/favicon: edit `src/components/Icons.tsx` (`PistachioMark`) and `public/favicon.svg`; regenerate `public/icons/icon-*.png` from the SVG.
- Manifest: update `public/site.webmanifest`.

## Production integration checklist

The UI is ready to be wired to a real ordering system. The main integration point is `handleSubmit` in `src/components/CheckoutDialog.tsx`.

### Orders API

Send **product IDs and quantities**, plus fulfilment, payment choice and customer details. Do not trust client-side prices:

```ts
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    fulfilment,
    payment,
    customer: fields,
  }),
});
```

The server should:

1. Re-price every line from its own catalogue.
2. Validate stock, delivery area, minimum order and opening hours.
3. Recalculate delivery fee and tax.
4. Return an authoritative order number, total and ETA.
5. Be idempotent (accept an idempotency key) to prevent double orders on retry.

Handle network errors and timeouts in the `submitting` phase; never clear the cart until the server confirms. The current 650ms timer is only a placeholder.

### Payments

- The demo only supports **cash** and **card on delivery**.
- Never collect raw card numbers in this UI. Use a hosted payment page or tokenisation from a PCI-compliant provider.
- For Kuwait, integrate a supported local gateway (for example KNET via a licensed PSP) or an international provider that supports KWD.
- Keep payment confirmation server-side and verify webhooks before marking an order paid.

### Other backend work

- Persist customer and order data; send email/SMS confirmations.
- Add real delivery zones, fees, lead times and time-slot selection.
- Add stock/availability and per-item sold-out states.
- Add cross-tab cart synchronisation (the `storage` event) if multiple tabs are common.
- Add analytics/consent only if required; the current app ships none.
- Add Arabic/RTL support if the audience requires it; the layout uses logical spacing in most places but copy and some alignment need review.

## Deployment

The app is a static SPA with no router, so deployment is straightforward.

```bash
npm ci
npm run build
# deploy the generated dist/ directory
```

### Static hosts

- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`, output directory `dist`, Node 20+.
- **S3 + CloudFront / any Nginx:** upload `dist/`, serve `index.html` for `/`, and keep the `/assets`, `/images` and `/fonts` paths intact.
- Because there is no client-side router, no SPA rewrite rule is required. A catch-all to `index.html` is harmless.

### Caching

Example Nginx fragment:

```nginx
root /var/www/pistachio/dist;
index index.html;

location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location /images/ {
  # These filenames are not content-hashed. Use a shorter cache, or rename
  # files whenever the photography changes.
  add_header Cache-Control "public, max-age=604800";
}

location /fonts/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location = /index.html {
  add_header Cache-Control "no-cache";
}
```

`dist/assets/*` is fingerprinted by Vite and is safe to cache for a year. Product image filenames are stable, so either use a moderate TTL or add a version/hash to the filename when replacing photos.

### Before launch

1. Replace `https://pistachio.example` in `index.html` (Open Graph image and metadata) and `public/robots.txt` with the production domain.
2. Replace the Salmiya address, opening hours, social profile links, map link and JSON-LD business data.
3. Replace `public/site.webmanifest` icons/name if the brand changes.
4. Confirm the host serves `.avif`, `.webp` and `.woff2` with correct MIME types.
5. Enable HTTPS, Brotli/gzip for HTML/CSS/JS, and sane security headers. If adding a strict CSP, account for the inline theme-boot script, the critical style block and the JSON-LD block in `index.html` (use hashes/nonces rather than guessing).
6. If deploying under a subpath rather than the domain root, set Vite `base` and prefix the root-relative image paths in `src/data/menu.ts` with `import.meta.env.BASE_URL`. Deploying at the root is simplest.

### Performance expectations

The production build at the time of writing:

| Asset | Size | Gzip |
| --- | --- | --- |
| HTML | 4.33 kB | 1.72 kB |
| CSS | 81.51 kB | 15.53 kB |
| JavaScript | 283.31 kB | 86.09 kB |
| Fonts (3 files) | ~105 kB | — |
| Image set on disk | ~4.3 MB (198 variants) | — |

The JavaScript includes React and all UI code; there is no icon library or external client. The browser fetches one image candidate per rendered image, not the entire set. The hero is preloaded and eager; all product and story images are lazy. In the production test, all 23 rendered images resolved as AVIF in Chrome with no failed requests and zero horizontal overflow at 1440px, 390px and 320px.

## Accessibility notes

- Skip link to `#main-content`.
- Native buttons, labels, selects and form controls throughout.
- Visible `:focus-visible` rings using `--focus-ring`.
- `aria-pressed` on category cards; live result count; labelled quantity groups.
- Dialogs use `role="dialog"`, `aria-modal`, labelled headings and a real focus trap.
- Escape closes overlays; focus returns to the trigger.
- Form errors are associated with fields via `aria-describedby`; the first invalid field receives focus.
- Mobile text fields use 16px type — the iOS Safari threshold that prevents unwanted zoom-on-focus.
- `aria-busy` and a disabled submit button during the simulated submission.
- `prefers-reduced-motion` disables non-essential animation and smooth scrolling.
- Colour palettes use semantic tokens with strong text/background contrast in both themes.

## Verification performed

- `npm run typecheck` — passes.
- `npm run build` — passes; production bundle served successfully with `npm run preview`.
- Browser QA at 1440×1000, 1024×800, 768×900, 390×844 and 320×700:
  - Sticky header stays at `top: 0`, reserves 92px on tablet/desktop and 84px on mobile; the category-card grid follows the menu heading with no sticky bar beneath the header.
  - The curved SVG spans the viewport at every width; computed styling confirms the `1.5px` `rgb(212, 175, 55)` stroke, non-scaling vector effect and soft drop shadow. The bar and curve fill both resolve to `#FAFAFA` in light mode and `#1A1D1A` in dark mode; the curve path overlaps the bar by 1px so the join has no antialiasing gap, and the static drop shadow remains the only tonal difference.
  - The bar computes to `rgb(250, 250, 250)` in light mode and `rgb(26, 29, 26)` in dark mode; the logo seed and wordmark dot use `#D4AF37`, and the cart badge ring matches the active header surface.
  - Centred Menu / Our story / Locations navigation, the search capsule, theme switch, labelled Bag button and logo remain inside the viewport with zero horizontal overflow at 1440, 1024, 768, 390 and 320px.
  - Menu resets category, search and sort and lands `#menu` 120px below the viewport top; Our story and Locations land on `#story` and `#visit` through the global scroll padding.
  - Header search stays synchronised with the menu grid, resets the category when non-empty, and scrolls to the filtered results on submit. Below `lg`, the search icon opens the shared-query panel beneath the curve and restores focus on close.
  - Theme toggle switches palettes, updates `<meta name="theme-color">` to `#fafafa` / `#1a1d1a`, persists across reload and removes the transition class after 460ms. During the switch the page uses `0.4s`; the header bar, curve fill and Moon/Sun icons use `0.3s`, and frame analysis confirms the bar and curve fill interpolate together, with the static drop shadow as the only remaining tonal offset at the join. Header, bar, logo, nav, search, theme-button and cart rectangles are identical before and after, so there is no layout shift.
  - Mobile drawer includes Home and Special orders, closes cleanly, and the checkout flow returns focus to the header cart button.
  - Floating social rail stays fixed at the same viewport position while scrolling; its WhatsApp, Instagram and TikTok links keep `target="_blank"`, `rel="noopener noreferrer"` and descriptive labels. The rail slides 6px on hover/focus and does not cover visible Add buttons at 320-1440px.
  - All 23 rendered images loaded (AVIF), no broken images, no failed requests.
  - Category filtering, search and all sort modes.
  - Theme toggle, persistence across reload, page/header transition timing and transition class cleanup.
  - Cart add, quantity increase/decrease, persistence and free-delivery threshold.
  - Checkout validation, first-error focus, submitting state, success screen, cart clearing.
  - Delivery/pickup switch, free pickup, adaptive payment labels.
  - Mobile checkout: scrollable full-height panel, reachable order CTA, 48px fields at 16px type, one-column layout at 320px.
  - Instagram, WhatsApp and TikTok buttons: correct brand colours, 42px targets, external links and no overflow in light, dark and mobile themes.
  - Focus trap across repeated Tab presses; Escape close; focus restoration; scroll lock/unlock.
  - Zero console errors or page errors.

## Asset credits

Photography is local to the project; no image CDN is contacted at runtime. Sources, licences and processing notes are documented in [ASSET-CREDITS.md](./ASSET-CREDITS.md).

The photography is illustrative and should be replaced with your own product shots for a real menu. The generated canvas-tote artwork is original to this demo.

## Demo content to replace

- **Domain:** `https://pistachio.example` in Open Graph metadata and `robots.txt`.
- **Brand and copy:** all product names, descriptions and “Since 2019” copy.
- **Location and hours:** Salmiya address, opening hours, map link, JSON-LD.
- **Social profiles:** Instagram, WhatsApp and TikTok URLs in `src/lib/constants.ts`; the WhatsApp number and profile handles are placeholders.
- **Contact details:** checkout placeholder phone/email, no real contact endpoint.
- **Menu data:** prices, categories, badges, dietary tags and availability.
- **Ordering:** the 650ms simulated checkout and `PST-####` number.
- **Legal:** replace the photography if you do not want stock imagery, and review the Unsplash/Wikimedia terms for your use.

## Licence

The application code is provided as a starting point for this project. Third-party photography remains subject to the licences listed in [ASSET-CREDITS.md](./ASSET-CREDITS.md). The Pistachio name and any third-party trademarks are not granted by this demo.
