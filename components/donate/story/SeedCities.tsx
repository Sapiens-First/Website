import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import styles from "./seed-cities.module.css";

/**
 * Seed cities: the Donate page's California, with embers popping on its
 * cities one after another, the same embers as the homepage hero's map.
 * What a gift lights. Positions are % of /assets/usa-ca.svg.
 */
export function SeedCities({ className }: { className?: string }) {
  return (
    <div
      className={cn(styles.map, className)}
      role="img"
      aria-label="Map of California, where we're building our first local groups."
    >
      {cities.map(([x, y], i) => (
        <span
          key={i}
          className={styles.city}
          aria-hidden="true"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--d": `${(i * 0.9).toFixed(1)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** [left %, top %], north to south. */
const cities = [
  [22, 16], // Redding
  [30, 36], // Sacramento
  [17, 43], // San Francisco
  [24, 48], // San Jose
  [45, 56], // Fresno
  [52, 68], // Bakersfield
  [57, 80], // Los Angeles
  [70, 82], // Riverside
  [70, 93], // San Diego
] as const;
