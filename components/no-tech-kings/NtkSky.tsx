import styles from "./ntk.module.css";

/** [angle°, half-width, breathe duration s, delay s] for each light shaft. */
const shafts = [
  [-74, 22, 11, 0],
  [-60, 30, 8, -3],
  [-47, 18, 13, -6],
  [-35, 34, 10, -2],
  [-22, 20, 7, -8],
  [-9, 28, 12, -4],
  [4, 24, 9, -1],
  [17, 32, 11, -7],
  [30, 18, 8, -5],
  [43, 30, 13, -2],
  [57, 22, 10, -9],
  [70, 28, 12, -4],
] as const;

export function NtkSky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.skyBase} />
      <div className={styles.zenith} />
      <div className={styles.horizon} />
      <div className={styles.bloom} />
      <div className={styles.rays}>
        <svg viewBox="-600 -600 1200 600" focusable="false">
          <defs>
            <radialGradient
              id="ntk-rayfade"
              gradientUnits="userSpaceOnUse"
              cx="0"
              cy="0"
              r="600"
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="14%" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="45%" stopColor="currentColor" stopOpacity="0.22" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g fill="url(#ntk-rayfade)">
            {shafts.map(([angle, width, dur, delay]) => (
              <path
                key={angle}
                d="M0 0 L-1 -600 L1 -600 Z"
                transform={`rotate(${angle}) scale(${width} 1)`}
                style={
                  {
                    "--dur": `${dur}s`,
                    "--delay": `${delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>
        </svg>
      </div>
      <div className={styles.sun} />
      <div className={styles.vignette} />
    </div>
  );
}
