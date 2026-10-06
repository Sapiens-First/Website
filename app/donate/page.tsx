import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import Link from "next/link";

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
          <Container>
            <div className="intro-copy">
              <h1 id="donate-heading">
                {"Help keep the future "}
                <span className="ink-underline yellow">{"human."}</span>
              </h1>
              <p className="deck">
                {
                  "We bring people together to act on AI. Help us build local chapters, train organizers, and win change."
                }
              </p>
            </div>
            <div className="intro-giving">
              <div className="intro-sketch my-0 mx-auto" aria-hidden="true">
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
                <ActionLink
                  variant="donation"
                  id="donate-cta"
                  href="https://www.zeffy.com/en-US/donation-form/support-sapiens-first"
                  target="_blank"
                  rel="noopener"
                >
                  {"Donate →"}
                </ActionLink>
              </div>
            </div>
          </Container>
        </section>
        <section
          className="donate-section donate-seeds py-16 px-0 max-sm:py-12 max-sm:px-0"
          aria-labelledby="funding-heading"
        >
          <Container>
            <div className="story-next">
              <h2 id="funding-heading">{"Support our seed cities."}</h2>
              <div className="donate-row grid gap-y-12 max-md:grid-cols-1 max-md:gap-y-7 max-sm:gap-7">
                <figure className="chapter-target mt-7 mr-auto mb-0 ml-auto w-60 max-sm:w-48">
                  <span
                    className="ca-map"
                    role="img"
                    aria-label="Map of California, where we're building our seed chapters."
                  ></span>
                </figure>
                <div className="donate-copy text-xl leading-relaxed min-w-0 max-sm:text-xl">
                  <dl className="gift-tiers grid gap-4 mt-6">
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
                  <div className="actions donate-cta-row justify-center mt-7">
                    <ActionLink
                      variant="donation"
                      id="donate-cta-2"
                      href="https://www.zeffy.com/en-US/donation-form/support-sapiens-first"
                      target="_blank"
                      rel="noopener"
                    >
                      {"Donate →"}
                    </ActionLink>
                  </div>
                  <p className="checkout-note text-xl leading-normal">
                    {"Give once or monthly."}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <section
          className="donate-section donate-story py-16 px-0 max-sm:py-12 max-sm:px-0 bg-paper"
          aria-labelledby="progress-heading"
        >
          <Container className="donate-row grid gap-y-12 max-md:grid-cols-1 max-md:gap-y-7 max-sm:gap-7">
            <h2 id="progress-heading">
              <span className="section-index mb-4 tracking-widest">
                {"OUR STORY"}
              </span>
              {"Building a Statewide Movement."}
            </h2>
            <div className="progress-grid donate-wide donate-copy grid grid-cols-3 gap-7 max-md:max-w-none max-sm:grid-cols-1 max-sm:gap-7 text-xl leading-relaxed min-w-0 max-sm:text-xl">
              <div className="progress-item pt-5">
                <strong className="progress-number block whitespace-nowrap mb-4 max-sm:text-6xl max-sm:mb-2.5">
                  {"300–400"}
                </strong>
                <p>
                  {"People at the "}
                  <a href="https://sfstandard.com/2026/07/11/anti-ai-protest-openai-anthropic-google-san-francisco/">
                    {"San Francisco AI protest"}
                  </a>
                  {" we co-organized and fiscally sponsored."}
                </p>
              </div>
              <div className="progress-item pt-5">
                <strong className="progress-number block whitespace-nowrap mb-4 max-sm:text-6xl max-sm:mb-2.5">
                  {"50+"}
                </strong>
                <p>
                  {"In-depth voter interviews to shape our first campaign."}
                </p>
              </div>
              <div className="progress-item pt-5">
                <strong className="progress-number block whitespace-nowrap mb-4 max-sm:text-6xl max-sm:mb-2.5">
                  {"8"}
                </strong>
                <p>
                  {"Volunteer Fellows, with an "}
                  <Link href="/learn">{"organizer guide"}</Link>
                  {" for new chapter leaders."}
                </p>
              </div>
            </div>
          </Container>
        </section>
        <section
          className="donate-section donate-giving py-16 px-0 max-sm:py-12 max-sm:px-0"
          aria-labelledby="giving-heading"
        >
          <Container className="donate-row grid gap-y-12 max-md:grid-cols-1 max-md:gap-y-7 max-sm:gap-7">
            <h2 id="giving-heading">{"Be a founding patron."}</h2>
            <div className="donate-copy text-xl leading-relaxed min-w-0 max-sm:text-xl">
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

              <div className="donate-legal mt-7 pt-6 border-t border-solid border-t-rule text-xl leading-relaxed">
                {"Sapiens First / Guardrail Project, Inc."}
                <br />
                {"U.S. 501(c)(3) nonprofit · EIN 41-4917212."}
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
