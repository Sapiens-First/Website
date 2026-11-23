import type { CSSProperties } from "react";
import styles from "./involved-fire.module.css";

/**
 * Fire: the sparks from the hero have grown. A warm glow rises from the
 * bottom of the Get involved panel with embers drifting up through it.
 */
export function InvolvedFire() {
  return (
    <div className={styles.fire} aria-hidden="true">
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
              "--drift": `${(i % 2 ? -1 : 1) * (10 + (i % 5) * 6)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Glow for the Join button. */
export const involvedFire = { button: styles.button };

/** Embers: [left %, size px, rise s, delay s]. */
const embers = [
  [4, 3, 7, 0],
  [9, 4, 9, -3],
  [14, 2, 6, -1.5],
  [19, 3, 8, -5],
  [24, 5, 10, -2],
  [29, 2, 7, -6],
  [34, 3, 9, -0.5],
  [39, 4, 8, -4],
  [44, 2, 6, -2.5],
  [49, 3, 10, -7],
  [54, 4, 7, -1],
  [59, 2, 9, -5.5],
  [64, 3, 8, -3.5],
  [69, 5, 10, -8],
  [74, 2, 6, -0.8],
  [79, 3, 9, -4.5],
  [84, 4, 7, -2.2],
  [89, 2, 8, -6.5],
  [94, 3, 10, -1.8],
  [97, 2, 7, -3.8],
] as const;
