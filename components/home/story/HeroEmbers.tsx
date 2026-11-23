import type { CSSProperties } from "react";
import styles from "./hero-embers.module.css";

/**
 * Spark: small red-orange embers popping up on 33 cities across the hero's US map,
 * every other one sending up a spark, over a white wash that lightens the
 * hero panel. Sits in the same box as the map
 * (HeroCopy's ::before in app/(public)/page.tsx), so the positions are % of
 * /assets/us.svg.
 */
export function HeroEmbers() {
  return (
    <>
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.map} aria-hidden="true">
        {shown.map(([x, y], i) => {
          // Each city pops on its own 10–18 s cycle, out of step with its
          // neighbours, so embers keep appearing all over the map.
          const t = 2 * (5 + ((i * 7) % 11) * 0.4);
          return (
            <span
              key={i}
              className={styles.city}
              style={
                {
                  left: `${x}%`,
                  top: `${y}%`,
                  "--t": `${t.toFixed(1)}s`,
                  "--d": `${(-((i * 7.4) % t)).toFixed(2)}s`,
                } as CSSProperties
              }
            >
              {i % 2 === 0 && <i />}
            </span>
          );
        })}
      </div>
    </>
  );
}

/**
 * [left %, top %] for 65 US cities, projected from latitude and
 * longitude onto /assets/us.svg and checked to sit inside the state shapes.
 */
const cities = [
  [20.3, 10], // Seattle
  [26.7, 12.3], // Spokane
  [19.3, 16.8], // Portland
  [17.9, 22], // Eugene
  [26.8, 26.5], // Boise
  [16.6, 41], // Sacramento
  [17, 41.8], // SF
  [18.4, 48.3], // Fresno
  [20.5, 56.8], // LA
  [22.3, 59.5], // San Diego
  [19.6, 38.8], // Reno
  [25.6, 52.6], // Las Vegas
  [32.3, 38], // Salt Lake
  [29.8, 63.3], // Phoenix
  [31.3, 67.9], // Tucson
  [39.3, 59.2], // Albuquerque
  [42.7, 43.2], // Denver
  [43.2, 38.4], // Cheyenne
  [38.6, 21.6], // Billings
  [31.2, 16.3], // Missoula
  [49.8, 19], // Bismarck
  [55.6, 30.2], // Sioux Falls
  [56.9, 38.1], // Omaha
  [54.8, 50.7], // Wichita
  [54.5, 58.4], // Oklahoma City
  [55.8, 67.7], // Dallas
  [54.2, 76.5], // Austin
  [58.5, 78], // Houston
  [52.9, 79.5], // San Antonio
  [38.9, 69.7], // El Paso
  [60.6, 24.8], // Minneapolis
  [60.4, 36.6], // Des Moines
  [59.1, 45.5], // Kansas City
  [66.2, 46.2], // St Louis
  [63.3, 60.2], // Little Rock
  [67.9, 76.2], // New Orleans
  [67.3, 68.1], // Jackson
  [67, 58.2], // Memphis
  [72.2, 53.6], // Nashville
  [72.8, 62.8], // Birmingham
  [76.8, 61], // Atlanta
  [82.7, 71.3], // Jacksonville
  [84.1, 77.2], // Orlando
  [83.9, 79.3], // Tampa
  [87, 85.8], // Miami
  [82.2, 54.1], // Charlotte
  [85.6, 50.9], // Raleigh
  [86.8, 44.2], // Richmond
  [86.8, 39.3], // DC
  [89.5, 34.6], // Philadelphia
  [90.5, 31.2], // NYC
  [94, 23.5], // Boston
  [93.8, 19.1], // Portland ME
  [89.7, 18], // Burlington
  [89.9, 24.5], // Albany
  [81.6, 35.8], // Pittsburgh
  [77.1, 39], // Columbus
  [79.4, 34.7], // Cleveland
  [76.3, 30.8], // Detroit
  [72.3, 40.9], // Indianapolis
  [69.5, 34.2], // Chicago
  [68.8, 30.2], // Milwaukee
  [66.6, 30.6], // Madison
  [73.3, 46], // Louisville
  [84.7, 61.9], // Charleston
] as const;

/** Every other city, which keeps them spread across the whole country. */
const shown = cities.filter((_, i) => i % 2 === 0);
