import type { CSSProperties } from "react";
import { InView } from "@/components/story/InView";
import styles from "./step-network.module.css";

type Point = readonly [number, number];

/**
 * Spreading: each strategy step draws a bigger network as it scrolls in, in
 * order. 01 one city lights up, 02 a cluster of cities connects, 03 a
 * network spans the country. Drawn in the step's own colour.
 */
export function StepNetwork({ step }: { step: 0 | 1 | 2 }) {
  const { nodes, links, lit } = networks[step];
  return (
    <InView
      className={styles.network}
      data-step={step}
      style={{ "--step": step } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 160 100">
        {links.map(([a, b], i) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          return (
            <line
              key={i}
              className={styles.link}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              pathLength={1}
              style={{ "--i": i } as CSSProperties}
            />
          );
        })}
        {nodes.map(([x, y], i) => (
          <g
            key={i}
            className={i < lit ? styles.lit : styles.dim}
            style={{ "--i": i } as CSSProperties}
          >
            {i < lit && <circle className={styles.halo} cx={x} cy={y} r="9" />}
            <circle className={styles.node} cx={x} cy={y} r="3.2" />
          </g>
        ))}
      </svg>
    </InView>
  );
}

const networks: {
  nodes: Point[];
  links: [number, number][];
  /** How many of the nodes (from the start) are lit. */
  lit: number;
}[] = [
  {
    nodes: [
      [48, 52],
      [96, 30],
      [118, 68],
      [140, 40],
    ],
    links: [],
    lit: 1,
  },
  {
    nodes: [
      [22, 52],
      [56, 26],
      [60, 74],
      [94, 48],
      [128, 28],
      [134, 74],
    ],
    links: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
    ],
    lit: 6,
  },
  {
    nodes: [
      [12, 40],
      [30, 72],
      [44, 20],
      [60, 50],
      [78, 82],
      [86, 26],
      [104, 58],
      [120, 14],
      [128, 84],
      [144, 44],
      [152, 74],
    ],
    links: [
      [0, 2],
      [0, 3],
      [1, 3],
      [1, 4],
      [2, 5],
      [3, 5],
      [3, 6],
      [4, 6],
      [5, 7],
      [6, 9],
      [6, 8],
      [7, 9],
      [8, 10],
      [9, 10],
    ],
    lit: 11,
  },
];
