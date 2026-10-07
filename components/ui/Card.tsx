import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "cursor-default border border-t-[3px] border-line border-t-coral bg-[color-mix(in_srgb,var(--color-surface)_42%,transparent)] px-7 py-6 transition-transform duration-250 motion-safe:hover:-translate-y-[3px]",
        className,
      )}
      {...props}
    />
  );
}
export function CardText({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-lg leading-relaxed font-medium text-ink", className)}
      {...props}
    />
  );
}
