# Sapiens First website

The public site is a Next.js App Router application using React and TypeScript. Content pages are statically generated; campaign signatures use a Server Action. Styling is Tailwind CSS v4.

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
- `lib/site.ts`: site URLs, current external integrations, and page metadata. Navigation and footer links live in `components/SiteHeader.tsx` and `components/SiteFooter.tsx`.
- `lib/cn.ts`: `cn()` joins class names with `clsx` and resolves conflicting Tailwind utilities with `tailwind-merge`, so a `className` override always wins over a component default.
- `public/assets/` and `public/favicons/`: original images, SVGs, and favicon files with unchanged names.
- `app/sitemap.ts` and `app/robots.ts`: canonical public route discovery. The public route list lives in `app/sitemap.ts`.
- `next.config.ts`: Atlas subdomain rewrite and permanent redirects from old Atlas URLs.

Styling is written as Tailwind classes in each component. `app/globals.css` only holds the design tokens, a small base reset, the `.doc-body` typography for the Learn guide, and a few custom utilities (`ink-underline`, `marker`); `npm run format` sorts those classes through `prettier-plugin-tailwindcss`. Barlow Condensed and DM Sans are loaded through Next.js `next/font/google` and self-hosted with the app.

## Brand colors

Palette C and the logo/favicons share the [brand color guide](docs/brand-colors.md). Preview website changes on localhost for Rohan’s approval before batch publication.

## Current data sources

Campaign detail pages collect public signatures through a Server Action and Supabase. See [campaign intake](docs/campaign-intake.md) for storage, consent, duplicate handling and verification.

Atlas's canonical address is `https://atlas.sapiensfirst.org/`. The same Vercel project serves the root by rewriting it internally to `/atlas`; `/atlas` and `/atlas.html` permanently redirect to the new address, preserving query strings and browser record fragments. Shared navigation links to the main website, and other page requests on the Atlas host redirect there. Static assets and API routes stay on the requested origin. Atlas metadata and the sitemap use the new address. No database or authentication configuration changes are required.

Before release, confirm `atlas.sapiensfirst.org` is attached to the existing Vercel project's Production environment with working DNS and HTTPS. Follow the branch/PR and local review workflow; after the approved squash merge, verify the Atlas root, legacy record links, assets, main-site navigation and sign-in on Production.

Circle and Fellowship interests are open to everyone and stored in Supabase. Campaign signatures are open to everyone and stored in Supabase. The Learn guide loads from a public Google Doc in the browser. Donations go to Zeffy.
