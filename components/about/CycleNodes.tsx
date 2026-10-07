"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const steps = [
  {
    id: "act",
    label: "Act",
    className: "cycle-node-act top-0 bg-coral",
    tip: "Visible, peaceful pressure makes AI governance impossible to ignore.",
  },
  {
    id: "recruit",
    label: "Recruit",
    className: "cycle-node-recruit bottom-0 bg-brand-yellow",
    tip: "Every public action creates conversations, gatherings, and local relationships.",
  },
  {
    id: "train",
    label: "Train",
    className: "cycle-node-train bottom-0 bg-brand-blue text-white",
    tip: "New advocates learn organizing skills and become leaders for the next action.",
  },
];

export default function CycleNodes() {
  const [active, setActive] = useState<string | null>(null);
  return steps.map((step) => (
    <button
      key={step.id}
      className={cn(
        "cycle-node absolute flex cursor-pointer items-center justify-center rounded-full font-display font-extrabold text-ink uppercase max-sm:text-xl",
        step.className,
        active === step.id && "is-active",
      )}
      type="button"
      aria-pressed={active === step.id}
      onMouseEnter={() => setActive(step.id)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(step.id)}
      onClick={() => setActive(step.id)}
    >
      <span>{step.label}</span>
      <span className="cycle-tip pointer-events-none absolute border-2 border-solid border-ink bg-white px-3 py-2.5 font-body text-xs leading-snug font-semibold text-ink normal-case">
        {step.tip}
      </span>
    </button>
  ));
}
