import { pageMetadata } from "@/lib/site";
import { Label } from "@/components/ui/Label";
import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import SignupForm from "@/components/SignupForm";
import { charterPrinciples } from "@/content/charter";

export const metadata = pageMetadata({
  title: "The Human Charter",
  description:
    "The Human Charter — eight principles for a brighter future, organized around Life, Liberty, and the pursuit of Happiness in the age of AI.",
  path: "/human-charter",
});

export default function Page() {
  return (
    <div className="route-root route-human-charter">
      <main className="route-human-charter">
        <section className="charter-hero bg-paper text-center max-sm:pt-14 max-sm:pr-0 max-sm:pb-12 max-sm:pl-0">
          <Container>
            <div className="kicker">The Human Charter · V0.1</div>
            <h1>The Human Charter</h1>
            <p className="deck">Eight Principles for the Future of Humanity.</p>
            <p className="lede">
              Artificial intelligence holds great promise, but also poses grave
              threats to our future. As we confront this historic challenge, we
              offer the Human Charter — eight principles for a brighter future.
            </p>
            <div className="actions">
              <ActionLink variant="primary" href="/join">
                Add Your Name →
              </ActionLink>
              <ActionLink
                className="secondary"
                variant="outline"
                href="#principles"
              >
                Read the Principles ↓
              </ActionLink>
            </div>
          </Container>
        </section>
        <section className="stakes bg-ink">
          <div className="crisis-statement">
            <Label tone="yellow">The Stakes</Label>
            <div className="crisis-line">
              A brighter future is not guaranteed. It has to be{" "}
              <em>fought for.</em>
            </div>
            <div className="stats">
              <div className="stat">
                <strong>III</strong>
                <span>
                  Founding pillars — Life, Liberty, and the pursuit of Happiness
                </span>
              </div>
              <div className="stat">
                <strong>VIII</strong>
                <span>Principles for a populist AI movement</span>
              </div>
              <div className="stat">
                <strong>V0.1</strong>
                <span>A living charter, open for the movement to shape</span>
              </div>
            </div>
          </div>
        </section>
        <section className="pillar white" id="principles">
          <Container className="pillar-head">
            <Label tone="yellow">I</Label>
            <h2>
              Protect Humanity{" "}
              <span className="ink-underline yellow">(Life)</span>
            </h2>
            <p className="deck">
              Before anything else, humanity has to survive what it is building.
            </p>
          </Container>
          <Container>
            <Principles pillar={0} />
          </Container>
        </section>
        <section className="pillar paper">
          <Container className="pillar-head">
            <Label tone="blue">II</Label>
            <h2>
              Strengthen Democracy{" "}
              <span className="ink-underline blue">(Liberty)</span>
            </h2>
            <p className="deck">
              Power built by superintelligence has to answer to the people it is
              built on.
            </p>
          </Container>
          <Container>
            <Principles pillar={1} />
          </Container>
        </section>
        <section className="pillar white">
          <Container className="pillar-head">
            <Label tone="purple">III</Label>
            <h2>
              Build a Shared Future{" "}
              <span className="ink-underline green">
                (the pursuit of Happiness)
              </span>
            </h2>
            <p className="deck">
              Abundant intelligence should raise everyone up, not just the few
              who own it.
            </p>
          </Container>
          <Container>
            <Principles pillar={2} />
          </Container>
        </section>
        <section
          className="closing grid grid-cols-2 bg-paper max-lg:grid-cols-1"
          id="sign"
        >
          <div className="closing-copy relative">
            <Label tone="yellow">Sign the Charter</Label>
            <h2 className="mt-5">
              Add your name to the{" "}
              <span className="ink-underline">North Star.</span>
            </h2>
            <p className="deck">
              <strong>Join the movement fighting for these principles.</strong>
            </p>
            <SignupForm interest="membership" buttonText="Join →" />
          </div>
          <div className="quote">
            <blockquote>
              We offer these as a North Star — a vision that empowers us to
              fight for our Rights for the decades ahead.
            </blockquote>
            <cite>The Human Charter, v0.1</cite>
          </div>
        </section>
      </main>
    </div>
  );
}

function Principles({ pillar }: { pillar: number }) {
  const start = charterPrinciples
    .slice(0, pillar)
    .reduce((count, group) => count + group.length, 0);
  const principles = charterPrinciples[pillar];
  return (
    <div
      className={`principles principles-${principles.length} mt-14 grid border-t-2 border-solid border-t-ink`}
    >
      {principles.map((principle, index) => (
        <div
          className="principle flex min-h-72 flex-col px-7 py-8"
          key={principle.title}
        >
          <span className="num">
            {String(start + index + 1).padStart(2, "0")}
          </span>
          <h3>{principle.title}</h3>
          <p>{principle.text}</p>
        </div>
      ))}
    </div>
  );
}
