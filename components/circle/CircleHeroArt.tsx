import { HeroArt } from "@/components/sections/SplitSection";

/** Six figures around the table: rotation (deg), shirt colour, skin tone. */
const figures = [
  { rotate: -15, body: "var(--color-brand-blue)", skin: "#efb98e" },
  { rotate: 45, body: "var(--color-paper)", skin: "#794b38" },
  { rotate: 105, body: "var(--color-brand-purple)", skin: "#d89266" },
  { rotate: 165, body: "var(--color-brand-pink)", skin: "#efb98e" },
  { rotate: 225, body: "var(--color-paper)", skin: "#ad7050" },
  { rotate: 285, body: "var(--color-brand-blue)", skin: "#794b38" },
];

export default function CircleHeroArt() {
  return (
    <HeroArt className="grid place-items-center px-3 py-7">
      <svg
        className="block h-auto w-full max-w-[650px]"
        viewBox="0 0 600 640"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <circle
          cx="300"
          cy="332"
          r="239"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2"
          strokeDasharray="3 11"
          opacity=".35"
        ></circle>
        <path
          d="M50 190l9-21 9 21 22 9-22 9-9 21-9-21-22-9Z"
          fill="var(--color-brand-yellow)"
        ></path>
        <path
          d="M520 440l7-17 7 17 17 7-17 7-7 17-7-17-17-7Z"
          fill="var(--color-paper)"
        ></path>
        <g strokeLinecap="round" strokeLinejoin="round">
          {figures.map(({ rotate, body, skin }) => (
            <g key={rotate} transform={`translate(300 332) rotate(${rotate})`}>
              <rect
                x="-43"
                y="-168"
                width="86"
                height="94"
                rx="32"
                fill="var(--color-ink)"
                transform="translate(5 6)"
              ></rect>
              <rect
                x="-43"
                y="-168"
                width="86"
                height="94"
                rx="32"
                fill={body}
                stroke="var(--color-ink)"
                strokeWidth="3"
              ></rect>
              <path
                d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="3"
                strokeLinecap="round"
              ></path>
              <circle
                cy="-182"
                r="26"
                fill={skin}
                stroke="var(--color-ink)"
                strokeWidth="3"
              ></circle>
              <path
                d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                fill="var(--color-ink)"
              ></path>
            </g>
          ))}
          <circle cx="305" cy="340" r="116" fill="var(--color-ink)"></circle>
          <circle
            cx="300"
            cy="332"
            r="116"
            fill="var(--color-brand-yellow)"
            stroke="var(--color-ink)"
            strokeWidth="3"
          ></circle>
          <circle
            cx="300"
            cy="332"
            r="101"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.5"
            opacity=".25"
          ></circle>
          <g transform="translate(266 306) rotate(-12)">
            <rect
              x="4"
              y="5"
              width="58"
              height="76"
              fill="var(--color-ink)"
            ></rect>
            <rect
              width="58"
              height="76"
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth="2"
            ></rect>
            <path
              d="M12 19h31M12 28h24M12 37h28"
              stroke="var(--color-ink)"
              strokeWidth="2"
            ></path>
            <path
              d="M13 55l6 6 13-15"
              fill="none"
              stroke="var(--color-coral-dark)"
              strokeWidth="4"
            ></path>
          </g>
          <g transform="translate(340 306) rotate(16)">
            <rect
              width="36"
              height="44"
              fill="var(--color-brand-pink)"
              stroke="var(--color-ink)"
              strokeWidth="2"
            ></rect>
            <path
              d="M8 13h20M8 21h15"
              stroke="var(--color-ink)"
              strokeWidth="2"
            ></path>
          </g>
          <g
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth="2.5"
          >
            <path d="M237 300c-19-13-26 13-7 16" fill="none"></path>
            <circle cx="242" cy="313" r="14"></circle>
            <path d="M345 380c19 13 26-13 7-16" fill="none"></path>
            <circle cx="340" cy="367" r="14"></circle>
          </g>
          <g fill="var(--color-ink)">
            <circle cx="242" cy="313" r="8"></circle>
            <circle cx="340" cy="367" r="8"></circle>
          </g>
          <path
            d="M277 405l43-8"
            stroke="var(--color-brand-blue)"
            strokeWidth="7"
          ></path>
          <path
            d="M320 397l7-2"
            stroke="var(--color-ink)"
            strokeWidth="4"
          ></path>
        </g>
        <g transform="translate(57 43) rotate(-5)">
          <path d="M7 7H249V94H7Z" fill="var(--color-ink)"></path>
          <path
            d="M0 0H242V87H0Z"
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth="3"
          ></path>
          <text
            className="font-display text-[31px] font-extrabold tracking-[-0.5px]"
            x="16"
            y="36"
            fill="var(--color-ink)"
          >
            FIND YOUR PEOPLE.
          </text>
          <text
            className="font-display text-[31px] font-extrabold tracking-[-0.5px]"
            x="16"
            y="71"
            fill="var(--color-ink)"
          >
            BUILD SOMETHING.
          </text>
          <path
            d="M88-8h64v17H88Z"
            fill="var(--color-brand-yellow)"
            opacity=".85"
          ></path>
        </g>
        <g transform="translate(342 536) rotate(6)">
          <rect width="202" height="58" fill="var(--color-ink)"></rect>
          <text
            className="font-display text-[31px] font-extrabold tracking-[-0.5px]"
            x="16"
            y="40"
            fill="var(--color-paper)"
          >
            ROOM FOR YOU.
          </text>
        </g>
        <path
          d="M70 527q-23 42 47 50M103 565l16 12-17 9"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <text
          className="font-body text-[13px] font-bold tracking-[2px]"
          x="135"
          y="586"
          fill="var(--color-ink)"
        >
          IT STARTS WITH US.
        </text>
      </svg>
    </HeroArt>
  );
}
