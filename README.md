# Sapiens First website

The public site is a Next.js App Router application using React and TypeScript. It preserves the previous site's routes, copy, visual assets, fonts, colors, and page layout. Supabase is intentionally not configured yet.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` for a production build, `npm run lint` for ESLint, `npm run typecheck` for TypeScript, and `npm run format` to format the source.

## Where things live

- `app/layout.tsx`, `app/globals.css`: shared document, fonts, design tokens, and the only stylesheet. Design tokens live in the `@theme` block as `--color-*` and `--font-*` variables.
- `app/<route>/page.tsx`: each page. The homepage is `app/page.tsx`.
- `components/`: shared navigation, footer, signup form, and interactive page behavior. The guide and events have dedicated client components because they read external data.
- `lib/site.ts`: site URLs, current external integrations, and navigation/footer links.
- `lib/cn.ts`: `cn()` joins class names with `clsx` and resolves conflicting Tailwind utilities with `tailwind-merge`, so a `className` override always wins over a component default.
- `public/assets/` and `public/favicons/`: original images, SVGs, and favicon files with unchanged names.
- `app/sitemap.ts` and `app/robots.ts`: canonical public route discovery.
- `next.config.ts`: redirects for the former `.html` URLs and older route aliases.
- `scripts/signup-apps-script.gs`: the existing spreadsheet handler. Keep it until signup moves to Supabase.

Route specific rules in `app/globals.css` are still prefixed with `:where(.route-root.route-…)` so styles from one route do not bleed into another during client navigation. The route wrapper uses `display: contents` to preserve the original layout. New styling should be written as Tailwind classes in the component; `npm run format` sorts those classes through `prettier-plugin-tailwindcss`. Barlow Condensed and DM Sans are loaded through Next.js `next/font/google` and self-hosted with the app.

## Current data sources

Signup submissions still go to the existing Google Apps Script endpoint. Events still load from the public Google Sheet, and the guide still loads from a public Google Doc. Donations go to Zeffy. These sources can be changed independently when the Supabase phase begins.

The Google Apps Script response is opaque to the browser because the existing endpoint uses a cross origin `no-cors` request. A resolved fetch confirms that the request was sent; it does not prove the spreadsheet saved a row. The event and guide pages show their existing fallback messages if the external feeds cannot be reached.

## Atlas

`/atlas` ports the upstream organization explorer into React and TypeScript. Its public CSV source lives in `public/data/atlas/`. Production builds validate the data automatically.
