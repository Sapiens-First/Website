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
 * - `pillar` lights only that pillar's rays as it scrolls in; the rest wait
 *   as dashed outlines, so the star fills in down the page.
 * - `beacon` is the finished star, shining, for the dark Sign panel.
 */
export function NorthStar({
  variant,
  pillar,
  className,
}: {
  variant: "hero" | "pillar" | "beacon";
  pillar?: number;
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
          const lit = variant !== "pillar" || p === pillar;
          const long = i % 2 === 0;
          const length = long ? 94 : 60;
          const width = long ? 13 : 10;
          const base = long ? 15 : 12;
          // Order the lit rays play in: all eight on the hero, only this
          // pillar's on a pillar.
          const order = variant === "pillar" ? rayPillar.indexOf(p) - i : i;
          return (
            <g key={i} transform={`rotate(${i * 45})`}>
              <g
                className={lit ? styles.ray : styles.ghost}
                style={
                  {
                    "--c": pillarColors[p],
                    "--i": Math.abs(order),
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
