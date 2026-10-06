# Sapiens First design system

The site uses React 19.3, Next.js 16.3.6, and Tailwind CSS 4.3.3. Tailwind and
`@tailwindcss/postcss` are pinned together. No component framework, CSS-in-JS
runtime, variant library, or icon library is required.

## Ownership

| Location                               | Responsibility                                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`                      | The only stylesheet: theme, reset, content recipes, artwork, scoped feature rules, interaction states, motion and print |
| `components/ui/Action.tsx`             | Buttons, action links, text links, and variants                                                                         |
| `components/ui/Label.tsx`              | Section labels and fact pills                                                                                           |
| `components/layout/Container.tsx`      | Standard widths and gutters                                                                                             |
| `components/sections/Faq.tsx`          | FAQ markup, numbering, question/body slots                                                                              |
| `components/sections/SplitSection.tsx` | Split heroes and closing signup layouts                                                                                 |
| `components/artwork/`                  | Bespoke illustrations, starting with Circle's gathering illustration                                                    |
| Existing feature components            | Campaigns, events, guide, Atlas, navigation and signup behavior                                                         |
| `content/campaigns.ts`                 | Shared campaign facts and presentation copy for both campaign views                                                     |
| `app/**/page.tsx`                      | Route composition, content, metadata and ordinary Tailwind styling                                                      |

Extract a primitive when it has multiple actual callers and a stable purpose.
Keep feature-specific components with their feature. No universal card, page
builder, theme provider, or general component registry is needed.

## Foundations

Keep the existing paper background, ink borders, coral, blue, yellow, purple,
and pink accents. The CSS theme maps brand tokens to `bg-paper`, `text-ink`,
`bg-coral`, `border-rule`, and related utilities. Colors are defined once in
the root tokens. Coral fills and darker coral link text remain separate.
The legacy `--green` name refers to purple, exposed as `brand-purple`.

`font-display` uses Barlow Condensed and `font-body` uses DM Sans, both through
the existing Next font variables. Use Tailwind's named type sizes, line
heights, tracking, container widths, and spacing scale. Legacy size aliases
now refer to Tailwind's type scale.

Use mobile layouts first and default `sm`, `md`, `lg`, `xl`, and `2xl`
breakpoints. Heroes and closing sections split at `lg`. Atlas detail columns
use `xl` to leave room for the chart. Responsive CSS uses named `@variant`
rules such as `max-sm` and `sm:max-md`; do not introduce custom breakpoint values.

## Variants

| Component                                      | Variants                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `Button` / `ActionLink`                        | `primary`, `outline`, `donation`                                  |
| `TextLink`                                     | `inline`, `block` (standalone, aligned right)                     |
| `Label`                                        | Coral, yellow, blue, purple; `small` or `section` size            |
| `FactPill`                                     | One standard treatment                                            |
| `Container`                                    | `site`, `content`, `prose`: `max-w-7xl`, `max-w-4xl`, `max-w-2xl` |
| `SplitHero`                                    | One grid with page-specific content and artwork slots             |
| `ClosingSection`, `ClosingCopy`, `SignupPanel` | One shared closing composition                                    |
| `FaqList`, `FaqItem`                           | Number, question, rich body, initial open state                   |
| Existing `SignupForm`                          | `row`, `dialog`; membership, fellowship, start-a-circle interests |

```tsx
<Container width="content">
  <Label tone="yellow">Get involved</Label>
  <h2 className="mt-5 text-4xl lg:text-6xl">Build movement power.</h2>
  <ActionLink href="/join" variant="primary">
    Join the movement
  </ActionLink>
</Container>
```

Use a button for behavior and a link for navigation. Prefer explicit variants
over repeated class strings. `className` is for placement and feature-specific
additions; avoid conflicting color, width, or type utilities. Tailwind rule
order determines which conflicting utility wins, regardless of string order.

## CSS and behavior

Preflight is omitted. The original reset remains, with zero-width solid border
defaults for Tailwind utilities. Layers are `theme`, `base`, `components`, and
`utilities`; custom recipes live in `components`, allowing JSX utilities to
override them predictably.

Use JSX utilities for ordinary layout, spacing, sizing, typography and color.
Use `@apply` for content selectors, shared hooks, stateful selectors, and
sanitized Google Docs markup whose HTML isn't authored in JSX.

Authored CSS remains for illustration geometry, SVG masks, textures, brush
strokes, chart geometry, counters, transitions and print behavior. Coordinates
and mathematical values in these features are intentional exceptions to the
rule against ad hoc layout values. New ordinary UI should not use arbitrary
bracket values, inline pixel spacing, or additional stylesheets.

Presentation components remain server-compatible. Interactive features retain
their existing client boundaries. FAQs use native `details`; `PageInteractions`
owns single-open behavior, animation, expanded states, and inert closed answers.
Retain its hooks. Join uses native modal focus containment and Escape handling.

Campaign teaser and detail copy differ deliberately in length and order, but
both are fields of the same campaign records. Edit `content/campaigns.ts`.

## Verification

Install the browser once with `npx playwright install chromium`, then run:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:ui
```

The suite starts the production app on port 3101. It checks every route at
390, 820 and 1440 pixels, and tests navigation, native dialogs, signup variants,
FAQs with motion, campaigns, Policy contents, event fixtures, Atlas views,
search, selection, history, and printing. Signup tests intercept requests and
do not send real data. Screenshots and failure traces go to ignored
`test-results/`.

For a full screenshot sweep of an app running on port 3100, run
`node scripts/ui-check.mjs review`. Full-page screenshots and layout, image,
and runtime results go to ignored `design-tests/review/`. Set `UI_PORT` to
check another port, including production.

These are layout and interaction checks, not pixel-equality snapshots. Inspect
screenshots for typography, contrast, artwork, and section boundaries after
shared changes. Small differences from the original sizes are expected.

## Official references

- [Next.js App Router CSS](https://nextjs.org/docs/app/getting-started/css)
- [Tailwind's Next.js installation guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Theme variables](https://tailwindcss.com/docs/theme)
- [Preflight](https://tailwindcss.com/docs/preflight)
- [Responsive design](https://tailwindcss.com/docs/responsive-design)

The installed Next guide at
`node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` documents this
version's PostCSS setup and the need to verify production CSS ordering.
