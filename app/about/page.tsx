import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "About — Sapiens First",
  description:
    "Learn about Sapiens First — who we are, what we do, and the values that guide our fight for humanity's future.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Sapiens First",
    description:
      "Learn about Sapiens First — who we are, what we do, and the values that guide our fight for humanity's future.",
    url: "/about",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-about">
      <main className="route-about">
        <section className="hero">
          <div className="hero-copy">
            <div className="kicker">{"About Sapiens First"}</div>
            <h1>
              {"We are the human "}
              <span className="underline yellow">{"movement."}</span>
            </h1>
            <p>
              {
                "We build political power to make sure artificial intelligence benefits the common good."
              }
            </p>
            <a className="hero-read-more" href="#vision">
              {"Read more →"}
            </a>
            <p className="hero-note">
              {"Non-profit · Founded 2026 · Volunteer-powered"}
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun"></div>
            <div className="burst"></div>
            <div className="face"></div>
            <div className="confetti c1"></div>
            <div className="confetti c2"></div>
            <div className="confetti c3"></div>
            <div className="confetti c4"></div>
            <i
              style={
                {
                  position: "absolute",
                  left: "10%",
                  top: "8%",
                  zIndex: "2",
                  color: "var(--ink)",
                  transform: "rotate(-6deg)",
                } as React.CSSProperties
              }
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
            <i
              style={
                {
                  position: "absolute",
                  left: "20%",
                  top: "16%",
                  zIndex: "2",
                  color: "var(--ink)",
                  transform: "rotate(4deg) scale(.7)",
                } as React.CSSProperties
              }
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
          </div>
        </section>
        <section className="about" id="vision">
          <div className="container about-grid">
            <div className="about-copy">
              <div className="label">{"Vision"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"We imagine tech for the "}
                <span className="underline blue">{"common good."}</span>
              </h2>
              <p className="deck">
                {
                  "AI will reshape democracy, prosperity, and security. We're building the political power to make sure it reshapes them for the better."
                }
              </p>
              <a className="text-link" href="/policy">
                {"Read our Recommendations →"}
              </a>
            </div>
            <div className="about-art">
              <div className="circle"></div>
              <div className="tag t1">{"Democratic Renewal"}</div>
              <div className="tag t2">{"Common Prosperity"}</div>
              <div className="tag t3">{"A Secure Future"}</div>
            </div>
          </div>
          <div className="container">
            <details className="focus-dropdown" id="focus-areas">
              <summary>
                {"Our focus areas "}
                <span aria-hidden="true" className="focus-toggle"></span>
              </summary>
              <article className="focus-area">
                <h3>{"Democratic Renewal"}</h3>
                <p>
                  {
                    "AI will have profound impacts on our democratic institutions. Done wrong, AI could empower authoritarians to violate our civil liberties; corrupt politicians through rampant wealth inequality; sully public discourse with deepfakes, addictive technology, and sensationalist media. We believe that instead, AI should enhance democratic institutions, and empower ordinary citizens to have greater participation in public life."
                  }
                </p>
              </article>
              <article className="focus-area">
                <h3>{"Common Prosperity"}</h3>
                <p>
                  {
                    "The gains from AI will be vast, and must be shared broadly across society. Currently, wealth gains from AI have concentrated in the hands of the rich few. We believe that it should be instead used to uplift all people in society through redistribution and a reinvestment in public institutions. We also believe that AI should reduce dysfunction in government, and should be used to accelerate advances in science and technology."
                  }
                </p>
              </article>
              <article className="focus-area">
                <h3>{"A Secure Future"}</h3>
                <p>
                  {
                    "Cutting-edge artificial intelligence has the potential to cause mass devastation if left unchecked. To combat this, major powers must cooperate to lead the development of safe superintelligence. Frontier AI must be developed transparently, and we should have the best scientists working to ensure AI remains under human control. Additionally, we must have civil society input on AI governance, so that the power of superintelligence benefits all of humanity."
                  }
                </p>
              </article>
            </details>
          </div>
        </section>
        <section className="roadmap-band" id="roadmap">
          <div className="container">
            <div className="label alt-blue">{"Our Plan"}</div>
            <h2>
              {"City by city, "}
              <span className="underline blue">{"state by state."}</span>
            </h2>
            <p className="deck">
              {
                "We build local chapters, press city councils to act on AI, and bring that momentum together to win policy in California."
              }
            </p>
            <ol className="strategy-path">
              <li>
                <span className="step-icon" aria-hidden="true">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="9" r="4"></circle>
                    <path d="M10 26v-7c0-7 16-7 16 0v7M5 14v12M31 14v12M14 26v6M22 26v6"></path>
                  </svg>
                </span>
                <h3>{"Local chapters"}</h3>
              </li>
              <li>
                <span className="step-icon" aria-hidden="true">
                  <svg viewBox="0 0 36 36">
                    <path d="M5 14h8L29 7v22l-16-7H5zM11 22l3 10h6l-3-9M32 15h2M32 21h2"></path>
                  </svg>
                </span>
                <h3>{"City campaigns"}</h3>
              </li>
              <li>
                <span className="step-icon" aria-hidden="true">
                  <svg viewBox="0 0 36 36">
                    <path d="M3 13L18 4l15 9zM7 16v13M14 16v13M22 16v13M29 16v13M3 32h30"></path>
                  </svg>
                </span>
                <h3>{"Statewide movement"}</h3>
              </li>
            </ol>
          </div>
        </section>
        <section className="strategy" id="strategy">
          <div className="container">
            <div className="label alt-green">{"Strategy"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"We build "}
              <span className="underline green">{"movement power."}</span>
            </h2>
            <p className="deck">
              {
                "We believe power comes from the bottom-up. We build movement power through a cycle of civic engagement."
              }
            </p>
            <div
              className="cycle"
              role="group"
              aria-label="Act, Recruit, Train cycle"
            >
              <svg
                className="cycle-lines"
                viewBox="0 0 380 330"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="cycle-arrowhead"
                    markerWidth="9"
                    markerHeight="9"
                    refX="6.5"
                    refY="3.5"
                    orient="auto"
                  >
                    <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--ink)"></path>
                  </marker>
                </defs>
                <path
                  d="M230 118 C258 142 282 174 294 210"
                  markerEnd="url(#cycle-arrowhead)"
                ></path>
                <path
                  d="M246 262 C210 282 168 282 132 262"
                  markerEnd="url(#cycle-arrowhead)"
                ></path>
                <path
                  d="M88 210 C100 174 124 142 152 118"
                  markerEnd="url(#cycle-arrowhead)"
                ></path>
              </svg>
              <div className="cycle-hub">
                {"Movement"}
                <br />
                {"power"}
              </div>
              <button
                className="cycle-node cycle-node-act"
                type="button"
                data-step="act"
                aria-pressed="false"
              >
                <span>{"Act"}</span>
                <span className="cycle-tip">
                  {
                    "Visible, peaceful pressure makes AI governance impossible to ignore."
                  }
                </span>
              </button>
              <button
                className="cycle-node cycle-node-recruit"
                type="button"
                data-step="recruit"
                aria-pressed="false"
              >
                <span>{"Recruit"}</span>
                <span className="cycle-tip">
                  {
                    "Every public action creates conversations, gatherings, and local relationships."
                  }
                </span>
              </button>
              <button
                className="cycle-node cycle-node-train"
                type="button"
                data-step="train"
                aria-pressed="false"
              >
                <span>{"Train"}</span>
                <span className="cycle-tip">
                  {
                    "New advocates learn organizing skills and become leaders for the next action."
                  }
                </span>
              </button>
            </div>
            <a className="text-link" href="/learn">
              {"Read the Guide →"}
            </a>
          </div>
        </section>
        <section className="about" id="founder">
          <div className="container about-grid">
            <div className="about-art">
              <img
                src="/assets/rohan-prasad.jpg"
                alt="Rohan Prasad, founder of Sapiens First"
                loading="lazy"
              />
            </div>
            <div className="about-copy">
              <div className="label alt-yellow">{"Founder"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"Rohan Prasad "}
                <span className="underline yellow">
                  {"Executive Director."}
                </span>
              </h2>
              <p className="deck">
                {
                  "Rohan founded Sapiens First because he realized no one was doing anything about the AI Crisis. Previously, Rohan worked as an AI safety researcher at Constellation Institute, was an English teacher in Taiwan, and was a community organizer for animal rights. He likes to "
                }
                <a
                  href="https://www.rohanprasad.org"
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: "underline" } as React.CSSProperties}
                >
                  {"blog"}
                </a>
                {", play guitar, and run barefoot."}
              </p>
              <div className="founder-socials">
                <a
                  className="social-icon"
                  href="https://x.com/rohantohab"
                  target="_blank"
                  rel="noopener"
                  aria-label="X / Twitter"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>
                <a
                  className="social-icon"
                  href="https://www.linkedin.com/in/therohanprasad/"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
