import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function SplitHero({
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "hero grid grid-cols-1 border-b-2 border-ink lg:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

export function ClosingSection({
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "apply grid grid-cols-1 bg-paper lg:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

export function ClosingCopy({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "apply-copy px-7 py-20 sm:px-12 lg:px-20 lg:py-24",
        className,
      )}
      {...props}
    />
  );
}

export function SignupPanel({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "apply-panel relative flex min-h-96 flex-col justify-center overflow-hidden border-t-2 border-ink bg-ink px-7 py-16 text-white sm:px-12 lg:border-t-0 lg:border-l-2",
        className,
      )}
      {...props}
    />
  );
}
