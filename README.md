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
- `lib/site.ts`: site URLs, current external integrations, and page metadata. Navigation and footer links live in `components/SiteHeader.tsx` and `components/SiteFooter.tsx`.
- `lib/cn.ts`: `cn()` joins class names with `clsx` and resolves conflicting Tailwind utilities with `tailwind-merge`, so a `className` override always wins over a component default.
- `public/assets/` and `public/favicons/`: original images, SVGs, and favicon files with unchanged names.
- `app/sitemap.ts` and `app/robots.ts`: canonical public route discovery. The public route list lives in `app/sitemap.ts`.
- `next.config.ts`: default Next.js configuration without custom redirects.

Styling is written as Tailwind classes in each component. `app/globals.css` only holds the design tokens, a small base reset, the `.doc-body` typography for the Learn guide, and a few custom utilities (`ink-underline`, `marker`); `npm run format` sorts those classes through `prettier-plugin-tailwindcss`. Barlow Condensed and DM Sans are loaded through Next.js `next/font/google` and self-hosted with the app.

## Brand colors

Palette C and the logo/favicons share the [brand color guide](docs/brand-colors.md). Preview website changes on localhost for Rohan’s approval before batch publication.

## Current data sources

Campaign detail pages collect member signatures through a same-origin API and Supabase. See [campaign intake](docs/campaign-intake.md) for storage, consent, duplicate handling and verification. Database regression checks are in `supabase/tests/campaign_signatures.sql`.

Circle and Fellowship interests are member-only and stored in Supabase. Campaign signatures are member-only and stored in Supabase. The Learn guide loads from a public Google Doc in the browser. Donations go to Zeffy.

## Supabase connection

The connection uses the Website project in the SapiensFirst organization. Its public Atlas tables contain the initial CSV snapshot.

Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from the project's Connect dialog. `.env.local` is Git-ignored. Add the same variables to the appropriate Vercel environment before deploying database-dependent changes.

## Google sign-in

Set `APP_URL` to the exact website origin: `http://localhost:3000` locally, the chosen Preview origin for testing, or `https://sapiensfirst.org` in Production. The callback uses this configured origin, never a request-supplied destination. These variables are server-only; no Google secret or privileged Supabase key is required in the website environment.

Enable Google in Supabase Authentication using the organization's Google OAuth client ID and secret. In Google Cloud, register the callback URL shown by Supabase, with only basic OpenID, email and profile scopes. In Supabase URL Configuration, set the production Site URL and allow `<APP_URL>/auth/callback` for every environment used. Localhost hostnames and ports must match the browser URL.

Apply all versioned Supabase migrations on new databases, including `campaign_signatures`; they are applied to Website. `/join` starts Google sign-in, `/auth/callback` exchanges the PKCE code and creates a missing profile without overwriting existing details, and `/dashboard` provides a protected account landing and current-session sign-out. Incomplete profiles go to `/onboarding`; completed profiles go to the dashboard. Membership entry points on the homepage link to `/join`. Campaign intake uses the authenticated `sign_campaign` database function.

Circle/Fellowship pages stay public, each with one hero CTA: sign in, complete the profile, confirm interest. `InterestCTA` reads state through `lib/members/access.ts`; writes live in `app/(members)/actions.ts`. Login and onboarding preserve an allowlisted return destination; signing in alone never records interest. `member_interests` stores one row per Auth UUID with verified email, `circle`/`fellowship` booleans (default false), and `created_at`. Confirmation sets only the selected flag to true, preserving the other flag and creation date. The page then shows a saved status. Interests have no account-page controls. RLS restricts access to the member's own row and validates their email; anonymous writes and timestamp edits are denied. No automatic email or marketing subscription is created.

Onboarding requires full name, a recognized ISO country code and city/town/locality. Region, postal code, phone and street address are optional. Profile completion is derived from the stored fields using the same server validation as submission; there is no completion flag or new migration. Name is suggested from Google only when no saved name exists. Country names come from `Intl.DisplayNames`; the shared country-code list controls accepted values. Postal codes use length checks rather than US-only formats. Phone syntax is checked but numbers/addresses are not verified and never imply outreach consent.

The free member portal has an account overview at `/dashboard` and personal-detail editing at `/dashboard/profile`, with shared account navigation and sign-out. Editing reuses onboarding's form and server action: identity is verified on each save, only profile fields are accepted, and the database update is scoped to the signed-in UUID under RLS. Successful saves return to the dashboard. Google email stays in Auth and cannot be edited through this form. `getMembershipAccess()` in `lib/members/access.ts` verifies authentication and a completed profile. `/learn` and `/calendar` remain public; protecting future premium content requires private delivery of its source data.

Authentication uses `@supabase/ssr` cookies and a narrowly scoped `proxy.ts`; account responses must remain dynamic and private. Atlas keeps its independent public client and cache. Before publication, test real Google sign-in, returning sessions, sign-out, callback failures and two-account isolation on localhost and Preview. Never commit credentials or publish before the localhost review.

Dynamic routes use `app/loading.tsx` while server data is pending. The dashboard reuses that fallback inside its account layout, preserving account navigation. The root layout reserves a growing content area so the footer does not jump beneath the header during streamed responses. These fallbacks improve navigation feedback; authentication and profile reads still run on the server.

Run the rollback-only SQL regression checks in `supabase/tests/campaign_signatures.sql`, alongside lint, type checking and the production build. Verify authentication and profile flows using the member release checks below.

## Member release checks

Before publishing the reviewed batch, configure all three variables in `.env.example` for the target Vercel environment and redeploy. Match `APP_URL` and the Supabase redirect allowlist to that exact deployment origin. Publish the Google OAuth app for public sign-in when ready; Testing mode only permits the configured test audience. For Google-only accounts, disable unused email/password sign-in in Supabase. If passwords are offered later, enable the appropriate password protections.

Verify first and returning Google sign-in, cancellation, expired callbacks, sign-out, browser refresh, incomplete-profile routing and editing on the target environment. Confirm signed-out dashboard/profile requests return no member details, account responses are private/no-store, two authenticated accounts cannot read or modify each other's profiles, and ID/timestamp fields cannot be edited. Test narrow screens, keyboard navigation, field errors, Atlas, public Learn/calendar and the remaining campaign/fellowship/circle forms. No member marketing opt-in, payments or private course delivery is implemented yet.
