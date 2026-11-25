import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./agenda-house.module.css";

const pillarColors = [
  "var(--color-coral)",
  "var(--color-brand-blue)",
  "var(--color-brand-purple)",
];

/**
 * The people's house: beside the Policy hero, twelve blocks (one per policy)
 * drop in and stack into three columns in their pillars' colours, then a
 * roof settles across them. 3 pillars · 12 policies, built into one agenda.
 */
export function AgendaHouse({ className }: { className?: string }) {
  return (
    <div className={cn(styles.house, className)} aria-hidden="true">
      <div className={styles.roof} />
      <div className={styles.lintel} />
      <div className={styles.columns}>
        {pillarColors.map((color, col) => (
          <div key={col} className={styles.column}>
            {[3, 2, 1, 0].map((row) => (
              <span
                key={row}
                style={
                  {
                    "--c": color,
                    "--n": col * 4 + row,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.step} />
    </div>
  );
}
