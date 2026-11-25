/**
 * The one front door: every "Join" button on the site reads from here.
 *
 * For now, joining means joining the Discord, which is free and fast. When
 * Discord becomes members-only, point `join` at "/join" (set external: false)
 * and every Join button follows.
 */

export const discord = {
  href: "https://discord.gg/hMazxy59ht",
  label: "Join the Discord",
} as const;

export const join = {
  href: discord.href,
  label: discord.label,
  external: true,
  /** One line under a Join button explaining what happens next. */
  note: "Free. Meet the movement, find your city, and pick up a task.",
} as const;

/** Props that make a link open in a new tab when `join` is external. */
export const joinLinkProps = join.external
  ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
  : ({} as const);
