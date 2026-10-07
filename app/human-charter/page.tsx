import { Label } from "@/components/ui/Label";
import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "The Human Charter — Sapiens First",
  description:
    "The Human Charter — eight principles for a brighter future, organized around Life, Liberty, and the pursuit of Happiness in the age of AI.",
  alternates: { canonical: "/human-charter" },
  openGraph: {
    title: "The Human Charter — Sapiens First",
    description:
      "The Human Charter — eight principles for a brighter future, organized around Life, Liberty, and the pursuit of Happiness in the age of AI.",
    url: "/human-charter",
    type: "website",
  },
};

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
            <div className="principles principles-2 mt-14 grid border-t-2 border-solid border-t-ink">
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">01</span>
                <h3>A Coordinated Slowdown</h3>
                <p>
                  An international agreement that paces the development of
                  frontier intelligence.
                </p>
              </div>
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">02</span>
                <h3>A Global Initiative for Superalignment</h3>
                <p>
                  Let the great powers of the world work together to accelerate
                  the alignment of AI to the collective interests of humanity.
                </p>
              </div>
            </div>
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
            <div className="principles principles-3 mt-14 grid border-t-2 border-solid border-t-ink">
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">03</span>
                <h3>A Human-First Government</h3>
                <p>
                  End corporate capture to put human interests first in our
                  government.
                </p>
              </div>
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">04</span>
                <h3>Renewed Checks and Balances</h3>
                <p>
                  Transparency and accountability on the concentration of power
                  from superintelligence and autonomous machines.
                </p>
              </div>
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">05</span>
                <h3>Enhance Civic Input</h3>
                <p>
                  Use information technology to facilitate civic communication
                  and democracy, rather than political polarization.
                </p>
              </div>
            </div>
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
            <div className="principles principles-3 mt-14 grid border-t-2 border-solid border-t-ink">
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">06</span>
                <h3>Institutional Reform</h3>
                <p>
                  Radical transformation of our institutions to eradicate
                  bureaucracy and enhance the functioning of the public sector.
                </p>
              </div>
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">07</span>
                <h3>The Citizen&apos;s Dividend</h3>
                <p>
                  Distribute the economic power generated by abundant
                  intelligence to the world&apos;s people.
                </p>
              </div>
              <div className="principle flex min-h-72 flex-col px-7 py-8">
                <span className="num">08</span>
                <h3>Uplift All Sentient Beings</h3>
                <p>
                  Unleash the powers of technology to protect — not harm —
                  non-human animals and other sentient beings.
                </p>
              </div>
            </div>
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
