import type { CSSProperties } from "react";
import { InView } from "@/components/story/InView";
import { cn } from "@/lib/cn";
import styles from "./patron-circle.module.css";

const R_INNER = 74;
const R_OUTER = 128;
const patronColors = [
  "var(--color-brand-yellow)",
  "var(--color-coral)",
  "var(--color-brand-blue)",
  "var(--color-brand-purple)",
  "var(--color-brand-yellow)",
  "var(--color-coral)",
];

/**
 * The founding circle: beside the Donate page's Founding Patron copy. A small
 * ring of patrons gathers around the flame and keeps it lit, inside the wider
 * movement (the outer ring of dots, turning slowly). The patrons take their
 * seats one by one as it scrolls in.
 */
export function PatronCircle({ className }: { className?: string }) {
  return (
    <InView className={cn(styles.art, className)} aria-hidden="true">
      <svg viewBox="-150 -150 300 300">
        <g className={styles.movement}>
          <circle className={styles.orbit} r={R_OUTER} />
          {Array.from({ length: 28 }, (_, i) => {
            const a = (i / 28) * Math.PI * 2;
            return (
              <circle
                key={i}
                className={styles.member}
                cx={Math.cos(a) * R_OUTER}
                cy={Math.sin(a) * R_OUTER}
                r={i % 3 ? 3 : 4.5}
              />
            );
          })}
        </g>
        <circle className={styles.ring} r={R_INNER} />
        <g className={styles.flame}>
          <circle className={styles.warmth} r="42" />
          <path
            className={styles.outerFlame}
            d="M0 30C-20 30 -28 14 -24 0C-20 -14 -8 -18 -6 -34C6 -24 8 -12 6 -4C12 -8 14 -14 14 -20C24 -8 26 4 22 14C18 24 10 30 0 30Z"
          />
          <path
            className={styles.innerFlame}
            d="M0 26C-10 26 -14 18 -12 10C-10 2 -4 0 -2 -10C6 -4 8 4 6 10C10 8 12 6 12 2C16 10 14 26 0 26Z"
          />
        </g>
        {patronColors.map((color, i) => {
          const a = (i / patronColors.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * R_INNER;
          const y = Math.sin(a) * R_INNER;
          return (
            <g key={i} transform={`translate(${x} ${y + 4})`}>
              <g
                className={styles.patron}
                style={{ "--c": color, "--i": i } as CSSProperties}
              >
                <path d="M-14 12V2C-14 -10 14 -10 14 2V12Z" />
                <circle cy="-17" r="9" />
              </g>
            </g>
          );
        })}
      </svg>
    </InView>
  );
}
