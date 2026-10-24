# Sapiens First website

The public site is a Next.js App Router application using React and TypeScript. Content pages are statically generated; campaign signatures use a server-side API route. Styling is Tailwind CSS v4.

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

## Brand colors

Palette C and the logo/favicons share the [brand color guide](docs/brand-colors.md). Preview website changes on localhost for Rohan’s approval before batch publication.

## Current data sources

Campaign detail pages collect signatures through a same-origin API and the existing Supporter List connection. See [campaign intake](docs/campaign-intake.md) for fields, consent, CRM handoff, duplicate handling and deployment checks. Run `npm run test:campaigns` for the signature contract/storage tests.

Signup submissions go to the Google Apps Script endpoint in `lib/site.ts`. The Learn guide loads from a public Google Doc in the browser. Donations go to Zeffy.

## Supabase connection

The connection uses the Website project in the SapiensFirst organization. Its public Atlas tables contain the initial CSV snapshot.

Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from the project's Connect dialog. `.env.local` is Git-ignored. Add the same variables to the appropriate Vercel environment before deploying database-dependent changes.

## Google sign-in

Set `APP_URL` to the exact website origin: `http://localhost:3000` locally, the chosen Preview origin for testing, or `https://sapiensfirst.org` in Production. The callback uses this configured origin, never a request-supplied destination. These variables are server-only; no Google secret or privileged Supabase key is required in the website environment.

Enable Google in Supabase Authentication using the organization's Google OAuth client ID and secret. In Google Cloud, register the callback URL shown by Supabase (`https://egdgizyyhiqtxonehzlt.supabase.co/auth/v1/callback`), with only basic OpenID, email and profile scopes. In Supabase URL Configuration, set the production Site URL and allow `<APP_URL>/auth/callback` for every environment used. Localhost hostnames and ports must match the browser URL.

Apply the versioned `create_profiles` migration on new databases; it is already applied to Website. `/join` starts Google sign-in, `/auth/callback` exchanges the PKCE code and creates a missing profile without overwriting existing details, and `/dashboard` provides a protected account landing and current-session sign-out. Incomplete profiles go to `/onboarding`; completed profiles go to the dashboard. Membership entry points on the homepage link to `/join`. Fellowship/circle enquiries and campaign intake still use the existing spreadsheet connection.

Onboarding requires full name, a recognized ISO country code and city/town/locality. Region, postal code, phone and street address are optional. Profile completion is derived from the stored fields using the same server validation as submission; there is no completion flag or new migration. Name is suggested from Google only when no saved name exists. Country names come from `Intl.DisplayNames`; the shared country-code list controls accepted values. Postal codes use length checks rather than US-only formats. Phone syntax is checked but numbers/addresses are not verified and never imply outreach consent. Profile editing and payments follow separately.

Authentication uses `@supabase/ssr` cookies and a narrowly scoped `proxy.ts`; account responses must remain dynamic and private. Atlas keeps its independent public client and cache. Before publication, test real Google sign-in, returning sessions, sign-out, callback failures and two-account isolation on localhost and Preview. Never commit credentials or publish before the localhost review.

Run `npm run test:auth` for the auth guard, callback, cookie-refresh and redirect regression checks, alongside `npm run test:campaigns`, lint, type checking and the production build.
