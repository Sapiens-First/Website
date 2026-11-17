export const wrap =
  "mx-auto w-full max-w-[calc(72rem+2*clamp(1rem,4vw,2.5rem))] px-[clamp(1rem,4vw,2.5rem)]";

export const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue";

export const btnBase = `inline-flex min-h-13 cursor-pointer items-center justify-center border-2 border-ink px-[1.15rem] py-2.5 text-center font-display text-[1.35rem] leading-none font-extrabold text-ink no-underline ${focusRing}`;

export const btnCta = `${btnBase} bg-coral hover:bg-coral-soft`;

export const btnOutline = `${btnBase} bg-paper hover:bg-soft`;

export const textLink = `text-[0.9375rem] font-bold text-brand-blue-dark underline decoration-1 underline-offset-[3px] hover:text-brand-blue ${focusRing}`;

export const sectionY = "py-[clamp(3rem,6vw,5.5rem)]";

export const displayTitle =
  "font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance normal-case";
