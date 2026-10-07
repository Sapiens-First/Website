import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tones = {
  coral: "bg-coral text-ink",
  yellow: "bg-brand-yellow text-ink",
  blue: "bg-brand-blue text-white",
  purple: "bg-brand-purple text-white",
} as const;

export function Label({
  tone = "coral",
  size = "small",
  className = "",
  ...props
}: ComponentProps<"span"> & {
  tone?: keyof typeof tones;
  size?: "small" | "section";
}) {
  const sizing =
    size === "section"
      ? "px-3 py-2 text-3xl font-bold leading-none"
      : "px-2.5 py-1.5 text-xs font-black";
  return (
    <span
      className={cn(
        "inline-block font-body tracking-widest uppercase",
        sizing,
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function FactPill({ className = "", ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-ink bg-white px-3 py-2 text-xs font-extrabold tracking-wider uppercase",
        className,
      )}
      {...props}
    />
  );
}

/** Small black tag above a hero title. */
export function Kicker({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mb-5 inline-block w-max bg-ink px-2.5 py-2 font-body text-xs font-black tracking-widest text-white uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({
  accent = false,
  className = "",
  ...props
}: ComponentProps<"span"> & { accent?: boolean }) {
  return (
    <span
      className={cn(
        "font-body text-sm tracking-widest uppercase",
        accent ? "text-coral-dark" : "text-ink",
        className,
      )}
      {...props}
    />
  );
}

const deckSizes = {
  default: "text-xl leading-snug lg:text-2xl xl:text-3xl",
  compact: "text-lg leading-normal font-medium xl:text-xl",
} as const;

/** Lead paragraph under a section heading. */
export function Deck({
  size = "default",
  className = "",
  ...props
}: ComponentProps<"p"> & { size?: keyof typeof deckSizes }) {
  return (
    <p
      className={cn("font-body text-ink", deckSizes[size], className)}
      {...props}
    />
  );
}
