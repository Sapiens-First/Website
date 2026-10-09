import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Decorative hand-drawn marks scattered over sections. All are aria-hidden. */

export function FunLayer({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-1 overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

/** Absolutely positioned wrapper; position, size, colour and tilt come from `className`. */
export function Doodle({ className = "", ...props }: ComponentProps<"i">) {
  return (
    <i className={cn("absolute block leading-none", className)} {...props} />
  );
}

export function Bird({ className = "" }: { className?: string }) {
  return (
    <svg
      className={cn(
        "block h-auto w-7 fill-none stroke-current stroke-[1.8] [stroke-linecap:round]",
        className,
      )}
      viewBox="0 0 24 12"
    >
      <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9" />
    </svg>
  );
}

/** Crescent: a disc with a circle cut out at (`cutX`, `cutY`) in a 40×40 box. */
export function Moon({
  size,
  cutX = 27,
  cutY = 27,
}: {
  size: number;
  cutX?: number;
  cutY?: number;
}) {
  const mask = useId();
  return (
    <svg className="block" viewBox="0 0 40 40" width={size} height={size}>
      <mask id={mask}>
        <rect width="40" height="40" fill="#fff" />
        <circle cx={cutX} cy={cutY} r="14" fill="#000" />
      </mask>
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="currentColor"
        mask={`url(#${mask})`}
      />
    </svg>
  );
}

export const starClip =
  "[clip-path:polygon(50%_0,61%_35%,98%_35%,68%_56%,80%_94%,50%_71%,20%_94%,32%_56%,2%_35%,39%_35%)]";
export const burstClip =
  "[clip-path:polygon(50%_0,61%_29%,85%_15%,72%_40%,100%_50%,72%_60%,85%_85%,61%_71%,50%_100%,39%_71%,15%_85%,28%_60%,0_50%,28%_40%,15%_15%,39%_29%)]";

function Shape({ size, clip }: { size: number; clip: string }) {
  return (
    <svg
      className={cn("block", clip)}
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <rect width="24" height="24" fill="currentColor" />
    </svg>
  );
}

export function Star({ size }: { size: number }) {
  return <Shape size={size} clip={starClip} />;
}

export function Pow({ size }: { size: number }) {
  return <Shape size={size} clip={burstClip} />;
}

export function Zap({
  size,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={cn("block fill-current", className)}
      viewBox="0 0 24 40"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M14 1L2 22h8l-4 17 16-24h-9l5-14z" />
    </svg>
  );
}
