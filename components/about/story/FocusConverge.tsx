import type { CSSProperties } from "react";
import { InView } from "@/components/story/InView";
import { cn } from "@/lib/cn";
import styles from "./focus-converge.module.css";

const areas = [
  {
    title: "Democratic Renewal",
    color: "var(--color-coral)",
    tag: "top-[10%] left-[6%] -rotate-3",
  },
  {
    title: "Common Prosperity",
    color: "var(--color-brand-blue)",
    tag: "top-[20%] right-[6%] rotate-3",
  },
  {
    title: "A Secure Future",
    color: "var(--color-brand-purple)",
    tag: "bottom-[12%] left-[10%] rotate-2",
  },
];

/**
 * Three into one: the About Vision art. Each focus area's tag pins on, and
 * its colour flies in from that corner to stack into one sun (coral in front,
 * blue and purple behind), which then breathes. Same colours as the focus
 * area borders below it.
 */
export function FocusConverge({ className }: { className?: string }) {
  return (
    <InView className={cn(styles.art, className)}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.sun} aria-hidden="true">
        {areas.map((area, i) => (
          <span
            key={area.title}
            data-area={i}
            style={{ "--c": area.color } as CSSProperties}
          />
        ))}
      </div>
      {areas.map((area, i) => (
        <div
          key={area.title}
          className={cn(styles.tag, area.tag)}
          style={{ "--c": area.color, "--i": i } as CSSProperties}
        >
          {area.title}
        </div>
      ))}
    </InView>
  );
}
