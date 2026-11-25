import styles from "./cycle-spark.module.css";

/**
 * The flywheel: a spark that runs the About strategy cycle for good, Act →
 * Recruit → Train → Act, along the arrows and behind each node. Each node
 * flares as the spark reaches it (cycleSpark.node, timed to the same lap).
 * Same 380 × 330 box as the cycle's arrows.
 */
export function CycleSpark() {
  return (
    <svg
      className={styles.spark}
      viewBox="0 0 380 330"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="cycle-spark-glow">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.35" stopColor="var(--color-brand-yellow)" />
          <stop offset="1" stopColor="var(--color-coral)" stopOpacity="0" />
        </radialGradient>
        <path id="cycle-spark-lap" d={lap} />
      </defs>
      {trail.map(([r, opacity, lag]) => (
        <circle key={lag} r={r} fill="url(#cycle-spark-glow)" opacity={opacity}>
          <animateMotion
            dur={`${lapSeconds}s`}
            begin={`${lag}s`}
            repeatCount="indefinite"
          >
            <mpath href="#cycle-spark-lap" />
          </animateMotion>
        </circle>
      ))}
    </svg>
  );
}

/** Seconds per lap. Matches --lap in cycle-spark.module.css. */
const lapSeconds = 6;

/**
 * One lap through the three node centres, following the arrows between
 * them. Paced motion keeps it near thirds: each node is ~2 s apart.
 */
const lap =
  "M190 65L230 118C258 142 282 174 294 210L315 265L246 262C210 282 168 282 132 262L65 265L88 210C100 174 124 142 152 118Z";

/** Glow, then a fading tail behind it: [radius, opacity, lag s]. */
const trail = [
  [13, 1, 0],
  [9, 0.6, 0.09],
  [7, 0.4, 0.18],
  [5, 0.25, 0.27],
] as const;

/** Class for the cycle nodes, so they flare as the spark arrives. */
export const cycleSpark = { node: styles.node };
