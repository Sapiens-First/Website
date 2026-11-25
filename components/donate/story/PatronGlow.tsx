import type { CSSProperties } from "react";
import styles from "./patron-glow.module.css";

/**
 * Keeping the fire lit: behind the Donate page's Founding Patron band, a
 * low warm glow with a few embers rising, the homepage's fire at hearth
 * size. Patrons are the ones who keep it going through the first year.
 */
export function PatronGlow() {
  return (
    <div className={styles.hearth} aria-hidden="true">
      <div className={styles.glow} />
      {embers.map(([x, size, duration, delay], i) => (
        <i
          key={i}
          style={
            {
              left: `${x}%`,
              "--s": `${size}px`,
              "--t": `${duration}s`,
              "--d": `${delay}s`,
              "--drift": `${(i % 2 ? -1 : 1) * (8 + (i % 4) * 6)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** [left %, size px, rise s, delay s], gathered toward the left. */
const embers = [
  [6, 3, 8, 0],
  [12, 2, 7, -2.5],
  [18, 4, 9, -5],
  [24, 2, 6, -1.2],
  [30, 3, 8, -3.8],
  [37, 2, 10, -6.4],
  [44, 3, 7, -0.6],
  [52, 2, 9, -4.4],
] as const;
