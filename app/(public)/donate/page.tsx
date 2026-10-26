import { pageMetadata, site } from "@/lib/site";
import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Donate",
  description:
    "Help Sapiens First build political power for AI safety. Fund local chapters, organizer training, and campaigns for a future where AI serves humanity.",
  path: "/donate",
});

const donateButton =
  "min-h-14 min-w-56 bg-brand-yellow text-base shadow-[3px_3px_0_var(--color-ink)] max-sm:w-full";
const copyLink =
  "underline underline-offset-4 hover:text-coral-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const progress = [
  {
    number: "300–400",
    border: "border-ink",
    text: (
      <>
        People at the{" "}
        <a
          className={copyLink}
          href="https://sfstandard.com/2026/07/11/anti-ai-protest-openai-anthropic-google-san-francisco/"
        >
          San Francisco AI protest
        </a>{" "}
        we co-organized and fiscally sponsored.
      </>
    ),
  },
  {
    number: "50+",
    border: "border-brand-blue",
    text: "In-depth voter interviews to shape our first campaign.",
  },
  {
    number: "8",
    border: "border-coral",
    text: (
      <>
        Volunteer Fellows, with an{" "}
        <Link className={copyLink} href="/learn">
          organizer guide
        </Link>{" "}
        for new chapter leaders.
      </>
    ),
  },
];

const giftTiers = [
  { amount: "$1,000", text: "Funds one chapter event." },
  { amount: "$5,000", text: "Recruits and trains a chapter's founding team." },
  { amount: "$10,000", text: "Powers a chapter's first campaign." },
];

export default function Page() {
  return (
    <main>
      <section
        className="border-b-2 border-ink py-12 sm:py-16"
        aria-labelledby="donate-heading"
      >
        <Container className="grid items-center gap-8 sm:grid-cols-2 sm:gap-12">
          <div>
            <h1
              className="font-display text-5xl leading-none font-extrabold tracking-tight text-balance uppercase sm:text-6xl lg:text-7xl xl:text-8xl"
              id="donate-heading"
            >
              Help keep the future{" "}
              <span className="ink-underline ink-underline-brand-yellow">
                human.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-xl leading-relaxed lg:text-2xl">
              We bring people together to act on AI. Help us build local
              chapters, train organizers, and win change.
            </p>
          </div>
          <div className="text-center">
            <svg
              className="mx-auto hidden h-auto w-full max-w-78 sm:block"
              aria-hidden="true"
              viewBox="0 0 280 270"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M68 70L210 82M68 70L135 206M210 82L135 206"
                strokeDasharray="6 6"
              ></path>
              <circle
                cx="68"
                cy="70"
                r="48"
                fill="var(--color-brand-yellow)"
              ></circle>
              <circle
                cx="210"
                cy="82"
                r="48"
                className="fill-brand-blue-soft"
              ></circle>
              <circle
                cx="135"
                cy="206"
                r="48"
                fill="var(--color-coral)"
              ></circle>
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
                fill="var(--color-paper)"
              ></path>
              <path d="M128 133H154"></path>
            </svg>
            <ActionLink
              variant="donation"
              className={donateButton + " sm:mt-6"}
              href={site.donationUrl}
              target="_blank"
              rel="noopener"
            >
              Donate →
            </ActionLink>
          </div>
        </Container>
      </section>
      <section
        className="border-b-2 border-ink py-10 sm:py-14"
        aria-labelledby="funding-heading"
      >
        <Container className="border-2 border-ink bg-brand-yellow p-6 shadow-[4px_4px_0_var(--color-ink)] sm:p-10">
          <h2
            className="font-display text-3xl leading-tight font-extrabold uppercase sm:text-4xl"
            id="funding-heading"
          >
            Support our seed cities.
          </h2>
          <div className="mt-8 grid items-center gap-8 sm:grid-cols-2 sm:gap-12">
            <span
              className="mx-auto block aspect-[85.42/143.5] w-32 -rotate-4 [background:radial-gradient(circle,rgba(24,37,31,0.55)_1px,transparent_1.3px)_0_0/6px_6px,rgba(24,37,31,0.1)] [mask:url(/assets/usa-ca.svg)_center/contain_no-repeat] sm:w-48"
              role="img"
              aria-label="Map of California, where we're building our seed chapters."
            />
            <div>
              <dl className="divide-y divide-ink/25">
                {giftTiers.map((tier) => (
                  <div className="py-4 first:pt-0" key={tier.amount}>
                    <dt className="font-display text-4xl leading-tight font-extrabold">
                      {tier.amount}
                    </dt>
                    <dd className="mt-1 text-lg leading-relaxed">
                      {tier.text}
                    </dd>
                  </div>
                ))}
              </dl>
              <ActionLink
                variant="donation"
                className={donateButton + " mt-6"}
                href={site.donationUrl}
                target="_blank"
                rel="noopener"
              >
                Donate →
              </ActionLink>
            </div>
          </div>
        </Container>
      </section>
      <section
        className="border-b-2 border-ink py-12 sm:py-16"
        aria-labelledby="progress-heading"
      >
        <Container>
          <p className="mb-3 text-sm font-bold tracking-widest uppercase">
            Our story
          </p>
          <h2
            className="max-w-xl font-display text-4xl leading-none font-extrabold uppercase sm:text-5xl"
            id="progress-heading"
          >
            Building a Statewide Movement.
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {progress.map((item) => (
              <div
                className={"border-t-3 pt-5 " + item.border}
                key={item.number}
              >
                <strong className="block font-display text-5xl leading-none font-extrabold lg:text-6xl">
                  {item.number}
                </strong>
                <p className="mt-4 text-lg leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section
        className="border-b-2 border-ink bg-coral-soft py-12 sm:py-16"
        aria-labelledby="giving-heading"
      >
        <Container className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2
            className="font-display text-4xl leading-none font-extrabold uppercase sm:text-5xl"
            id="giving-heading"
          >
            Be a founding patron.
          </h2>
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              Founding Patrons are the small circle of donors giving $10,000 or
              more who back that first year.
            </p>
            <p>
              We&apos;d be happy to walk through our strategy and budget
              directly.
            </p>
            <p>
              Email{" "}
              <a
                className={copyLink + " wrap-anywhere"}
                href="mailto:rohan@sapiensfirst.org"
              >
                rohan@sapiensfirst.org
              </a>{" "}
              to start a conversation.
            </p>
            <p className="border-t border-ink/25 pt-5 text-base">
              Sapiens First / Guardrail Project, Inc.
              <br />
              U.S. 501(c)(3) nonprofit · EIN 41-4917212.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
