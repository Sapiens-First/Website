# Sapiens First website

The public site is a Next.js App Router application using React and TypeScript. It preserves the previous site's routes, copy, visual assets, fonts, colors, and page layout. Supabase is intentionally not configured yet.

## Local development

Use Node.js 24 LTS (`.nvmrc`).

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` for a production build, `npm run lint` for ESLint, `npm run typecheck` for TypeScript, and `npm run format` to format the source.

## Where things live

- `app/layout.tsx`, `app/globals.css`: shared document, fonts, design tokens, and sitewide styles.
- `app/<route>/page.tsx`, `page.css`: the page and its route scoped styles. The homepage uses `app/page.tsx` and `app/page.css`.
- `components/`: shared navigation, footer, signup form, and interactive page behavior. The guide and events have dedicated client components because they read external data.
- `lib/site.ts`: site URLs, current external integrations, and navigation/footer links.
- `public/assets/` and `public/favicons/`: original images, SVGs, local font, and favicon files with unchanged names.
- `public/archive/`: historical site, served as static files; it is outside the current App Router pages and sitemap.
- `app/sitemap.ts` and `app/robots.ts`: canonical public route discovery.
- `next.config.ts`: redirects for the former `.html` URLs and older route aliases.
- `scripts/signup-apps-script.gs`: the existing spreadsheet handler. Keep it until signup moves to Supabase.

Page CSS selectors are prefixed with `:where(.route-root.route-…)` so styles from one route do not bleed into another during client navigation. The route wrapper uses `display: contents` to preserve the original layout. Shared colors, type, controls, and layout remain in `app/globals.css`. The site still loads Barlow Condensed, DM Sans, and Special Elite from the same Google Fonts URL; the existing local DM Sans Black file remains under `public/assets/`.

## Current data sources

Signup submissions still go to the existing Google Apps Script endpoint. Events still load from the public Google Sheet, and the guide still loads from a public Google Doc. Donations go to Zeffy. The hidden `/learn-01` experiment still uses an Outline share and is excluded from the sitemap and search indexing. These sources can be changed independently when the Supabase phase begins.

The Google Apps Script response is opaque to the browser because the existing endpoint uses a cross origin `no-cors` request. A resolved fetch confirms that the request was sent; it does not prove the spreadsheet saved a row. The event and guide pages show their existing fallback messages if the external feeds cannot be reached.
