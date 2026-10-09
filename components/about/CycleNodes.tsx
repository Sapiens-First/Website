"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const steps = [
  {
    id: "act",
    label: "Act",
    className: "top-0 left-1/2 -ml-[17%] bg-coral",
    tip: "left-1/2 -translate-x-1/2",
    text: "Visible, peaceful pressure makes AI governance impossible to ignore.",
  },
  {
    id: "recruit",
    label: "Recruit",
    className: "right-0 bottom-0 bg-brand-yellow",
    tip: "right-0",
    text: "Every public action creates conversations, gatherings, and local relationships.",
  },
  {
    id: "train",
    label: "Train",
    className: "bottom-0 left-0 bg-brand-blue text-white",
    tip: "left-0",
    text: "New advocates learn organizing skills and become leaders for the next action.",
  },
];

export default function CycleNodes() {
  const [active, setActive] = useState<string | null>(null);
  return steps.map((step) => (
    <button
      key={step.id}
      className={cn(
        "group",
        cn(
          "absolute z-2 box-border flex aspect-square w-[34%] cursor-pointer items-center justify-center rounded-full border-3 border-ink p-[6%] font-display text-[clamp(1.235rem,2.34vw,1.56rem)] font-extrabold text-ink uppercase shadow-[6px_6px_0_var(--color-ink)] transition-transform duration-160 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink max-sm:text-xl",
          "motion-safe:hover:-translate-y-[5px] motion-safe:focus-visible:-translate-y-[5px] motion-safe:aria-pressed:-translate-y-[5px] motion-reduce:transition-none",
          step.className,
        ),
      )}
      type="button"
      aria-pressed={active === step.id}
      onMouseEnter={() => setActive(step.id)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(step.id)}
      onClick={() => setActive(step.id)}
    >
      <span>{step.label}</span>
      <span
        className={cn(
          "pointer-events-none invisible absolute bottom-[calc(100%+14px)] z-4 w-[min(220px,64vw)] translate-y-1.5 border-2 border-solid border-ink bg-white px-3 py-2.5 font-body text-xs leading-snug font-semibold tracking-normal text-ink normal-case opacity-0 shadow-[4px_4px_0_var(--color-ink)] transition-[opacity,translate,visibility] duration-150",
          "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-aria-pressed:visible group-aria-pressed:translate-y-0 group-aria-pressed:opacity-100",
          step.tip,
        )}
      >
        {step.text}
      </span>
    </button>
  ));
}
