import type { CSSProperties } from "react";
import { InView } from "@/components/story/InView";
import { cn } from "@/lib/cn";
import styles from "./plan-steps.module.css";

const steps = [
  {
    title: "Local groups",
    color: "bg-brand-yellow",
    icon: (
      <>
        <circle cx="18" cy="9" r="4"></circle>
        <path d="M10 26v-7c0-7 16-7 16 0v7M5 14v12M31 14v12M14 26v6M22 26v6"></path>
      </>
    ),
  },
  {
    title: "State campaigns",
    color: "bg-brand-blue-soft",
    icon: (
      <path d="M5 14h8L29 7v22l-16-7H5zM11 22l3 10h6l-3-9M32 15h2M32 21h2"></path>
    ),
  },
  {
    title: "Federal action",
    color: "bg-coral",
    icon: (
      <path d="M3 13L18 4l15 9zM7 16v13M14 16v13M22 16v13M29 16v13M3 32h30"></path>
    ),
  },
];

/**
 * Growing: the About plan, local groups → state campaigns → federal action. Each step pops in after
 * the one before, the arrow carries on to the next, and each sends out more
 * ripples than the last (one, two, three): the same reach widening as the
 * homepage's strategy networks.
 */
export function PlanSteps() {
  return (
    <InView>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li
            className={styles.step}
            key={step.title}
            style={{ "--i": index } as CSSProperties}
          >
            {index > 0 && (
              <span className={styles.arrow} aria-hidden="true">
                <span className="max-sm:hidden">→</span>
                <span className="sm:hidden">↓</span>
              </span>
            )}
            <span className={styles.badge} aria-hidden="true">
              {Array.from({ length: index + 1 }, (_, r) => (
                <i
                  key={r}
                  className={styles.ripple}
                  style={{ "--r": r } as CSSProperties}
                />
              ))}
              <span
                className={cn(
                  "relative grid size-25 place-items-center rounded-full border-2 border-ink shadow-[3px_3px_0_var(--color-ink)]",
                  step.color,
                )}
              >
                <svg
                  className="size-13.5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                  viewBox="0 0 36 36"
                >
                  {step.icon}
                </svg>
              </span>
            </span>
            <h3 className="m-0 font-display text-3xl leading-tight font-extrabold text-balance uppercase">
              {step.title}
            </h3>
          </li>
        ))}
      </ol>
    </InView>
  );
}
