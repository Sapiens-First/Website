import styles from "./donate-circle.module.css";

const people = [
  { x: 68, y: 70, fill: "var(--color-brand-yellow)" },
  { x: 210, y: 82, fill: "var(--color-brand-blue-soft)" },
  { x: 135, y: 206, fill: "var(--color-coral)" },
];

/**
 * Connection: the Donate hero art. Three people, each bobbing on their own
 * breath, with the dashed lines between them always flowing, and the speech
 * bubble at the centre speaking up now and then: a gift keeps people talking
 * and organising together.
 */
export function DonateCircle({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.art} ${className ?? ""}`}
      aria-hidden="true"
      viewBox="0 0 280 270"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        className={styles.links}
        d="M68 70L210 82M68 70L135 206M210 82L135 206"
        strokeDasharray="6 6"
      />
      {people.map((person, i) => (
        <g key={i} className={styles.person} data-person={i}>
          <circle cx={person.x} cy={person.y} r="48" fill={person.fill} />
          <g strokeLinecap="round">
            <circle cx={person.x} cy={person.y - 12} r="10" />
            <path
              d={`M${person.x - 21} ${person.y + 18}C${person.x - 21} ${person.y - 5} ${person.x + 21} ${person.y - 5} ${person.x + 21} ${person.y + 18}`}
            />
          </g>
        </g>
      ))}
      <g className={styles.bubble}>
        <path
          d="M118 119L164 119L164 148L146 148L139 157L132 148L118 148Z"
          fill="var(--color-paper)"
        />
        <path className={styles.words} d="M128 133H154" />
      </g>
    </svg>
  );
}
