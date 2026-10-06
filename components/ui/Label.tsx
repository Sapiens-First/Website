import type { ComponentProps } from "react";

const tones = {
  coral: "bg-coral text-ink",
  yellow: "alt-yellow bg-brand-yellow text-ink",
  blue: "alt-blue bg-brand-blue text-white",
  purple: "alt-green bg-brand-purple text-white",
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
      ? "section-label-primary px-3 py-2 text-3xl font-bold leading-none"
      : "px-2.5 py-1.5 text-xs font-black";
  return (
    <span
      className={`label inline-block font-body uppercase tracking-widest ${sizing} ${tones[tone]} ${className}`}
      {...props}
    />
  );
}

export function FactPill({ className = "", ...props }: ComponentProps<"span">) {
  return (
    <span
      className={`fact-pill inline-block border-2 border-ink bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-wider ${className}`}
      {...props}
    />
  );
}
