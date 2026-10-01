import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import "../shared-home-charter.css";
import "./page.css";

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
        <section className="charter-hero">
          <div className="container">
            <div className="kicker">{"The Human Charter · V0.1"}</div>
            <h1>{"The Human Charter"}</h1>
            <p className="deck">
              {"Eight Principles for the Future of Humanity."}
            </p>
            <p className="lede">
              {
                "Artificial intelligence holds great promise, but also poses grave threats to our future. As we confront this historic challenge, we offer the Human Charter — eight principles for a brighter future."
              }
            </p>
            <div className="actions">
              <a className="btn primary" href="/join">
                {"Add Your Name →"}
              </a>
              <a className="btn secondary" href="#principles">
                {"Read the Principles ↓"}
              </a>
            </div>
          </div>
        </section>
        <section className="stakes">
          <div className="crisis-statement">
            <div className="label alt-yellow">{"The Stakes"}</div>
            <div className="crisis-line">
              {"A brighter future is not guaranteed. It has to be "}
              <em>{"fought for."}</em>
            </div>
            <div className="stats">
              <div className="stat">
                <strong>{"III"}</strong>
                <span>
                  {
                    "Founding pillars — Life, Liberty, and the pursuit of Happiness"
                  }
                </span>
              </div>
              <div className="stat">
                <strong>{"VIII"}</strong>
                <span>{"Principles for a populist AI movement"}</span>
              </div>
              <div className="stat">
                <strong>{"V0.1"}</strong>
                <span>
                  {"A living charter, open for the movement to shape"}
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="pillar white" id="principles">
          <div className="container pillar-head">
            <div className="label alt-yellow">{"I"}</div>
            <h2>
              {"Protect Humanity "}
              <span className="underline yellow">{"(Life)"}</span>
            </h2>
            <p className="deck">
              {
                "Before anything else, humanity has to survive what it is building."
              }
            </p>
          </div>
          <div className="container">
            <div className="principles principles-2">
              <div className="principle">
                <span className="num">{"01"}</span>
                <h3>{"A Coordinated Slowdown"}</h3>
                <p>
                  {
                    "An international agreement that paces the development of frontier intelligence."
                  }
                </p>
              </div>
              <div className="principle">
                <span className="num">{"02"}</span>
                <h3>{"A Global Initiative for Superalignment"}</h3>
                <p>
                  {
                    "Let the great powers of the world work together to accelerate the alignment of AI to the collective interests of humanity."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="pillar paper">
          <div className="container pillar-head">
            <div className="label alt-blue">{"II"}</div>
            <h2>
              {"Strengthen Democracy "}
              <span className="underline blue">{"(Liberty)"}</span>
            </h2>
            <p className="deck">
              {
                "Power built by superintelligence has to answer to the people it is built on."
              }
            </p>
          </div>
          <div className="container">
            <div className="principles principles-3">
              <div className="principle">
                <span className="num">{"03"}</span>
                <h3>{"A Human-First Government"}</h3>
                <p>
                  {
                    "End corporate capture to put human interests first in our government."
                  }
                </p>
              </div>
              <div className="principle">
                <span className="num">{"04"}</span>
                <h3>{"Renewed Checks and Balances"}</h3>
                <p>
                  {
                    "Transparency and accountability on the concentration of power from superintelligence and autonomous machines."
                  }
                </p>
              </div>
              <div className="principle">
                <span className="num">{"05"}</span>
                <h3>{"Enhance Civic Input"}</h3>
                <p>
                  {
                    "Use information technology to facilitate civic communication and democracy, rather than political polarization."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="pillar white">
          <div className="container pillar-head">
            <div className="label alt-green">{"III"}</div>
            <h2>
              {"Build a Shared Future "}
              <span className="underline green">
                {"(the pursuit of Happiness)"}
              </span>
            </h2>
            <p className="deck">
              {
                "Abundant intelligence should raise everyone up, not just the few who own it."
              }
            </p>
          </div>
          <div className="container">
            <div className="principles principles-3">
              <div className="principle">
                <span className="num">{"06"}</span>
                <h3>{"Institutional Reform"}</h3>
                <p>
                  {
                    "Radical transformation of our institutions to eradicate bureaucracy and enhance the functioning of the public sector."
                  }
                </p>
              </div>
              <div className="principle">
                <span className="num">{"07"}</span>
                <h3>{"The Citizen's Dividend"}</h3>
                <p>
                  {
                    "Distribute the economic power generated by abundant intelligence to the world's people."
                  }
                </p>
              </div>
              <div className="principle">
                <span className="num">{"08"}</span>
                <h3>{"Uplift All Sentient Beings"}</h3>
                <p>
                  {
                    "Unleash the powers of technology to protect — not harm — non-human animals and other sentient beings."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="closing" id="sign">
          <div className="closing-copy">
            <div className="label alt-yellow">{"Sign the Charter"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"Add your name to the "}
              <span className="underline">{"North Star."}</span>
            </h2>
            <p className="deck">
              <strong>
                {"Join the movement fighting for these principles."}
              </strong>
            </p>
            <SignupForm interest="membership" buttonText="Join →" />
          </div>
          <div className="quote">
            <blockquote>
              {
                "\n        We offer these as a North Star — a vision that empowers us to fight for our Rights for the decades ahead.\n      "
              }
            </blockquote>
            <cite>{"The Human Charter, v0.1"}</cite>
          </div>
        </section>
      </main>
    </div>
  );
}
