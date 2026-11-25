import type { CSSProperties } from "react";
import styles from "./hero-horizon.module.css";

/** Horizon line in the 720×900 scene. */
const H = 560;
/** The sun sits right of centre, ahead of the flock. */
const SUN_X = 440;

/** A half-disc standing on the horizon. */
const dome = (r: number) =>
  `M${SUN_X - r} ${H}A${r} ${r} 0 0 1 ${SUN_X + r} ${H}Z`;

/**
 * Daybreak: the hero art on About and Fellowship, drawn as a flat poster. A
 * sun rises in widening halos and lays a shimmering path of light toward the
 * viewer; the flock and stickers sit on top. A new day, and many moving in
 * one direction toward it.
 */
export function HeroHorizon() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 720 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <rect className={styles.sky} width="720" height={H} />
      {halos.map(([r, tone], i) => (
        <path
          key={r}
          className={styles.halo}
          d={dome(r)}
          style={{ "--tone": tone, "--i": i } as CSSProperties}
        />
      ))}
      <path className={styles.sun} d={dome(150)} />

      {/* The ground covers the sun as it rises from behind the horizon. */}
      <rect className={styles.ground} y={H} width="720" height={900 - H} />
      <path className={styles.horizon} d={`M0 ${H}H720`} />

      {/* Its light on the ground: bars that thin out toward the viewer. */}
      {light.map(([y, w, h], i) => (
        <rect
          key={y}
          className={styles.light}
          x={SUN_X - w / 2}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/** [radius, fill], outermost first. */
const halos = [
  [420, "color-mix(in oklch, var(--color-coral) 78%, var(--color-paper))"],
  [320, "color-mix(in oklch, var(--color-coral) 52%, var(--color-paper))"],
  [228, "var(--color-brand-peach)"],
] as const;

/** [top y, width, height], nearest the horizon first. */
const light = [
  [580, 280, 12],
  [612, 236, 14],
  [652, 192, 16],
  [702, 150, 18],
  [764, 110, 20],
  [838, 72, 22],
] as const;
