import type { CSSProperties } from "react";
import { InView } from "@/components/story/InView";
import { cn } from "@/lib/cn";
import styles from "./north-star.module.css";

/** Ray colour for each pillar: Life, Liberty, the pursuit of Happiness. */
const pillarColors = [
  "var(--color-brand-yellow)",
  "var(--color-brand-blue)",
  "var(--color-brand-purple)",
];
/** Which pillar each of the eight principles (rays) belongs to. */
const rayPillar = [0, 0, 1, 1, 1, 2, 2, 2];

/**
 * The North Star: an eight-pointed star, one ray per principle of the Human
 * Charter, numbered clockwise from the top and coloured by pillar.
 *
 * - `hero` draws all eight rays in order on load.
 * - `beacon` is the finished star, shining, for the dark panels.
 */
export function NorthStar({
  variant,
  className,
}: {
  variant: "hero" | "beacon";
  className?: string;
}) {
  return (
    <InView
      className={cn(styles.star, className)}
      data-variant={variant}
      aria-hidden="true"
    >
      <div className={styles.glow} />
      <svg viewBox="-100 -100 200 200">
        {rayPillar.map((p, i) => {
          const long = i % 2 === 0;
          const length = long ? 94 : 60;
          const width = long ? 13 : 10;
          const base = long ? 15 : 12;
          return (
            <g key={i} transform={`rotate(${i * 45})`}>
              <g
                className={styles.ray}
                style={
                  {
                    "--c": pillarColors[p],
                    "--i": i,
                  } as CSSProperties
                }
              >
                <path
                  className={styles.left}
                  d={`M0 0L${-width} ${-base}L0 ${-length}Z`}
                />
                <path
                  className={styles.right}
                  d={`M0 0L${width} ${-base}L0 ${-length}Z`}
                />
              </g>
            </g>
          );
        })}
        <circle className={styles.core} r="9" />
      </svg>
    </InView>
  );
}
