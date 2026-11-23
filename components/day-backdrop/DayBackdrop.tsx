"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { startLevels, type DayLevels } from "./layers";
import styles from "./day-backdrop.module.css";

/**
 * "Day after dawn" backdrop. Scroll position is the time of day (--p, 0 at
 * the top of the page → 1 at the bottom). Each element is a separate layer
 * that can be turned down or removed through `levels` (see layers.ts).
 * `time` overrides scroll, for scrubbing in the preview.
 */
export default function DayBackdrop({
  levels = startLevels,
  time,
}: {
  levels?: DayLevels;
  time?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-site-bg", "");
    html.setAttribute("data-day-bg", "");
    return () => {
      html.removeAttribute("data-site-bg");
      html.removeAttribute("data-day-bg");
    };
  }, []);

  // The footer lives outside the backdrop, so its level goes on <html>.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--day-footer-clear",
      String(levels.footer),
    );
  }, [levels.footer]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (time !== undefined) {
      el.style.setProperty("--p", time.toFixed(4));
      return;
    }
    const html = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(1, html.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [time]);

  const vars = Object.fromEntries(
    Object.entries(levels).map(([id, k]) => [`--k-${id}`, k]),
  ) as CSSProperties;
  const on = (id: keyof DayLevels) => levels[id] > 0;

  return (
    <div
      ref={ref}
      className={styles.backdrop}
      style={vars}
      data-still={levels.motion === 0 ? "" : undefined}
      aria-hidden="true"
    >
      {on("warmth") && <div className={styles.warmth} />}
      {on("sky") && <div className={styles.sky} />}
      {on("rays") && <div className={styles.rays} />}
      {on("sun") && (
        <>
          <div className={styles.sun} />
          <div className={styles.sunCore} />
        </>
      )}
      {on("haze") && <div className={styles.haze} />}
      {on("clouds") && (
        <div className={styles.clouds}>
          {[0, 1, 2, 3].map((i) => (
            <Cloud key={i} />
          ))}
        </div>
      )}
      {on("hills") && <Hills trees={on("trees")} />}
      {on("birds") && (
        <div className={styles.birds}>
          {[0, 1, 2].map((i) => (
            <Flock key={i} />
          ))}
        </div>
      )}
      {on("motes") && (
        <div className={styles.motes}>
          {motes.map(([x, y, size, delay], i) => (
            <span
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
      )}
      {on("grain") && <div className={styles.grain} />}
    </div>
  );
}

function Cloud() {
  return (
    <svg className={styles.cloud} viewBox="0 0 200 70">
      <circle cx="58" cy="44" r="20" />
      <circle cx="88" cy="32" r="27" />
      <circle cx="122" cy="38" r="22" />
      <circle cx="148" cy="48" r="14" />
      <rect x="38" y="44" width="124" height="22" rx="11" />
    </svg>
  );
}

/** Bird offsets inside a flock: [x px, y px, scale, flap delay s]. */
const flock = [
  [0, 28, 1, 0],
  [40, 9, 0.85, 0.18],
  [46, 50, 0.9, 0.31],
  [86, 0, 0.7, 0.09],
  [92, 37, 0.75, 0.42],
  [130, 18, 0.6, 0.25],
] as const;

function Flock() {
  return (
    <div className={styles.flock}>
      <div className={styles.flockBob}>
        {flock.map(([x, y, s, d], i) => (
          <svg
            key={i}
            className={styles.bird}
            viewBox="0 0 20 8"
            style={
              {
                left: `${x}px`,
                top: `${y}px`,
                "--s": s,
                "--d": `${d}s`,
              } as CSSProperties
            }
          >
            <path d="M1 6Q5.5 0 10 6Q14.5 0 19 6" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function Hills({ trees }: { trees: boolean }) {
  return (
    <div className={styles.hills}>
      <svg
        className={styles.far}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 200C190 150 380 176 560 160C760 142 910 190 1110 168C1270 150 1370 160 1440 154V320H0Z" />
      </svg>
      <svg
        className={styles.mid}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 246C170 214 340 232 520 222C720 210 860 256 1060 238C1240 222 1340 232 1440 224V320H0Z" />
      </svg>
      <svg
        className={styles.near}
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
      >
        <path d="M0 284C220 254 420 274 640 266C860 258 1040 292 1240 280C1340 274 1400 276 1440 274V320H0Z" />
        {trees && (
          <g className={styles.trees}>
            {trees_.map(([x, y, r], i) => (
              <g key={i}>
                <rect x={x - 1.5} y={y - r} width="3" height={r + 4} />
                <ellipse cx={x} cy={y - r * 1.5} rx={r * 0.8} ry={r} />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

/** Trees on the near ridge: [x, ground y, size]. */
const trees_ = [
  [160, 268, 13],
  [184, 266, 9],
  [702, 266, 11],
  [1010, 284, 15],
  [1036, 285, 10],
  [1306, 277, 12],
] as const;

/** Golden-hour motes: [left %, top %, size px, delay s]. */
const motes = [
  [8, 62, 4, 0],
  [17, 78, 3, -4],
  [24, 55, 5, -9],
  [33, 70, 3, -2],
  [41, 84, 4, -12],
  [49, 60, 3, -6],
  [56, 74, 5, -1],
  [63, 58, 3, -10],
  [70, 80, 4, -3],
  [76, 66, 3, -8],
  [83, 52, 5, -5],
  [90, 72, 3, -11],
  [95, 60, 4, -7],
  [12, 90, 3, -13],
  [52, 92, 4, -14],
  [86, 88, 3, -2.5],
] as const;
