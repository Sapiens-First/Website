import { SplitHero } from "@/components/sections/SplitSection";
import { Container } from "@/components/layout/Container";
import { Label } from "@/components/ui/Label";
import type { Metadata } from "next";
import Image from "next/image";
import CampaignCarousel from "@/components/CampaignCarousel";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sapiens First — A Movement for AI Accountability",
  description:
    "Join Sapiens First to defend humanity from the threats of superintelligence. Explore our campaigns, fellowship, and local organizing groups.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sapiens First — A Movement for AI Accountability",
    description:
      "Join Sapiens First to defend humanity from the threats of superintelligence. Explore our campaigns, fellowship, and local organizing groups.",
    url: "/",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-home">
      <main className="route-home">
        <SplitHero>
          <div className="hero-copy">
            <svg
              className="hero-confetti hero-confetti--top"
              viewBox="0 0 160 90"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="paper-red"
                d="M8 35l6-3 8 17-6 3zM124 8l6 2-5 15-6-2z"
              ></path>
              <path
                className="paper-blue"
                d="M58 4l7 1-2 17-7-1zM114 73l5-5 11 10-5 5z"
              ></path>
              <path
                className="paper-yellow"
                d="M37 72l13-7 4 6-13 7zM148 40l7 3-4 8-7-3z"
              ></path>
            </svg>
            <svg
              className="hero-confetti hero-confetti--bottom"
              viewBox="0 0 160 90"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="paper-red"
                d="M8 35l6-3 8 17-6 3zM124 8l6 2-5 15-6-2z"
              ></path>
              <path
                className="paper-blue"
                d="M58 4l7 1-2 17-7-1zM114 73l5-5 11 10-5 5z"
              ></path>
              <path
                className="paper-yellow"
                d="M37 72l13-7 4 6-13 7zM148 40l7 3-4 8-7-3z"
              ></path>
            </svg>
            <svg
              className="hero-confetti hero-confetti--left"
              viewBox="0 0 160 90"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="paper-red"
                d="M8 35l6-3 8 17-6 3zM124 8l6 2-5 15-6-2z"
              ></path>
              <path
                className="paper-blue"
                d="M58 4l7 1-2 17-7-1zM114 73l5-5 11 10-5 5z"
              ></path>
              <path
                className="paper-yellow"
                d="M37 72l13-7 4 6-13 7zM148 40l7 3-4 8-7-3z"
              ></path>
            </svg>
            <h1>
              Revolt for our <span className="jolt">future.</span>
            </h1>
            <p>Defend humanity from the threats of artificial intelligence.</p>
            <SignupForm interest="membership" buttonText="Join →" />
            <a className="hero-read-more" href="#crisis">
              Read more →
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <Image
              className="hero-photo absolute inset-0 h-full w-full object-cover"
              src="/assets/homepage-hero-photo.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              preload
            />
            <svg
              className="hero-confetti"
              viewBox="0 0 160 90"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="paper-red"
                d="M8 35l6-3 8 17-6 3zM124 8l6 2-5 15-6-2z"
              ></path>
              <path
                className="paper-blue"
                d="M58 4l7 1-2 17-7-1zM114 73l5-5 11 10-5 5z"
              ></path>
              <path
                className="paper-yellow"
                d="M37 72l13-7 4 6-13 7zM148 40l7 3-4 8-7-3z"
              ></path>
            </svg>
            <svg
              className="hero-confetti hero-confetti--right"
              viewBox="0 0 160 90"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="paper-red"
                d="M8 35l6-3 8 17-6 3zM124 8l6 2-5 15-6-2z"
              ></path>
              <path
                className="paper-blue"
                d="M58 4l7 1-2 17-7-1zM114 73l5-5 11 10-5 5z"
              ></path>
              <path
                className="paper-yellow"
                d="M37 72l13-7 4 6-13 7zM148 40l7 3-4 8-7-3z"
              ></path>
            </svg>
          </div>
        </SplitHero>

        <section className="crisis bg-white" id="crisis">
          <div className="crisis-statement">
            <svg
              className="crisis-earth"
              viewBox="0 0 400 400"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <clipPath id="crisis-earth-disc">
                  <circle cx="200" cy="200" r="170"></circle>
                </clipPath>
              </defs>
              <circle
                cx="200"
                cy="200"
                r="170"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              ></circle>
              <g clipPath="url(#crisis-earth-disc)">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity=".4"
                >
                  <ellipse cx="200" cy="200" rx="86" ry="170"></ellipse>
                  <ellipse cx="200" cy="200" rx="170" ry="62"></ellipse>
                  <path d="M200 30V370M30 200H370M58 108Q200 163 342 108M58 292Q200 237 342 292"></path>
                </g>

                <g
                  fill="currentColor"
                  fillOpacity={0.22}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M35 113L65 82L106 64L142 72L157 94L145 110L160 126L141 146L124 148L114 169L99 177L112 194L128 201L137 220L125 226L110 207L94 199L82 174L64 165L51 145L31 141Z"></path>
                  <path d="M136 220L159 215L183 231L197 253L181 279L176 305L160 325L150 350L139 337L140 308L129 282L116 261L118 237Z"></path>
                  <path d="M173 43L204 39L217 54L205 78L188 91L173 76Z"></path>
                  <path d="M237 103L250 80L266 69L273 92L288 94L304 81L339 89L372 118L383 158L356 172L336 159L321 173L305 149L287 154L275 139L254 144L245 128L227 130L224 115Z"></path>
                  <path d="M240 154L272 151L287 170L302 185L286 213L281 244L264 265L249 253L242 226L225 211L217 189L223 167Z"></path>
                  <path d="M302 256L311 274L305 292L298 280ZM334 280L360 270L381 291L366 315L339 310L324 296Z"></path>
                </g>
              </g>
            </svg>
            <div className="fun-layer" aria-hidden="true">
              <i className="accent-moon">
                <svg
                  className="moon"
                  viewBox="0 0 40 40"
                  width="52"
                  height="52"
                >
                  <mask id="crisis-moon-mask">
                    <rect width="40" height="40" fill="#fff"></rect>
                    <circle cx="27" cy="13" r="14" fill="#000"></circle>
                  </mask>
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="currentColor"
                    mask="url(#crisis-moon-mask)"
                  ></circle>
                </svg>
              </i>
            </div>
            <div className="crisis-copy">
              <Label tone="coral" size="section">
                Crisis
              </Label>
              <div className="crisis-line">
                Artificial intelligence is threatening the future of{" "}
                <em>
                  <span className="word-brush">humanity.</span>
                </em>
              </div>
              <div
                className="crisis-stars pointer-events-none -top-20 -bottom-16 left-0 max-sm:-top-11 max-sm:right-60 max-sm:-bottom-8"
                aria-hidden="true"
              >
                <i
                  className="star"
                  style={{
                    left: "28%",
                    top: "9%",
                    width: "5.6px",
                    height: "5.6px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "61%",
                    top: "16%",
                    width: "7.7px",
                    height: "7.7px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "43%",
                    top: "23%",
                    width: "9.8px",
                    height: "9.8px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "78%",
                    top: "30%",
                    width: "5.6px",
                    height: "5.6px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "32%",
                    top: "37%",
                    width: "7.7px",
                    height: "7.7px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "67%",
                    top: "44%",
                    width: "9.8px",
                    height: "9.8px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "48%",
                    top: "51%",
                    width: "5.6px",
                    height: "5.6px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "82%",
                    top: "58%",
                    width: "7.7px",
                    height: "7.7px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "36%",
                    top: "65%",
                    width: "9.8px",
                    height: "9.8px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "71%",
                    top: "72%",
                    width: "5.6px",
                    height: "5.6px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "53%",
                    top: "79%",
                    width: "11.2px",
                    height: "11.2px",
                  }}
                ></i>
                <i
                  className="star"
                  style={{
                    left: "25%",
                    top: "86%",
                    width: "7px",
                    height: "7px",
                  }}
                ></i>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <strong>300M</strong>
                <span>Jobs exposed to AI automation</span>
              </div>
              <div className="stat">
                <strong>73%</strong>
                <span>Of Americans favor stronger AI oversight</span>
              </div>
              <div className="stat">
                <strong>$100M</strong>
                <span>Raised by industry lobbyists in 2026</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="vision overflow-hidden bg-paper px-0 py-28 max-sm:px-0 max-sm:py-14"
          id="vision"
        >
          <svg
            className="section-mark pointer-events-none absolute top-5 h-14 w-20 max-sm:top-2.5 max-sm:right-5 max-sm:h-9 max-sm:w-14"
            viewBox="0 0 88 56"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="44" cy="28" r="13"></circle>
            <path d="M44 3v5M44 48v5M19 28h5M64 28h5M26 10l4 4M58 42l4 4M26 46l4-4M58 14l4-4"></path>
          </svg>
          <Container>
            <div className="vision-copy">
              <Label tone="yellow" size="section">
                Vision
              </Label>
              <h2 className="mt-5">
                Technology for the{" "}
                <span className="ink-underline blue">common good.</span>
              </h2>
              <p className="deck">
                We imagine a world where technology serves the people, not just
                a rich few.
              </p>
              <svg
                className="action-strokes mt-7 block h-7 w-20 text-coral"
                viewBox="0 0 76 30"
                aria-hidden="true"
              >
                <path d="M4 25L19 7M28 25L43 7M52 25L67 7"></path>
              </svg>
            </div>
            <div className="campaigns mt-20 max-sm:mt-12">
              <div className="campaigns-head flex items-end justify-between gap-6 max-sm:items-center">
                <h3>Our demands</h3>
              </div>
              <CampaignCarousel />
            </div>
          </Container>
        </section>

        <section className="strategy" id="strategy">
          <svg
            className="section-mark pointer-events-none absolute top-5 h-14 w-20 max-sm:top-2.5 max-sm:right-5 max-sm:h-9 max-sm:w-14"
            viewBox="0 0 88 56"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M10 46h20V32h20V18h24M64 8l10 10-10 10"></path>
            <circle cx="10" cy="46" r="3"></circle>
          </svg>
          <Container className="strategy-grid grid items-center gap-12 max-lg:gap-8 max-sm:gap-5 max-sm:pb-8">
            <div>
              <Label tone="coral" size="section">
                Strategy
              </Label>
              <h2 className="mt-5">
                We build movement{" "}
                <span className="word-block leading-none text-white">
                  power.
                </span>
              </h2>
            </div>
            <div>
              <p className="deck">
                We fight for revolutionary political change around technology.
                We start in our cities and schools, building towards state and
                federal action.
              </p>
            </div>
          </Container>
          <div className="process isolate mt-12 grid border-t-2 border-solid border-t-ink max-sm:mt-0">
            <div className="step">
              <small>01</small>
              <h3>Seed cities</h3>
            </div>
            <div className="step">
              <small>02</small>
              <h3>State campaigns</h3>
            </div>
            <div className="step">
              <small>03</small>
              <h3>Federal action</h3>
            </div>
          </div>
        </section>

        <section
          className="involved grid grid-cols-2 bg-paper max-lg:grid-cols-1"
          id="involved"
        >
          <div className="involved-copy overflow-hidden max-sm:pt-14 max-sm:pr-5 max-sm:pb-11 max-sm:pl-5">
            <svg
              className="section-mark pointer-events-none absolute top-5 h-14 w-20 max-sm:top-2.5 max-sm:right-5 max-sm:h-9 max-sm:w-14"
              viewBox="0 0 88 56"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="44" cy="12" r="6"></circle>
              <circle cx="22" cy="25" r="6"></circle>
              <circle cx="66" cy="25" r="6"></circle>
              <path d="M33 32v-3a11 11 0 0 1 22 0v3M10 48v-4a12 12 0 0 1 24 0v4M54 48v-4a12 12 0 0 1 24 0v4M34 48h20"></path>
            </svg>
            <Label tone="purple">Get involved</Label>
            <h2 className="mt-5">
              Dare to{" "}
              <em className="fight-highlight isolate inline-block text-ink not-italic">
                fight
              </em>{" "}
              for a brighter future.
            </h2>
            <p className="deck">
              <strong>Connect to your chapter today.</strong>
            </p>
            <SignupForm interest="membership" buttonText="Join →" />
          </div>
          <div className="quote">
            <blockquote>
              “It always seems impossible until it is done.”
              <cite>Nelson Mandela</cite>
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  );
}
