import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function AtlasTable({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      className={cn(
        "w-full border-collapse text-left text-sm [&_:is(th,td)]:max-w-sm [&_:is(th,td)]:min-w-36 [&_:is(th,td)]:px-3.5 [&_:is(th,td)]:py-3 [&_:is(th,td)]:align-middle [&_:is(th,td)]:leading-normal [&_:is(th,td)]:wrap-anywhere max-md:[&_:is(th,td):nth-child(3)]:hidden max-md:[&_:is(th,td):nth-child(4)]:hidden [&_tbody_:is(th,td)]:border-b [&_tbody_:is(th,td)]:border-rule [&_tbody_th]:min-w-56 [&_tbody_th]:text-sm [&_tbody_th]:font-semibold [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-surface [&_tbody_tr:last-child>*]:border-b-0 [&_thead_th]:bg-soft [&_thead_th]:py-2.5 [&_thead_th]:text-xs [&_thead_th]:font-bold [&_thead_th]:tracking-wider [&_thead_th]:whitespace-nowrap [&_thead_th]:uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function AtlasBadge({
  active = false,
  className,
  ...props
}: ComponentProps<"span"> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-line bg-white px-2 py-1 text-xs leading-none font-semibold text-ink",
        active &&
          "border-[color-mix(in_srgb,var(--color-success)_45%,var(--color-line))] bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-[color-mix(in_srgb,var(--color-success)_70%,var(--color-ink))]",
        className,
      )}
      {...props}
    />
  );
}
