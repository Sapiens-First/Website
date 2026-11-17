function ChassisPaths() {
  return (
    <>
      <g
        fill="var(--color-brand-yellow)"
        stroke="var(--color-ink)"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="square"
      >
        <path d="M30 40 V18 L40 28 L52 12 L60 26 L68 12 L80 28 L90 18 V40 H95 V50 H25 V40 Z" />
      </g>
      <rect
        x="40"
        y="34"
        width="8"
        height="8"
        rx="1.5"
        fill="var(--color-brand-blue)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      <rect
        x="56"
        y="34"
        width="8"
        height="8"
        rx="1.5"
        fill="var(--color-brand-blue)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      <rect
        x="72"
        y="34"
        width="8"
        height="8"
        rx="1.5"
        fill="var(--color-brand-blue)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      <path
        fill="var(--color-brand-yellow)"
        stroke="var(--color-ink)"
        strokeWidth="5.5"
        strokeLinejoin="round"
        d="M20 64 c0-16 16-26 40-26 s40 10 40 26 v18 L90 112 H30 L20 82 Z"
      />
      <circle cx="42" cy="70" r="13" fill="var(--color-ink)" />
      <circle cx="78" cy="70" r="13" fill="var(--color-ink)" />
      <circle cx="42" cy="70" r="7.2" fill="var(--color-brand-blue)" />
      <circle cx="78" cy="70" r="7.2" fill="var(--color-brand-blue)" />
      <circle cx="39.5" cy="67.2" r="2.3" fill="var(--color-paper)" />
      <circle cx="75.5" cy="67.2" r="2.3" fill="var(--color-paper)" />
      <rect
        x="36"
        y="90"
        width="12"
        height="14"
        rx="2"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />
      <rect
        x="54"
        y="90"
        width="12"
        height="14"
        rx="2"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />
      <rect
        x="72"
        y="90"
        width="12"
        height="14"
        rx="2"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />
      <path
        d="M16 8 L106 112"
        stroke="var(--color-ink)"
        strokeWidth="17"
        strokeLinecap="square"
      />
      <path
        d="M16 8 L106 112"
        stroke="var(--color-coral)"
        strokeWidth="11"
        strokeLinecap="square"
      />
      <path
        d="M16 8 L106 112"
        stroke="var(--color-paper)"
        strokeWidth="4"
        strokeLinecap="square"
      />
    </>
  );
}

export function ChassisMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <title>No Tech Kings — crowned chassis</title>
      <ChassisPaths />
    </svg>
  );
}

const sealDots = [
  [60, 9],
  [79.52, 12.88],
  [96.06, 23.94],
  [107.12, 40.48],
  [111, 60],
  [107.12, 79.52],
  [96.06, 96.06],
  [79.52, 107.12],
  [60, 111],
  [40.48, 107.12],
  [23.94, 96.06],
  [12.88, 79.52],
  [9, 60],
  [12.88, 40.48],
  [23.94, 23.94],
  [40.48, 12.88],
] as const;

export function SealMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <title>No Tech Kings — 1776 / 2026 seal</title>
      {sealDots.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="9"
          fill="var(--color-coral)"
          stroke="var(--color-ink)"
          strokeWidth="4"
        />
      ))}
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="var(--color-coral)"
        stroke="var(--color-ink)"
        strokeWidth="4"
      />
      <circle
        cx="60"
        cy="60"
        r="31"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="3"
      />
      <clipPath id="ntk-seal-face">
        <circle cx="60" cy="60" r="29.5" />
      </clipPath>
      <g
        clipPath="url(#ntk-seal-face)"
        transform="translate(60 61) scale(0.46) translate(-60 -60)"
      >
        <title>No Tech Kings — crowned robot skull</title>
        <ChassisPaths />
      </g>
      <defs>
        <path
          id="ntk-seal-ring"
          d="M60,60 m0,-40.5 a40.5,40.5 0 1,1 0,81 a40.5,40.5 0 1,1 0,-81"
        />
      </defs>
      <text
        fontFamily="Times New Roman, Georgia, serif"
        fontSize="7.2"
        fontWeight="700"
        letterSpacing="1.5"
        fill="var(--color-ink)"
      >
        <textPath href="#ntk-seal-ring" startOffset="0%">
          NO TECH KINGS · DEC 14 · NO TECH KINGS ·
        </textPath>
      </text>
    </svg>
  );
}
