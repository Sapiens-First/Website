import type { CSSProperties } from "react";
import styles from "./stakes-night.module.css";

/**
 * Night: behind the Charter's Stakes band. A dim, twinkling sky with one
 * star brighter than the rest low on the right, the North Star the charter
 * goes on to draw. Also exports the coral glow for "fought for."
 */
export function StakesNight() {
  return (
    <div className={styles.night} aria-hidden="true">
      {dots.map(([x, y, size, delay], i) => (
        <i
          key={i}
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--s": `${size}px`,
              "--d": `${delay}s`,
            } as CSSProperties
          }
        />
      ))}
      <span className={styles.north} />
    </div>
  );
}

export const stakesNight = { glow: styles.glow };

/** [left %, top %, size px, twinkle delay s]. */
const dots = [
  [4, 10, 1.5, 0],
  [11, 34, 1, -1.3],
  [17, 8, 2, -2.4],
  [24, 22, 1, -0.6],
  [31, 5, 1.5, -3.2],
  [38, 30, 1, -1.8],
  [46, 12, 1, -0.3],
  [52, 38, 1.5, -2.7],
  [58, 6, 1, -1.1],
  [63, 24, 2, -3.6],
  [69, 14, 1, -0.9],
  [74, 34, 1.5, -2.1],
  [81, 9, 1, -1.6],
  [87, 26, 1.5, -3],
  [93, 15, 1, -0.4],
  [97, 36, 1, -2.5],
  [8, 48, 1, -3.4],
  [42, 50, 1, -1.4],
  [78, 46, 1, -0.7],
] as const;
