import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import "../shared-about-circle-fellowship.css";
import "./page.css";

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
        <section className="hero">
          <div className="hero-copy">
            <div className="kicker">{"Local people. Shared purpose."}</div>
            <h1>
              {"Start a "}
              <span className="marker">{"Circle."}</span>
            </h1>
            <p>{"Create a home for action on Big Tech and democracy."}</p>
            <div className="fact-pills" aria-label="Time commitment">
              <span className="fact-pill">{"3–5 hours a week"}</span>
              <span className="fact-pill">{"try for 3 months"}</span>
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
          <div className="hero-art circle-hero-art" aria-hidden="true">
            <svg
              className="circle-gathering"
              viewBox="0 0 600 640"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
            >
              <circle
                cx="300"
                cy="332"
                r="239"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeDasharray="3 11"
                opacity=".35"
              ></circle>
              <path
                d="M50 190l9-21 9 21 22 9-22 9-9 21-9-21-22-9Z"
                fill="var(--yellow)"
              ></path>
              <path
                d="M520 440l7-17 7 17 17 7-17 7-7 17-7-17-17-7Z"
                fill="var(--paper)"
              ></path>
              <g strokeLinecap="round" strokeLinejoin="round">
                <g transform="translate(300 332) rotate(-15)">
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--ink)"
                    transform="translate(5 6)"
                  ></rect>
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--blue)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></rect>
                  <path
                    d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cy="-182"
                    r="26"
                    fill="#efb98e"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></circle>
                  <path
                    d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                    fill="var(--ink)"
                  ></path>
                </g>
                <g transform="translate(300 332) rotate(45)">
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--ink)"
                    transform="translate(5 6)"
                  ></rect>
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></rect>
                  <path
                    d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cy="-182"
                    r="26"
                    fill="#794b38"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></circle>
                  <path
                    d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                    fill="var(--ink)"
                  ></path>
                </g>
                <g transform="translate(300 332) rotate(105)">
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--ink)"
                    transform="translate(5 6)"
                  ></rect>
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--green)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></rect>
                  <path
                    d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cy="-182"
                    r="26"
                    fill="#d89266"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></circle>
                  <path
                    d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                    fill="var(--ink)"
                  ></path>
                </g>
                <g transform="translate(300 332) rotate(165)">
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--ink)"
                    transform="translate(5 6)"
                  ></rect>
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--pink)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></rect>
                  <path
                    d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cy="-182"
                    r="26"
                    fill="#efb98e"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></circle>
                  <path
                    d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                    fill="var(--ink)"
                  ></path>
                </g>
                <g transform="translate(300 332) rotate(225)">
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--ink)"
                    transform="translate(5 6)"
                  ></rect>
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></rect>
                  <path
                    d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cy="-182"
                    r="26"
                    fill="#ad7050"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></circle>
                  <path
                    d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                    fill="var(--ink)"
                  ></path>
                </g>
                <g transform="translate(300 332) rotate(285)">
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--ink)"
                    transform="translate(5 6)"
                  ></rect>
                  <rect
                    x="-43"
                    y="-168"
                    width="86"
                    height="94"
                    rx="32"
                    fill="var(--blue)"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></rect>
                  <path
                    d="M-29-136L-38-110L-25-92M29-136L38-110L25-92"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  ></path>
                  <circle
                    cy="-182"
                    r="26"
                    fill="#794b38"
                    stroke="var(--ink)"
                    strokeWidth="3"
                  ></circle>
                  <path
                    d="M-25-187Q-22-217 3-208Q27-207 26-182Q10-182 1-194Q-9-182-25-187Z"
                    fill="var(--ink)"
                  ></path>
                </g>
                <circle cx="305" cy="340" r="116" fill="var(--ink)"></circle>
                <circle
                  cx="300"
                  cy="332"
                  r="116"
                  fill="var(--yellow)"
                  stroke="var(--ink)"
                  strokeWidth="3"
                ></circle>
                <circle
                  cx="300"
                  cy="332"
                  r="101"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="1.5"
                  opacity=".25"
                ></circle>
                <g transform="translate(266 306) rotate(-12)">
                  <rect
                    x="4"
                    y="5"
                    width="58"
                    height="76"
                    fill="var(--ink)"
                  ></rect>
                  <rect
                    width="58"
                    height="76"
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  ></rect>
                  <path
                    d="M12 19h31M12 28h24M12 37h28"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M13 55l6 6 13-15"
                    fill="none"
                    stroke="var(--red-dark)"
                    strokeWidth="4"
                  ></path>
                </g>
                <g transform="translate(340 306) rotate(16)">
                  <rect
                    width="36"
                    height="44"
                    fill="var(--pink)"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  ></rect>
                  <path
                    d="M8 13h20M8 21h15"
                    stroke="var(--ink)"
                    strokeWidth="2"
                  ></path>
                </g>
                <g fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5">
                  <path d="M237 300c-19-13-26 13-7 16" fill="none"></path>
                  <circle cx="242" cy="313" r="14"></circle>
                  <path d="M345 380c19 13 26-13 7-16" fill="none"></path>
                  <circle cx="340" cy="367" r="14"></circle>
                </g>
                <g fill="var(--ink)">
                  <circle cx="242" cy="313" r="8"></circle>
                  <circle cx="340" cy="367" r="8"></circle>
                </g>
                <path
                  d="M277 405l43-8"
                  stroke="var(--blue)"
                  strokeWidth="7"
                ></path>
                <path
                  d="M320 397l7-2"
                  stroke="var(--ink)"
                  strokeWidth="4"
                ></path>
              </g>
              <g transform="translate(57 43) rotate(-5)">
                <path d="M7 7H249V94H7Z" fill="var(--ink)"></path>
                <path
                  d="M0 0H242V87H0Z"
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth="3"
                ></path>
                <text className="art-title" x="16" y="36" fill="var(--ink)">
                  {"FIND YOUR PEOPLE."}
                </text>
                <text className="art-title" x="16" y="71" fill="var(--ink)">
                  {"BUILD SOMETHING."}
                </text>
                <path
                  d="M88-8h64v17H88Z"
                  fill="var(--yellow)"
                  opacity=".85"
                ></path>
              </g>
              <g transform="translate(342 536) rotate(6)">
                <rect width="202" height="58" fill="var(--ink)"></rect>
                <text className="art-title" x="16" y="40" fill="var(--paper)">
                  {"ROOM FOR YOU."}
                </text>
              </g>
              <path
                d="M70 527q-23 42 47 50M103 565l16 12-17 9"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <text className="art-note" x="135" y="586" fill="var(--ink)">
                {"IT STARTS WITH US."}
              </text>
            </svg>
          </div>
        </section>
        <p className="circle-rally">
          <svg className="zap" viewBox="0 0 24 40" aria-hidden="true">
            <path d="M14 1L2 22h8l-4 17 16-24h-9l5-14z"></path>
          </svg>
          <span>
            {"Find your voice, find some friends, and fight like hell."}
          </span>
        </p>
        <section className="about-you" id="why">
          <div className="container you-grid">
            <div>
              <div className="label alt-yellow">{"What you get"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"Find your people."}
                <br />
                <span className="underline yellow">{"Make a difference."}</span>
              </h2>
              <p className="deck section-intro">
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
          </div>
        </section>
        <section className="getting-started" id="getting-started">
          <div className="container">
            <div className="label alt-blue">{"Getting started"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"Start small."}
              <br />
              <span className="underline blue">{"Build together."}</span>
            </h2>
            <ol className="steps">
              <li className="step">
                <span className="step-number" aria-hidden="true">
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
                <span className="step-number" aria-hidden="true">
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
                <span className="step-number" aria-hidden="true">
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
          </div>
        </section>
        <section className="shared-leadership" id="shared-leadership">
          <div className="container you-grid">
            <div>
              <div className="label alt-yellow">
                {"Room for everyone to lead"}
              </div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
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
          </div>
        </section>
        <section className="faq" id="faq">
          <div className="container">
            <div className="label alt-green">{"FAQ"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"Before you "}
              <span className="underline yellow">{"begin."}</span>
            </h2>
            <div className="faq-acc">
              <details className="faq-item" open={true}>
                <summary>
                  <span className="faq-n">{"01"}</span>
                  <span className="faq-q">
                    {"How much time am I committing?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
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
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"02"}</span>
                  <span className="faq-q">
                    {"Do I need experience or a group already?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
                  <p>
                    {
                      "No. You can learn as you go, with mentorship and guidance from Sapiens First Global and other Circle organizers. Bringing two reliable friends is recommended, but you can start without them."
                    }
                  </p>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"03"}</span>
                  <span className="faq-q">
                    {"Does my Circle have to organize protests or advocacy?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
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
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"04"}</span>
                  <span className="faq-q">
                    {"What might a Circle do week to week?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
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
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"05"}</span>
                  <span className="faq-q">
                    {"Can we propose our own campaign?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
                  <p>
                    {"Yes. You can join a "}
                    <Link href="/campaigns">{"priority campaign"}</Link>
                    {" or propose a different campaign that falls within "}
                    <Link href="/about">{"Sapiens First’s focus areas"}</Link>
                    {
                      ". Bring your idea to the Global team so you can explore how it fits and what support would help."
                    }
                  </p>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"06"}</span>
                  <span className="faq-q">
                    {"Can I start a Circle and hand it over later?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
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
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"07"}</span>
                  <span className="faq-q">
                    {"Can a Circle grow into something bigger?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
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
                </div>
              </details>
            </div>
          </div>
        </section>
        <section className="apply" id="apply">
          <div className="apply-copy">
            <div className="label alt-green">{"Start"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"Make room for "}
              <span className="marker">{"your people."}</span>
            </h2>
            <p className="deck">
              {
                "You don’t need a full team or a perfect plan. Bring your interest, and we’ll help you take the first step."
              }
            </p>
            <a className="btn primary" href="#signup">
              {"Express interest →"}
            </a>
            <p className="apply-note">
              {"Questions? "}
              <a href="mailto:rohan@sapiensfirst.org">{"Email Rohan"}</a>
              {"."}
            </p>
          </div>
          <div className="apply-panel">
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
            <div className="label">{"Start a Circle"}</div>
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
          </div>
        </section>
      </main>
    </div>
  );
}
