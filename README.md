# Sapiens First website

The public site is a Next.js App Router application using React and TypeScript. Every page is statically generated; styling is Tailwind CSS v4.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` for a production build, `npm run lint` for ESLint, `npm run typecheck` for TypeScript, and `npm run format` to format the source.

## Where things live

- `app/layout.tsx`, `app/globals.css`: shared document, fonts, design tokens, and the only stylesheet. Design tokens live in the `@theme` block as `--color-*` and `--font-*` variables.
- `app/<route>/page.tsx`: each page. The homepage is `app/page.tsx`; `app/not-found.tsx` and `app/error.tsx` are the site-wide 404 and error pages.
- `components/`: shared navigation, footer, signup form, and interactive page behavior. The guide has a dedicated client component because it reads external data.
- `lib/site.ts`: site URLs, current external integrations, and navigation/footer links.
- `lib/cn.ts`: `cn()` joins class names with `clsx` and resolves conflicting Tailwind utilities with `tailwind-merge`, so a `className` override always wins over a component default.
- `public/assets/` and `public/favicons/`: original images, SVGs, and favicon files with unchanged names.
- `app/sitemap.ts` and `app/robots.ts`: canonical public route discovery.
- `next.config.ts`: redirects for the former `.html` URLs.
- `scripts/signup-apps-script.gs`: the existing spreadsheet handler. Keep it until signup moves to Supabase.

Styling is written as Tailwind classes in each component. `app/globals.css` only holds the design tokens, a small base reset, the `.doc-body` typography for the Learn guide, and a few custom utilities (`ink-underline`, `marker`); `npm run format` sorts those classes through `prettier-plugin-tailwindcss`. Barlow Condensed and DM Sans are loaded through Next.js `next/font/google` and self-hosted with the app.

## Current data sources

Signup submissions go to the Google Apps Script endpoint in `lib/site.ts`. The Learn guide loads from a public Google Doc in the browser. Donations go to Zeffy.

The Google Apps Script response is opaque to the browser because the existing endpoint uses a cross origin `no-cors` request. A resolved fetch confirms that the request was sent; it does not prove the spreadsheet saved a row. The guide shows a fallback link to the Google Doc if it cannot be loaded.

## Atlas

`/atlas` ports the upstream organization explorer into React and TypeScript. Its public CSV source lives in `public/data/atlas/`. Production builds validate the data automatically.
