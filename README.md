# Sapiens First website

The public site is a Next.js App Router application using React and TypeScript. Content pages are statically generated; campaign signatures use a Server Action. Styling is Tailwind CSS v4.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` for a production build, `npm run lint` for ESLint, `npm run typecheck` for TypeScript, and `npm run format` to format the source.

Copy `.env.example` to `.env.local` and set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `APP_URL` (the website origin, such as `http://localhost:3000`). Use the deployed origin for `APP_URL` in Vercel and allow its `/auth/callback` URL in Supabase Auth.

Membership is currently free: sign in with Google or an email link, complete your profile, accept the member agreement, then open the dashboard. Name, country, city, postal code and phone are required. Account pages verify identity on the server and use the member's Supabase session and profile permissions. `/membership` redirects to `/dashboard`.

## UI components (shadcn/ui)

Shared primitives follow [shadcn/ui](https://ui.shadcn.com): the source lives in `components/ui/` and is ours to edit, configured by `components.json`. Lowercase files (`button`, `input`, `label`, `textarea`, `checkbox`, `native-select`) are shadcn components restyled to the brand: square corners, 2px ink borders, uppercase buttons. The PascalCase files (`Text`, `Card`, `Doodles`) are site-specific primitives.

- Use `Button` / `ActionLink` / `TextLink` from `@/components/ui/button` for actions, and `Input`, `Label`, `Textarea`, `NativeSelect`, `Checkbox` for forms, rather than hand-styled elements.
- `app/globals.css` maps shadcn's semantic tokens (`background`, `primary`, `muted-foreground`, `destructive`, `border`, `ring`, …) onto the brand palette. Use `text-muted-foreground` for secondary text and `text-destructive` / `border-destructive` for errors.
- Add a component with `npx shadcn@latest add <name>`, then restyle it to match the files already here. Don't run `shadcn init`: it overwrites `globals.css` and the brand fonts. The CLI may misread the `@/lib/cn` alias, so check the new file imports `cn` from `@/lib/cn` and that `package.json` didn't gain a stray `cn` package.
- No Tech Kings pages keep their own campaign look (CSS modules in `components/no-tech-kings/`).

## Brand colors

Palette C and the logo/favicons share the [brand color guide](docs/brand-colors.md). Preview website changes on localhost for Rohan’s approval before batch publication.

## Current data sources

Use the [Atlas editing guide](docs/database.md) for the Supabase schema, staff permissions, and agent-assisted edits.

Campaign detail pages collect public signatures through a Server Action and Supabase. See [campaign intake](docs/campaign-intake.md) for storage, consent, duplicate handling and verification.

The public [Atlas](https://sapiensfirst.org/atlas) reads from Supabase. Membership, Fellowship, and Start a Circle interest forms are open to everyone and stored in Supabase. Campaign signatures are open to everyone and stored in Supabase. The Learn guide loads from a public Google Doc in the browser. Donations go to Zeffy.
