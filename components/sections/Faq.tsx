import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

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
      className={cn("faq-acc mt-11 border-t-2 border-ink", props.className)}
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
    <details className="faq-item border-b-2 border-ink" open={open}>
      <summary className="relative flex cursor-pointer list-none items-baseline gap-4 py-6 pr-12">
        <span
          className={`faq-n shrink-0 font-display text-xl font-extrabold ${numberColors[(number - 1) % numberColors.length]}`}
        >
          {String(number).padStart(2, "0")}
        </span>
        <span className="faq-q font-display text-xl font-bold tracking-tight uppercase sm:text-2xl">
          {question}
        </span>
        <span
          className="faq-chevron absolute top-6 right-0 grid size-6 place-items-center border-2 border-ink text-sm font-black"
          aria-hidden="true"
        />
      </summary>
      <div className="faq-body pr-6 pb-8 pl-6 sm:pr-12">{children}</div>
    </details>
  );
}
