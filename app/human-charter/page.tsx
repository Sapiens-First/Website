import { pageMetadata } from "@/lib/site";
import { Label } from "@/components/ui/Text";
import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import SignupForm from "@/components/SignupForm";
import { charterPrinciples } from "@/content/charter";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "The Human Charter",
  description:
    "The Human Charter — eight principles for a brighter future, organized around Life, Liberty, and the pursuit of Happiness in the age of AI.",
  path: "/human-charter",
});

const stats = [
  {
    value: "III",
    text: "Founding pillars — Life, Liberty, and the pursuit of Happiness",
    className: "bg-coral text-ink",
  },
  {
    value: "VIII",
    text: "Principles for a populist AI movement",
    className: "bg-brand-blue text-ink",
  },
  {
    value: "V0.1",
    text: "A living charter, open for the movement to shape",
    className: "bg-brand-purple text-white",
  },
];

const pillars = [
  {
    numeral: "I",
    tone: "yellow",
    title: "Protect Humanity",
    underline: (
      <span className="ink-underline ink-underline-brand-yellow">(Life)</span>
    ),
    deck: "Before anything else, humanity has to survive what it is building.",
  },
  {
    numeral: "II",
    tone: "blue",
    title: "Strengthen Democracy",
    underline: (
      <span className="ink-underline ink-underline-brand-blue">(Liberty)</span>
    ),
    deck: "Power built by superintelligence has to answer to the people it is built on.",
  },
  {
    numeral: "III",
    tone: "purple",
    title: "Build a Shared Future",
    underline: (
      <span className="ink-underline ink-underline-brand-purple">
        (the pursuit of Happiness)
      </span>
    ),
    deck: "Abundant intelligence should raise everyone up, not just the few who own it.",
  },
] as const;

