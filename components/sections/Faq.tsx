import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Native details motion is shared by FAQ and policy cards. */
export function Accordion({
  className = "",
  ...props
}: ComponentProps<"details">) {
  return (
    <details
      className={cn(
        "group supports-[interpolate-size:allow-keywords]:[interpolate-size:allow-keywords] supports-[interpolate-size:allow-keywords]:details-content:h-0 supports-[interpolate-size:allow-keywords]:details-content:overflow-clip supports-[interpolate-size:allow-keywords]:details-content:opacity-0 supports-[interpolate-size:allow-keywords]:details-content:[transition:height_0.4s_cubic-bezier(0.22,1,0.36,1),opacity_0.28s_ease,content-visibility_0.4s_allow-discrete] supports-[interpolate-size:allow-keywords]:open:details-content:h-auto supports-[interpolate-size:allow-keywords]:open:details-content:opacity-100 motion-reduce:details-content:transition-none",
        className,
      )}
      {...props}
    />
  );
}

const numberColors = [
  "text-coral",
  "text-brand-blue",
  "text-brand-purple",
  "text-brand-pink",
];

export function FaqList(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("mt-11 border-t-2 border-ink", props.className)}
    />
  );
}

export function FaqItem({
  number,
  question,
  children,
  open = false,
}: {
  number: number;
  question: ReactNode;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <Accordion className="border-b-2 border-ink" name="faq" open={open}>
      <summary className="relative flex cursor-pointer list-none items-baseline gap-4 py-6 pr-12 [&::-webkit-details-marker]:hidden">
        <span
          className={`shrink-0 font-display text-xl font-extrabold ${numberColors[(number - 1) % numberColors.length]}`}
        >
          {String(number).padStart(2, "0")}
        </span>
        <span className="font-display text-xl font-bold tracking-tight uppercase sm:text-2xl">
          {question}
        </span>
        <span
          className="absolute top-6 right-0 grid size-6 place-items-center border-2 border-ink text-sm font-black after:content-['+'] group-open:after:content-['−']"
          aria-hidden="true"
        />
      </summary>
      <div className="pr-6 pb-8 pl-6 sm:pr-12 [&_:is(p,ul,ol)]:mb-3.5 [&_:is(p,ul,ol)]:max-w-3xl [&_:is(p,ul,ol)]:text-base [&_:is(p,ul,ol)]:leading-relaxed [&_:is(p,ul,ol)]:font-medium [&_:is(ul,ol)]:pl-5 [&_:last-child]:mb-0 [&_li]:mb-1.5">
        {children}
      </div>
    </Accordion>
  );
}

/** Rotating corner chevron; points down when the nearest `group` is open or expanded. */
export function AccordionChevron({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-[11px] flex-none origin-[60%_60%] rotate-45 border-r-2 border-b-2 border-ink transition-[rotate,opacity] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-225 group-aria-expanded:rotate-225",
        className,
      )}
    />
  );
}
