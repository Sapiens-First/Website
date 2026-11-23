import type { CSSProperties } from "react";
import styles from "./crisis-sky.module.css";

/**
 * Night sky behind the homepage Crisis band: a faint glow around the earth,
 * a twinkling starfield, a glowing moon, far-off tumbling asteroids and
 * meteor showers. Decorative only; all motion stops with reduced motion.
 */
export function CrisisSky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.nebula} />
      <div className={styles.earthGlow} />
      <div className={styles.field}>
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
      </div>
      {meteors.map(([x, y, len, angle, t, delay], i) => (
        <span
          key={i}
          className={styles.meteor}
          style={
            {
              "--x": `${x}%`,
              "--y": `${y}%`,
              "--len": `${len}px`,
              "--angle": `${angle}deg`,
              "--t": `${t}s`,
              "--delay": `${delay}s`,
            } as CSSProperties
          }
        />
      ))}
      {asteroids.map(([y, w, o, t, delay], i) => (
        <svg
          key={i}
          className={styles.asteroid}
          viewBox="0 0 40 40"
          style={
            {
              "--y": `${y}%`,
              "--w": `${w}px`,
              "--o": o,
              "--t": `${t}s`,
              "--delay": `${delay}s`,
            } as CSSProperties
          }
        >
          <path d={rocks[i % rocks.length]} />
          <circle cx="15" cy="16" r="3" />
          <circle cx="24" cy="24" r="2" />
        </svg>
      ))}
      <div className={styles.moon} />
    </div>
  );
}

/** Classes the page puts on its own elements. */
export const crisisSky = {
  /** Container of the yellow stars: glow, and each star twinkles. */
  stars: styles.stars,
  /** Soft coral glow on the "humanity." highlight. */
  glow: styles.glow,
};

/** Background stars: [left %, top %, size px, twinkle delay s]. */
const dots = [
  [3, 8, 1.5, 0],
  [9, 31, 1, -1.2],
  [14, 14, 2, -2.6],
  [19, 52, 1, -0.4],
  [23, 6, 1.5, -3.1],
  [27, 38, 1, -1.9],
  [31, 21, 1, -0.8],
  [36, 58, 1.5, -2.2],
  [40, 9, 1, -3.6],
  [44, 33, 2, -1.4],
  [48, 18, 1, -0.2],
  [52, 47, 1, -2.9],
  [55, 4, 1.5, -1.7],
  [59, 27, 1, -3.3],
  [62, 61, 1, -0.6],
  [66, 13, 2, -2.4],
  [70, 42, 1, -1.1],
  [73, 24, 1.5, -3.8],
  [77, 55, 1, -0.9],
  [80, 7, 1, -2.1],
  [84, 36, 1.5, -1.5],
  [88, 17, 1, -3.4],
  [91, 49, 2, -0.3],
  [95, 28, 1, -2.7],
  [97, 63, 1.5, -1.8],
  [6, 66, 1, -2.3],
  [33, 70, 1, -0.7],
  [57, 72, 1.5, -3.0],
  [86, 70, 1, -1.3],
  [12, 45, 1, -3.9],
] as const;

/**
 * Meteors: [left %, top %, length px, angle deg, cycle s, delay s].
 * Grouped into showers: each group shares a cycle and fires close together.
 */
const meteors = [
  // shower 1
  [8, 6, 130, 22, 9, 1],
  [16, 2, 90, 24, 9, 1.35],
  [4, 18, 110, 21, 9, 1.7],
  [22, 10, 70, 23, 9, 2.1],
  // shower 2
  [40, 4, 120, 26, 13, 5],
  [48, 14, 80, 27, 13, 5.3],
  [34, 20, 100, 25, 13, 5.75],
  // shower 3
  [60, 3, 140, 30, 17, 9],
  [70, 12, 90, 31, 17, 9.4],
  [56, 24, 70, 29, 17, 9.7],
  [66, 30, 110, 30, 17, 10.2],
  // strays
  [28, 30, 60, 20, 7, 3.2],
  [78, 6, 80, 33, 11, 7.4],
] as const;

/** Far-off asteroids: [top %, width px, opacity, crossing s, delay s]. */
const asteroids = [
  [14, 12, 0.55, 140, -30],
  [38, 8, 0.4, 170, -110],
  [6, 6, 0.35, 190, -60],
  [52, 10, 0.45, 155, -140],
  [26, 5, 0.3, 210, -20],
  [62, 7, 0.35, 180, -90],
] as const;

/** Lumpy asteroid outlines in a 40×40 box. */
const rocks = [
  "M9 12L17 5L28 7L35 15L34 26L27 34L15 35L7 28L5 19Z",
  "M7 15L14 7L25 6L33 11L36 22L30 31L19 35L10 31L5 23Z",
  "M10 9L21 5L31 10L34 20L31 30L21 35L11 32L6 22Z",
];
