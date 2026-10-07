import { pageMetadata, site } from "@/lib/site";
import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Donate",
  description:
    "Help Sapiens First build political power for AI safety. Fund local chapters, organizer training, and campaigns for a future where AI serves humanity.",
  path: "/donate",
});

/** Tilted sticker-style donate button; hover lifts it, press pushes it into its shadow. */
const donateButton =
  "min-h-12 text-center leading-tight tracking-wide -rotate-2 shadow-[6px_6px_0_var(--color-ink)] hover:shadow-[8px_8px_0_var(--color-ink)] active:shadow-[2px_2px_0_var(--color-ink)] motion-safe:hover:rotate-1 motion-safe:hover:-translate-y-[3px] motion-safe:active:rotate-0";
const rowClass =
  "grid grid-cols-2 gap-x-14 gap-y-12 max-md:grid-cols-1 max-md:gap-y-7 max-sm:gap-7";
const rowHeading =
  "text-4xl leading-none text-balance xl:text-5xl max-md:max-w-sm";
const copyClass =
  "min-w-0 text-xl leading-relaxed max-md:max-w-4xl max-sm:text-xl";
const copyLink =
  "underline underline-offset-4 hover:text-coral-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
const sectionClass = "px-0 py-16 max-sm:px-0 max-sm:py-12";

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
    <>
      <main className={"text-xl"}>
        <section
          className={
            "border-b-2 border-ink px-0 py-16 max-sm:scroll-mt-20 max-sm:py-10"
          }
          aria-labelledby="donate-heading"
        >
          <Container className="grid grid-cols-2 items-center gap-14 max-lg:gap-8 max-sm:grid-cols-1 max-sm:gap-7">
            <div className="min-w-0">
              <h1
                className={
                  "relative z-2 mx-0 my-6 max-w-full font-display text-6xl font-extrabold tracking-tight text-balance uppercase max-sm:max-w-xl max-sm:text-5xl max-sm:tracking-tighter lg:text-7xl xl:text-8xl"
                }
                id="donate-heading"
              >
                Help keep the future{" "}
                <span className="ink-underline whitespace-nowrap ink-underline-brand-yellow">
                  human.
                </span>
              </h1>
              <p
                className={
                  "max-w-lg font-body text-xl leading-normal text-pretty text-ink max-lg:max-w-md max-sm:max-w-none lg:text-2xl xl:text-3xl"
                }
              >
                We bring people together to act on AI. Help us build local
                chapters, train organizers, and win change.
              </p>
            </div>
            <div className="min-w-0">
              <div
                className="mx-auto my-0 w-full max-w-xs rotate-3 max-sm:hidden"
                aria-hidden="true"
              >
                <svg
                  className="block h-auto w-full"
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
                  <circle cx="210" cy="82" r="48" fill="#bcd8ff"></circle>
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
              </div>
              <div
                className={
                  "mt-7 flex flex-wrap justify-center gap-3 max-sm:mt-0 max-sm:gap-2"
                }
              >
                <ActionLink
                  variant="donation"
                  className={cn(
                    donateButton,
                    "min-w-60 motion-safe:active:translate-[4px] motion-reduce:hover:translate-y-0",
                  )}
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
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            sectionClass,
          )}
          aria-labelledby="funding-heading"
        >
          <Container>
            <div className="border-2 border-solid border-ink bg-brand-yellow p-10 shadow-[8px_8px_0_var(--color-ink)] max-sm:px-4 max-sm:py-7">
              <h2
                className="mb-7 font-display text-3xl leading-tight font-extrabold tracking-normal uppercase xl:text-4xl"
                id="funding-heading"
              >
                Support our seed cities.
              </h2>
              <div className={cn(rowClass, "max-w-5xl items-center gap-x-10")}>
                <figure className="mx-auto mt-7 mb-0 w-60 max-sm:w-48">
                  <span
                    className="block aspect-[85.42/143.5] h-auto w-full -rotate-4 [background:radial-gradient(circle,rgba(17,17,17,0.55)_1px,transparent_1.3px)_0_0/6px_6px,rgba(17,17,17,0.1)] [mask:url(/assets/usa-ca.svg)_center/contain_no-repeat]"
                    role="img"
                    aria-label="Map of California, where we're building our seed chapters."
                  ></span>
                </figure>
                <div className={copyClass}>
                  <dl className="mt-6 grid gap-4">
                    {giftTiers.map((tier, index) => (
                      <div
                        className={cn(
                          index > 0 &&
                            "border-t border-solid border-t-ink/25 pt-4",
                        )}
                        key={tier.amount}
                      >
                        <dt className="m-0 font-display text-4xl leading-tight font-extrabold">
                          {tier.amount}
                        </dt>
                        <dd className="mx-0 mt-1 mb-0 text-xl leading-normal">
                          {tier.text}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div
                    className={
                      "mt-7 flex flex-wrap justify-center gap-3 max-sm:gap-2"
                    }
                  >
                    <ActionLink
                      variant="donation"
                      className={cn(
                        donateButton,
                        "min-w-56 motion-safe:active:translate-[3px]",
                      )}
                      href={site.donationUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      Donate →
                    </ActionLink>
                  </div>
                  <p className="mt-4 text-center text-xl leading-normal text-pretty">
                    Give once or monthly.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            sectionClass,
            "bg-paper",
          )}
          aria-labelledby="progress-heading"
        >
          <Container className={rowClass}>
            <h2 className={cn(rowHeading)} id="progress-heading">
              <span className="mb-4 block font-body text-xl leading-snug font-bold tracking-widest text-balance before:mr-2.5 before:inline-block before:h-2 before:w-5 before:-rotate-7 before:bg-coral before:content-['']">
                OUR STORY
              </span>
              Building a Statewide Movement.
            </h2>
            <div
              className={cn(
                copyClass,
                "col-span-full grid grid-cols-3 gap-7 max-md:max-w-none max-sm:grid-cols-1 max-sm:gap-7",
              )}
            >
              {progress.map((item) => (
                <div
                  className={cn("border-t-3 border-solid pt-5", item.border)}
                  key={item.number}
                >
                  <strong className="mb-4 block font-display text-5xl leading-tight font-extrabold whitespace-nowrap max-sm:mb-2.5 max-sm:text-6xl lg:text-6xl xl:text-7xl">
                    {item.number}
                  </strong>
                  <p className="text-xl leading-relaxed text-pretty">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            sectionClass,
            "bg-[#ffe4dc]",
          )}
          aria-labelledby="giving-heading"
        >
          <Container className={rowClass}>
            <h2 className={cn(rowHeading)} id="giving-heading">
              Be a founding patron.
            </h2>
            <div className={copyClass}>
              <p className="text-pretty">
                Founding Patrons are the small circle of donors giving $10,000
                or more who back that first year.
              </p>
              <p className="mt-5 text-pretty">
                We&apos;d be happy to walk through our strategy and budget
                directly.
              </p>
              <p className="mt-5 text-pretty">
                Email{" "}
                <a
                  className={cn(copyLink, "wrap-anywhere")}
                  href="mailto:rohan@sapiensfirst.org"
                >
                  rohan@sapiensfirst.org
                </a>{" "}
                to start a conversation.
              </p>

              <div className="mt-7 border-t border-solid border-t-rule pt-6 text-xl leading-relaxed">
                Sapiens First / Guardrail Project, Inc.
                <br />
                U.S. 501(c)(3) nonprofit · EIN 41-4917212.
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
