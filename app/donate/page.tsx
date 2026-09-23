import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Donate — Sapiens First",
  description:
    "Help Sapiens First build political power for AI safety. Fund local chapters, organizer training, and campaigns for a future where AI serves humanity.",
  alternates: { canonical: "/donate" },
  openGraph: {
    title: "Donate — Sapiens First",
    description:
      "Help Sapiens First build political power for AI safety. Fund local chapters, organizer training, and campaigns for a future where AI serves humanity.",
    url: "/donate",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-donate">
      <main className="route-donate">
        <section className="donate-intro" aria-labelledby="donate-heading">
          <div className="container">
            <div className="intro-copy">
              <h1 id="donate-heading">
                {"Help keep the future "}
                <span className="underline yellow">{"human."}</span>
              </h1>
              <p className="deck">
                {
                  "We bring people together to act on AI. Help us build local chapters, train organizers, and win change."
                }
              </p>
            </div>
            <div className="intro-giving">
              <div className="intro-sketch" aria-hidden="true">
                <svg
                  viewBox="0 0 280 270"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M68 70L210 82M68 70L135 206M210 82L135 206"
                    strokeDasharray="6 6"
                  ></path>
                  <circle cx="68" cy="70" r="48" fill="var(--yellow)"></circle>
                  <circle cx="210" cy="82" r="48" fill="#bcd8ff"></circle>
                  <circle cx="135" cy="206" r="48" fill="var(--red)"></circle>
                  <g strokeLinecap="round">
                    <circle cx="68" cy="58" r="10"></circle>
                    <path d="M47 88C47 65 89 65 89 88"></path>
                    <circle cx="210" cy="70" r="10"></circle>
                    <path d="M189 100C189 77 231 77 231 100"></path>
                    <circle cx="135" cy="194" r="10"></circle>
                    <path d="M114 224C114 201 156 201 156 224"></path>
                  </g>
                  <path
                    d="M118 119L164 119L164 148L146 148L139 157L132 148L118 148Z"
                    fill="var(--paper)"
                  ></path>
                  <path d="M128 133H154"></path>
                </svg>
              </div>
              <div className="actions">
                <a
                  className="btn primary"
                  id="donate-cta"
                  href="https://www.zeffy.com/en-US/donation-form/support-sapiens-first"
                  target="_blank"
                  rel="noopener"
                >
                  {"Donate →"}
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          className="donate-section donate-seeds"
          aria-labelledby="funding-heading"
        >
          <div className="container">
            <div className="story-next">
              <h2 id="funding-heading">{"Support our seed cities."}</h2>
              <div className="donate-row">
                <figure className="chapter-target">
                  <span
                    className="ca-map"
                    role="img"
                    aria-label="Map of California, where we're building our seed chapters."
                  ></span>
                </figure>
                <div className="donate-copy">
                  <dl className="gift-tiers">
                    <div className="gift-tier">
                      <dt>{"$1,000"}</dt>
                      <dd>{"Funds one chapter event."}</dd>
                    </div>
                    <div className="gift-tier">
                      <dt>{"$5,000"}</dt>
                      <dd>
                        {"Recruits and trains a chapter's founding team."}
                      </dd>
                    </div>
                    <div className="gift-tier">
                      <dt>{"$10,000"}</dt>
                      <dd>{"Powers a chapter's first campaign."}</dd>
                    </div>
                  </dl>
                  <div className="actions donate-cta-row">
                    <a
                      className="btn primary"
                      id="donate-cta-2"
                      href="https://www.zeffy.com/en-US/donation-form/support-sapiens-first"
                      target="_blank"
                      rel="noopener"
                    >
                      {"Donate →"}
                    </a>
                  </div>
                  <p className="checkout-note">{"Give once or monthly."}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="donate-section donate-story"
          aria-labelledby="progress-heading"
        >
          <div className="container donate-row">
            <h2 id="progress-heading">
              <span className="section-index">{"OUR STORY"}</span>
              {"Building a Statewide Movement."}
            </h2>
            <div className="progress-grid donate-wide donate-copy">
              <div className="progress-item">
                <strong className="progress-number">{"300–400"}</strong>
                <p>
                  {"People at the "}
                  <a href="https://sfstandard.com/2026/07/11/anti-ai-protest-openai-anthropic-google-san-francisco/">
                    {"San Francisco AI protest"}
                  </a>
                  {" we co-organized and fiscally sponsored."}
                </p>
              </div>
              <div className="progress-item">
                <strong className="progress-number">{"50+"}</strong>
                <p>
                  {"In-depth voter interviews to shape our first campaign."}
                </p>
              </div>
              <div className="progress-item">
                <strong className="progress-number">{"8"}</strong>
                <p>
                  {"Volunteer Fellows, with an "}
                  <a href="/learn">{"organizer guide"}</a>
                  {" for new chapter leaders."}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="donate-section donate-giving"
          aria-labelledby="giving-heading"
        >
          <div className="container donate-row">
            <h2 id="giving-heading">{"Be a founding patron."}</h2>
            <div className="donate-copy">
              <p>
                {
                  "Founding Patrons are the small circle of donors giving $10,000 or more who back that first year."
                }
              </p>
              <p>
                {
                  "We'd be happy to walk through our strategy and budget directly."
                }
              </p>
              <p>
                {"Email "}
                <a href="mailto:rohan@sapiensfirst.org">
                  {"rohan@sapiensfirst.org"}
                </a>
                {" to start a conversation."}
              </p>

              <div className="donate-legal">
                {"Sapiens First / Guardrail Project, Inc."}
                <br />
                {"U.S. 501(c)(3) nonprofit · EIN 41-4917212."}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