export default function Page() {
  return (
    <>
      <main>
        <section
          className={
            "border-b-2 border-ink bg-paper px-7 py-20 text-center max-sm:scroll-mt-20 max-sm:pt-14 max-sm:pr-0 max-sm:pb-12 max-sm:pl-0 sm:px-12 lg:px-20 lg:py-24"
          }
        >
          <Container>
            <div
              className={
                "mx-auto mt-0 mb-6 inline-block w-max bg-ink px-2.5 py-2 font-body text-xs font-black tracking-widest text-white uppercase"
              }
            >
              The Human Charter · V0.1
            </div>
            <h1
              className={
                "relative z-2 mx-auto my-0 max-w-xl text-center font-display text-6xl leading-none font-extrabold tracking-tight uppercase max-sm:max-w-xs max-sm:text-5xl max-sm:tracking-tighter lg:text-8xl xl:text-9xl"
              }
            >
              The Human Charter
            </h1>
            <p
              className={
                "mx-auto mt-7 mb-0 max-w-md font-body text-xl leading-snug font-bold text-ink lg:text-2xl xl:text-3xl"
              }
            >
              Eight Principles for the Future of Humanity.
            </p>
            <p className="mx-auto mt-5 mb-0 max-w-3xl text-lg leading-normal text-ink">
              Artificial intelligence holds great promise, but also poses grave
              threats to our future. As we confront this historic challenge, we
              offer the Human Charter — eight principles for a brighter future.
            </p>
            <div
              className={
                "mt-9 flex flex-wrap justify-center gap-3 max-sm:gap-2"
              }
            >
              <ActionLink
                className="tracking-wide"
                variant="primary"
                href="/join"
              >
                Add Your Name →
              </ActionLink>
              <ActionLink
                className="tracking-wide"
                variant="outline"
                href="#principles"
              >
                Read the Principles ↓
              </ActionLink>
            </div>
          </Container>
        </section>
        <section className={"border-b-2 border-ink bg-ink max-sm:scroll-mt-20"}>
          <div className="px-7 py-20 font-display text-4xl leading-none tracking-tight text-white sm:px-12 lg:px-20 lg:py-24 xl:text-5xl">
            <Label className="mb-7 w-max" tone="yellow">
              The Stakes
            </Label>
            <div className="max-w-sm font-extrabold uppercase">
              A brighter future is not guaranteed. It has to be{" "}
              <em className="text-coral not-italic">fought for.</em>
            </div>
            <div className="-mx-7 mt-16 -mb-20 grid grid-cols-3 border-t-2 border-solid border-t-white/35 max-lg:grid-cols-1 sm:-mx-12 lg:-mx-20 lg:-mb-24">
              {stats.map((stat, index) => (
                <div
                  key={stat.value}
                  className={cn(
                    "relative flex min-h-48 flex-col justify-start gap-4 border-solid border-ink px-7 py-8 font-body",
                    index < stats.length - 1 &&
                      "border-r-2 max-lg:border-r-0 max-lg:border-b-2",
                    stat.className,
                  )}
                >
                  <strong className="font-display text-4xl leading-none font-extrabold tracking-tight lg:text-5xl xl:text-6xl">
                    {stat.value}
                  </strong>
                  <span className="max-w-xl text-base leading-snug font-bold">
                    {stat.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        {pillars.map((pillar, index) => (
          <section
            key={pillar.numeral}
            className={cn(
              "border-b-2 border-ink max-sm:scroll-mt-20",
              "px-0 py-20 lg:py-24",
              index % 2 ? "bg-paper" : "bg-white",
            )}
            id={index === 0 ? "principles" : undefined}
          >
            <Container>
              <Label tone={pillar.tone}>{pillar.numeral}</Label>
              <h2
                className={
                  "mt-4 font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                }
              >
                {pillar.title} {pillar.underline}
              </h2>
              <p
                className={
                  "mx-0 mt-6 mb-0 max-w-xl font-body text-xl leading-snug font-semibold text-ink lg:text-2xl xl:text-3xl"
                }
              >
                {pillar.deck}
              </p>
            </Container>
            <Container>
              <Principles pillar={index} />
            </Container>
          </section>
        ))}
        <section
          className={
            "grid grid-cols-2 border-b-2 border-ink bg-paper max-lg:grid-cols-1 max-sm:scroll-mt-20"
          }
          id="sign"
        >
          <div className="relative px-7 py-20 sm:px-12 lg:px-20 lg:py-24">
            <Label tone="yellow">Sign the Charter</Label>
            <h2
              className={
                "mt-5 font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
              }
            >
              Add your name to the{" "}
              <span className="ink-underline">North Star.</span>
            </h2>
            <p
              className={
                "mx-0 mt-6 mb-7 max-w-sm font-body text-xl leading-snug text-ink lg:text-2xl xl:text-3xl"
              }
            >
              <strong>Join the movement fighting for these principles.</strong>
            </p>
            <SignupForm
              interest="membership"
              buttonText="Join →"
              buttonClassName="tracking-wide"
            />
          </div>
          <div className="relative flex min-h-112 flex-col justify-end overflow-hidden border-l-2 border-solid border-l-ink bg-ink px-14 py-16 text-white before:absolute before:-top-24 before:left-6 before:font-quote before:text-9xl before:leading-none before:text-coral before:content-['\201C'] max-lg:border-t-2 max-lg:border-l-0 max-lg:border-t-ink">
            <blockquote className="relative z-2 m-0 font-quote text-3xl leading-none xl:text-4xl">
              We offer these as a North Star — a vision that empowers us to
              fight for our Rights for the decades ahead.
            </blockquote>
            <cite className="relative z-2 mt-5 block font-body text-sm font-bold tracking-wider text-brand-yellow uppercase not-italic">
              The Human Charter, v0.1
            </cite>
          </div>
        </section>
      </main>
    </>
  );
}

function Principles({ pillar }: { pillar: number }) {
  const start = charterPrinciples
    .slice(0, pillar)
    .reduce((count, group) => count + group.length, 0);
  const principles = charterPrinciples[pillar];
  return (
    <div
      className={cn(
        "mt-14 grid border-t-2 border-solid border-t-ink max-lg:grid-cols-1",
        principles.length === 2 ? "grid-cols-2" : "grid-cols-3",
      )}
    >
      {principles.map((principle, index) => (
        <div
          className={cn(
            "flex min-h-72 flex-col border-solid border-ink px-7 py-8",
            index < principles.length - 1 &&
              "border-r-2 max-lg:border-r-0 max-lg:border-b-2",
            index % 2 === 0 && (pillar % 2 ? "bg-white" : "bg-paper"),
          )}
          key={principle.title}
        >
          <span className="mb-6 font-display text-4xl leading-none font-extrabold tracking-tight text-coral-dark xl:text-5xl">
            {String(start + index + 1).padStart(2, "0")}
          </span>
          <h3 className="mx-0 mt-0 mb-3 font-display text-2xl leading-none font-extrabold tracking-tight uppercase xl:text-3xl">
            {principle.title}
          </h3>
          <p className="m-0 max-w-md text-base leading-normal text-ink">
            {principle.text}
          </p>
        </div>
      ))}
    </div>
  );
}
