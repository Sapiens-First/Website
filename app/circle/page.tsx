import CircleHeroArt from "@/components/artwork/CircleHeroArt";
import { FactPill } from "@/components/ui/Label";
import { FaqItem, FaqList } from "@/components/sections/Faq";
import {
  SplitHero,
  ClosingSection,
  ClosingCopy,
  SignupPanel,
} from "@/components/sections/SplitSection";
import { ActionLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Label";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Start a Circle — Sapiens First",
  description:
    "Create a local home for action on Big Tech and democracy. Start a Circle with mentorship, shared leadership, and a three-month commitment.",
  alternates: { canonical: "/circle" },
  openGraph: {
    title: "Start a Circle — Sapiens First",
    description:
      "Create a local home for action on Big Tech and democracy. Start a Circle with mentorship, shared leadership, and a three-month commitment.",
    url: "/circle",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-circle">
      <main className="route-circle">
        <SplitHero>
          <div className="hero-copy">
            <div className="kicker">{"Local people. Shared purpose."}</div>
            <h1>
              {"Start a "}
              <span className="marker">{"Circle."}</span>
            </h1>
            <p>{"Create a home for action on Big Tech and democracy."}</p>
            <div className="fact-pills" aria-label="Time commitment">
              <FactPill>{"3–5 hours a week"}</FactPill>
              <FactPill>{"try for 3 months"}</FactPill>
            </div>
            <SignupForm
              interest="start-a-circle"
              buttonText="I’m interested →"
              id="signup"
            />
            <p className="hero-note">
              {
                "Start with a conversation. Expressing interest doesn’t commit you to running a Circle."
              }
            </p>
          </div>
          <CircleHeroArt />
        </SplitHero>
        <p className="circle-rally">
          <svg className="zap" viewBox="0 0 24 40" aria-hidden="true">
            <path d="M14 1L2 22h8l-4 17 16-24h-9l5-14z"></path>
          </svg>
          <span>
            {"Find your voice, find some friends, and fight like hell."}
          </span>
        </p>
        <section className="about-you" id="why">
          <Container className="you-grid">
            <div>
              <Label tone="yellow">{"What you get"}</Label>
              <h2 className="mt-5">
                {"Find your people."}
                <br />
                <span className="ink-underline yellow">
                  {"Make a difference."}
                </span>
              </h2>
              <p className="deck section-intro mt-6 mr-0 mb-0 ml-0">
                {
                  "A Circle is a small local group with a shared purpose. It’s a place to turn concern about technology into connection, learning, and action."
                }
              </p>
            </div>
            <div className="focus">
              <div className="focus-row">
                <span className="n">{"01"}</span>
                <div>
                  <h3 className="name">{"A voice in the future of tech"}</h3>
                  <p>
                    {
                      "Bring your community’s concerns into a wider movement. Help shape campaigns and build public pressure for technology that serves people."
                    }
                  </p>
                </div>
              </div>
              <div className="focus-row">
                <span className="n">{"02"}</span>
                <div>
                  <h3 className="name">{"Mentorship and guidance"}</h3>
                  <p>
                    {
                      "Get support from the Sapiens First Global team and advice from other people starting Circles. You don’t have to figure it all out alone."
                    }
                  </p>
                </div>
              </div>
              <div className="focus-row">
                <span className="n">{"03"}</span>
                <div>
                  <h3 className="name">
                    {"Leadership skills, built by doing"}
                  </h3>
                  <p>
                    {
                      "Learn to bring people together, facilitate a good conversation, and turn an idea into a plan. Help others take on responsibility as you go."
                    }
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <section className="getting-started bg-white" id="getting-started">
          <Container>
            <Label tone="blue">{"Getting started"}</Label>
            <h2 className="mt-5">
              {"Start small."}
              <br />
              <span className="ink-underline blue">{"Build together."}</span>
            </h2>
            <ol className="steps grid grid-cols-3 gap-8 list-none p-0 mt-11 mr-0 mb-0 ml-0 max-sm:grid-cols-1 max-sm:gap-7">
              <li className="step">
                <span
                  className="step-number font-display text-5xl font-extrabold leading-none"
                  aria-hidden="true"
                >
                  {"01"}
                </span>
                <h3>{"Join Sapiens First"}</h3>
                <p>
                  <a href="#signup">{"Tell us you’re interested"}</a>
                  {
                    " in starting a Circle. We’ll help you take the next step toward membership and connect you with support from the Global team."
                  }
                </p>
              </li>
              <li className="step">
                <span
                  className="step-number font-display text-5xl font-extrabold leading-none"
                  aria-hidden="true"
                >
                  {"02"}
                </span>
                <h3>{"Invite two friends"}</h3>
                <p>
                  {
                    "Start with people who care about the issue and can share the work. Two friends is a good starting point, not a requirement. You can find your people along the way."
                  }
                </p>
              </li>
              <li className="step">
                <span
                  className="step-number font-display text-5xl font-extrabold leading-none"
                  aria-hidden="true"
                >
                  {"03"}
                </span>
                <h3>{"Plan your first gathering"}</h3>
                <p>
                  {
                    "Pick a time and a welcoming place: a library, park, classroom, or someone’s home. Make space to connect, then choose one thing you’d like to do together."
                  }
                </p>
              </li>
            </ol>
          </Container>
        </section>
        <section className="shared-leadership bg-ink" id="shared-leadership">
          <Container className="you-grid">
            <div>
              <Label tone="yellow">{"Room for everyone to lead"}</Label>
              <h2 className="mt-5">
                {"Start a Circle."}
                <br />
                {"Grow more leaders."}
              </h2>
              <p className="deck">
                {
                  "We’re building a movement with abundant leadership. Starting a Circle means helping others find their confidence, bring their ideas, and take the lead alongside you."
                }
              </p>
            </div>
            <ul className="role-list">
              <li>
                <strong>{"Help someone take their first step"}</strong>
                <span>
                  {
                    "Invite a member to host a gathering, welcome someone new, or try an idea they care about. Give them encouragement and room to make it their own."
                  }
                </span>
              </li>
              <li>
                <strong>{"Build it together"}</strong>
                <span>
                  {
                    "Share the work as people find their feet. A Circle gets stronger when more people feel able to contribute and lead."
                  }
                </span>
              </li>
              <li>
                <strong>{"Pass it on"}</strong>
                <span>
                  {
                    "You can get a Circle going, help someone else grow into leading it, then hand it over. The community you helped build can keep going when you step back."
                  }
                </span>
              </li>
            </ul>
          </Container>
        </section>
        <section className="faq" id="faq">
          <Container>
            <Label tone="purple">{"FAQ"}</Label>
            <h2 className="mt-5">
              {"Before you "}
              <span className="ink-underline yellow">{"begin."}</span>
            </h2>
            <FaqList>
              <FaqItem
                number={1}
                question={<>{"How much time am I committing?"}</>}
                open
              >
                <p>
                  {"Starting a Circle takes about "}
                  <strong>{"3–5 hours a week"}</strong>
                  {", with an initial commitment of "}
                  <strong>{"three months"}</strong>
                  {
                    ". After that, you decide whether to continue every six months."
                  }
                </p>
                <p>
                  {
                    "Keep the first few months manageable: bring people together, share the work, and find a rhythm that fits your life."
                  }
                </p>
              </FaqItem>
              <FaqItem
                number={2}
                question={<>{"Do I need experience or a group already?"}</>}
              >
                <p>
                  {
                    "No. You can learn as you go, with mentorship and guidance from Sapiens First Global and other Circle organizers. Bringing two reliable friends is recommended, but you can start without them."
                  }
                </p>
              </FaqItem>
              <FaqItem
                number={3}
                question={
                  <>{"Does my Circle have to organize protests or advocacy?"}</>
                }
              >
                <p>
                  {
                    "No. You can host a space for thoughtful conversation about technology and democracy. Building trust and connection is a worthwhile place to begin."
                  }
                </p>
                <p>
                  {
                    "Choose a format that fits your community. You can explore advocacy together when it feels right."
                  }
                </p>
              </FaqItem>
              <FaqItem
                number={4}
                question={<>{"What might a Circle do week to week?"}</>}
              >
                <p>
                  {
                    "For a Circle focused on advocacy, we suggest three simple habits:"
                  }
                </p>
                <ul>
                  <li>
                    <strong>{"Meet regularly."}</strong>
                    {
                      " Make gatherings welcoming, meaningful, and easy to participate in."
                    }
                  </li>
                  <li>
                    <strong>{"Invite new people."}</strong>
                    {
                      " Choose one repeatable way to reach them, such as personal invitations, local outreach, or door-knocking."
                    }
                  </li>
                  <li>
                    <strong>{"Work toward a shared goal."}</strong>
                    {
                      " You might invite people to sign a campaign’s open letter, then join your next meeting."
                    }
                  </li>
                </ul>
                <p>
                  {
                    "Start with what your group can sustain. You can add activities as more people take on roles."
                  }
                </p>
              </FaqItem>
              <FaqItem
                number={5}
                question={<>{"Can we propose our own campaign?"}</>}
              >
                <p>
                  {"Yes. You can join a "}
                  <Link href="/campaigns">{"priority campaign"}</Link>
                  {" or propose a different campaign that falls within "}
                  <Link href="/about">{"Sapiens First’s focus areas"}</Link>
                  {
                    ". Bring your idea to the Global team so you can explore how it fits and what support would help."
                  }
                </p>
              </FaqItem>
              <FaqItem
                number={6}
                question={<>{"Can I start a Circle and hand it over later?"}</>}
              >
                <p>
                  {
                    "Yes. You can start a Circle, help others gain confidence, and hand it over when someone is ready to take the lead. You might stay involved as a member or step back."
                  }
                </p>
                <p>
                  {
                    "Share opportunities to lead from the beginning. When you’re ready to move on, talk with your Circle and the Global team about a handover. Helping someone else become a leader is a lasting contribution to the movement."
                  }
                </p>
              </FaqItem>
              <FaqItem
                number={7}
                question={<>{"Can a Circle grow into something bigger?"}</>}
              >
                <p>
                  {
                    "Yes. As membership grows, a Circle can develop into a Hub, Chapter, or Alliance:"
                  }
                </p>
                <ul>
                  <li>
                    <strong>{"Circle:"}</strong>
                    {" up to 10 members"}
                  </li>
                  <li>
                    <strong>{"Hub:"}</strong>
                    {" up to 50 members"}
                  </li>
                  <li>
                    <strong>{"Chapter:"}</strong>
                    {" up to 150 members"}
                  </li>
                  <li>
                    <strong>{"Alliance:"}</strong>
                    {" up to 500 members"}
                  </li>
                </ul>
                <p>
                  {
                    "As more people grow into leadership, your group can take on more together. Staying small is fine, too: growth should serve your community and the work you want to do together."
                  }
                </p>
              </FaqItem>
            </FaqList>
          </Container>
        </section>
        <ClosingSection id="apply">
          <ClosingCopy>
            <Label tone="purple">{"Start"}</Label>
            <h2 className="mt-5">
              {"Make room for "}
              <span className="marker">{"your people."}</span>
            </h2>
            <p className="deck">
              {
                "You don’t need a full team or a perfect plan. Bring your interest, and we’ll help you take the first step."
              }
            </p>
            <ActionLink variant="primary" href="#signup">
              {"Express interest →"}
            </ActionLink>
            <p className="apply-note">
              {"Questions? "}
              <a href="mailto:rohan@sapiensfirst.org">{"Email Rohan"}</a>
              {"."}
            </p>
          </ClosingCopy>
          <SignupPanel>
            <div className="fun-layer" aria-hidden="true">
              <i
                style={
                  {
                    left: "8%",
                    top: "10%",
                    transform: "rotate(-6deg)",
                    color: "#fff",
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
                    left: "20%",
                    top: "20%",
                    transform: "rotate(6deg) scale(.65)",
                    color: "#fff",
                  } as React.CSSProperties
                }
              >
                <svg className="bird" viewBox="0 0 24 12">
                  <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
                </svg>
              </i>
            </div>
            <Label tone="coral">{"Start a Circle"}</Label>
            <div className="apply-deadline">
              {"Small start."}
              <br />
              {"Shared purpose."}
            </div>
            <p>
              {
                "Leave your email and we'll be in touch about starting a Circle in your community."
              }
            </p>
            <SignupForm
              interest="start-a-circle"
              buttonText="I’m interested →"
            />
          </SignupPanel>
        </ClosingSection>
      </main>
    </div>
  );
}
