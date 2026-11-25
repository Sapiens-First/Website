import type { CSSProperties } from "react";
import { Bird } from "@/components/ui/Doodles";
import styles from "./hero-flock.module.css";

/**
 * Gathering: birds fly in from all sides of the About hero and fall into one
 * flock, then fly on together, flapping. "We are the human movement": many
 * people, one direction. Sits inside HeroCollage.
 */
export function HeroFlock() {
  return (
    <div className={styles.flock} aria-hidden="true">
      {birds.map(([x, y, fromX, fromY, size], i) => (
        <span
          key={i}
          className={styles.bird}
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--fx": `${fromX}vw`,
              "--fy": `${fromY}vh`,
              "--s": size,
              "--i": i,
            } as CSSProperties
          }
        >
          <Bird />
        </span>
      ))}
    </div>
  );
}

/**
 * [left %, top %, flies in from x vw, from y vh, scale]. A V pointing up
 * and right, with the leader at the front.
 */
const birds = [
  [58, 9, 30, -10, 1.1],
  [51, 5, -40, -20, 0.9],
  [44, 2, -30, 30, 0.75],
  [51, 14, 20, 40, 0.95],
  [44, 19, -50, 10, 0.8],
  [37, 24, -20, 50, 0.7],
  [37, 0, 10, -30, 0.6],
] as const;
