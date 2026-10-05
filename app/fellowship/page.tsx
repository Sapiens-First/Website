import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import "../shared-about-circle-fellowship.css";
import "./page.css";

export const metadata: Metadata = {
  title: "AI Advocacy Fellowship — Sapiens First",
  description:
    "Become a Sapiens First Fellow — hands-on experience, mentorship, and a key role in our movement to build political power over AI.",
  alternates: { canonical: "/fellowship" },
  openGraph: {
    title: "AI Advocacy Fellowship — Sapiens First",
    description:
      "Become a Sapiens First Fellow — hands-on experience, mentorship, and a key role in our movement to build political power over AI.",
    url: "/fellowship",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-fellowship">
      <main className="route-fellowship">
        <section className="hero">
          <div className="hero-copy">
            <div className="kicker">{"Fellowship · Rolling Cohorts"}</div>
            <h1>
              {"Become a "}
              <span className="marker">{"Fellow."}</span>
            </h1>
            <p>
              {
                "As a Fellow, you'll get hands-on experience, mentorship, and play a key role in our movement."
              }
            </p>
            <div className="fact-pills">
              <span className="fact-pill">{"Rolling admissions"}</span>
              <span className="fact-pill">{"12 weeks"}</span>
              <span className="fact-pill">{"3–5 hrs / week"}</span>
              <span className="fact-pill">{"Volunteer"}</span>
            </div>
            <SignupForm
              interest="fellowship"
              buttonText="Keep me posted →"
              id="signup"
            />
            <p className="hero-note">
              {
                "You'll work directly with the founder and a growing team of Fellows from across the country."
              }
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun"></div>
            <div className="burst"></div>
            <div className="face"></div>
            <div className="poster">
              {"Join the"}
              <br />
              {"fellowship"}
            </div>
            <div className="poster alt">
              {"Be the"}
              <br />
              {"change"}
            </div>
            <div className="confetti c1"></div>
            <div className="confetti c2"></div>
            <div className="confetti c3"></div>
            <div className="confetti c4"></div>
            <i
              style={
                {
                  position: "absolute",
                  left: "10%",
                  top: "8%",
                  zIndex: "2",
                  color: "var(--ink)",
                  transform: "rotate(-6deg)",
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
                  position: "absolute",
                  left: "20%",
                  top: "16%",
                  zIndex: "2",
                  color: "var(--ink)",
                  transform: "rotate(4deg) scale(.7)",
                } as React.CSSProperties
              }
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
          </div>
        </section>
        <section className="factbar">
          <div className="stats">
            <div className="stat">
              <strong>{"Rolling"}</strong>
              <span>{"Program dates"}</span>
            </div>
            <div className="stat">
              <strong>{"12 weeks"}</strong>
              <span>{"Program length"}</span>
            </div>
            <div className="stat">
              <strong>{"3–5 hrs"}</strong>
              <span>{"Time per week"}</span>
            </div>
            <div className="stat">
              <strong>{"Ongoing"}</strong>
              <span>{"Applications"}</span>
            </div>
          </div>
        </section>
        <section className="about" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <div className="label">{"About"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"We imagine tech that serves the "}
                <span className="underline blue">{"common good."}</span>
              </h2>
              <p className="deck">
                {
                  "Our mission is to achieve revolutionary political change for technology before the arrival of superintelligence."
                }
              </p>
              <Link className="text-link" href="/learn">
                {"Learn more →"}
              </Link>
            </div>
            <div className="about-art">
              <div className="circle"></div>
              <div className="tag t1">{"Political change"}</div>
              <div className="tag t2">{"AI safety"}</div>
              <div className="tag t3">{"Democracy"}</div>
            </div>
          </div>
        </section>
        <section className="about-you" id="about-you">
          <div className="fun-layer" aria-hidden="true">
            <i
              style={
                {
                  left: "5%",
                  top: "8%",
                  transform: "rotate(-8deg)",
                  color: "var(--ink)",
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
                  left: "13%",
                  top: "16%",
                  transform: "rotate(6deg) scale(.7)",
                  color: "var(--ink)",
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
                  right: "6%",
                  bottom: "12%",
                  width: "56px",
                  color: "var(--yellow)",
                } as React.CSSProperties
              }
            >
              <svg className="moon" viewBox="0 0 40 40" width="56" height="56">
                <mask id="aboutyou-moon-mask">
                  <rect width="40" height="40" fill="#fff"></rect>
                  <circle cx="27" cy="27" r="14" fill="#000"></circle>
                </mask>
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="currentColor"
                  mask="url(#aboutyou-moon-mask)"
                ></circle>
              </svg>
            </i>
          </div>
          <div className="container you-grid">
            <div>
              <div className="label alt-yellow">{"About you"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"We're looking for people who "}
                <span className="underline yellow">{"care deeply."}</span>
              </h2>
              <p className="you-note">
                {"We look for enthusiasm, dedication, and a desire to grow."}
              </p>
            </div>
            <div className="focus">
              <div className="focus-row">
                <span className="n">{"01"}</span>
                <span className="name">
                  {"Care deeply about technology and society"}
                </span>
              </div>
              <div className="focus-row">
                <span className="n">{"02"}</span>
                <span className="name">
                  {"Are inspired by activism as a tool for social change"}
                </span>
              </div>
              <div className="focus-row">
                <span className="n">{"03"}</span>
                <span className="name">
                  {"Can work consistently for 3-5 hours a week"}
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="roles" id="roles">
          <div className="container">
            <div className="roles-head">
              <div className="label">{"Roles"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"Four "}
                <span className="underline green">{"workstreams,"}</span>
                {" one movement."}
              </h2>
              <p className="deck">
                {
                  "We are currently looking for people to work on four primary workstreams."
                }
              </p>
            </div>
            <div className="role-acc">
              <details className="role" open={true}>
                <summary>
                  <span className="role-title">{"Community Organizing"}</span>
                  <span className="role-tag">{"Remote-friendly"}</span>
                  <span className="role-chevron" aria-hidden="true"></span>
                </summary>
                <div className="role-body">
                  <p>
                    {
                      "You enjoy talking to new people, are a great listener, and care deeply about community. You're great at making people feel empowered, with the goal of them joining the movement."
                    }
                  </p>
                  <span className="role-activities-label">
                    {"Example activities"}
                  </span>
                  <ul className="role-list">
                    <li>{"Designing events for people"}</li>
                    <li>{"Door-to-door conversations with people"}</li>
                    <li>
                      {
                        "Creating curriculum and documentation for volunteers to train up"
                      }
                    </li>
                  </ul>
                  <p className="role-note">
                    {
                      "Community Fellows help grow and support Circles forming across the country."
                    }
                  </p>
                </div>
              </details>
              <details className="role">
                <summary>
                  <span className="role-title">{"Campaign Automations"}</span>
                  <span className="role-tag">{"Remote-friendly"}</span>
                  <span className="role-chevron" aria-hidden="true"></span>
                </summary>
                <div className="role-body">
                  <p>
                    {
                      "You enjoy building scalable systems and automations to empower communities. You're a fast learner and excellent at incorporating AI to assist you in the process, with the goal of streamlining our supporter and membership onboarding and retention processes."
                    }
                  </p>
                  <span className="role-activities-label">
                    {"Example activities"}
                  </span>
                  <ul className="role-list">
                    <li>
                      {
                        "Rigging up an open-source CRM to our membership sign-up page"
                      }
                    </li>
                    <li>
                      {
                        "Creating an email automation protocol for sign-ups, event attendees, and supporters"
                      }
                    </li>
                    <li>{"Automating member onboarding on Discord"}</li>
                  </ul>
                </div>
              </details>
              <details className="role">
                <summary>
                  <span className="role-title">{"Digital Marketing"}</span>
                  <span className="role-tag">{"Remote-friendly"}</span>
                  <span className="role-chevron" aria-hidden="true"></span>
                </summary>
                <div className="role-body">
                  <p>
                    {
                      "You enjoy communicating big ideas clearly and learning what inspires people to take action. You will test messaging and branding, with the goal of expanding our digital reach."
                    }
                  </p>
                  <span className="role-activities-label">
                    {"Example activities"}
                  </span>
                  <ul className="role-list">
                    <li>{"Refining our brand marketing strategy"}</li>
                    <li>
                      {"Designing and executing our digital marketing strategy"}
                    </li>
                    <li>
                      {
                        "Designing materials like business cards, banners, and lawn signs"
                      }
                    </li>
                  </ul>
                </div>
              </details>
              <details className="role">
                <summary>
                  <span className="role-title">{"Policy & Coalitions"}</span>
                  <span className="role-tag">{"Remote-friendly"}</span>
                  <span className="role-chevron" aria-hidden="true"></span>
                </summary>
                <div className="role-body">
                  <p>
                    {
                      "You enjoy diving deep into policy and AI safety. You're good at putting yourself in other people's shoes. You enjoy building relationships, with the goal of building coalitional support for Sapiens First's campaigns nationally."
                    }
                  </p>
                  <span className="role-activities-label">
                    {"Example activities"}
                  </span>
                  <ul className="role-list">
                    <li>{"Crafting achievable campaign objectives"}</li>
                    <li>
                      {
                        "Collaborating with other movements like YDSA and the Sunrise Movement"
                      }
                    </li>
                    <li>
                      {
                        "Reaching out and building relationships with mainstream orgs like the ACLU"
                      }
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </section>
        <section className="commitment">
          <div className="fun-layer" aria-hidden="true">
            <i
              style={
                {
                  left: "4%",
                  top: "22%",
                  width: "30px",
                  color: "var(--ink)",
                  transform: "rotate(-6deg)",
                } as React.CSSProperties
              }
            >
              <svg className="zap" viewBox="0 0 24 40" width="30" height="30">
                <path d="M14 1L2 22h8l-4 17 16-24h-9l5-14z"></path>
              </svg>
            </i>
            <i
              style={
                {
                  right: "8%",
                  bottom: "18%",
                  width: "60px",
                  color: "var(--ink)",
                } as React.CSSProperties
              }
            >
              <svg className="pow" viewBox="0 0 24 24" width="60" height="60">
                <rect width="24" height="24" fill="currentColor"></rect>
              </svg>
            </i>
          </div>
          <div className="container commitment-inner">
            <p>{"Find your voice, find some friends, and fight like hell."}</p>
            <div className="commitment-pills">
              <span>{"Rolling cohorts"}</span>
              <span>{"12 weeks"}</span>
              <span>{"3–5 hrs / week"}</span>
            </div>
          </div>
        </section>
        <section className="benefits" id="benefits">
          <div className="fun-layer" aria-hidden="true">
            <i
              style={
                {
                  right: "10%",
                  top: "20%",
                  transform: "rotate(8deg)",
                  color: "var(--ink)",
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
                  right: "4%",
                  bottom: "16%",
                  width: "14px",
                  color: "var(--red)",
                  transform: "rotate(-10deg)",
                } as React.CSSProperties
              }
            >
              <svg className="star" viewBox="0 0 24 24" width="14" height="14">
                <rect width="24" height="24" fill="currentColor"></rect>
              </svg>
            </i>
          </div>
          <div className="container benefits-grid">
            <div>
              <div className="label">{"Benefits"}</div>
              <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
                {"What you "}
                <span className="underline blue">{"receive."}</span>
              </h2>
            </div>
            <div>
              <p className="deck">
                {
                  "This is a volunteer program, but we provide support (travel, meals) for in-person activities, and will reimburse organizational expenses. Strong fellows may be invited to extend after the initial term."
                }
              </p>
            </div>
          </div>
        </section>
        <section className="faq" id="faq">
          <div className="container">
            <div className="label">{"FAQ"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"Questions, "}
              <span className="underline green">{"answered."}</span>
            </h2>
            <div className="faq-acc">
              <details className="faq-item" open={true}>
                <summary>
                  <span className="faq-n">{"01"}</span>
                  <span className="faq-q">{"What is the Fellowship?"}</span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
                  <p>
                    {
                      "Each Fellow will own a priority project, and sync with a team working on a similar project. There'll also be programming to connect, learn about social change, politics, and hang out."
                    }
                  </p>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"02"}</span>
                  <span className="faq-q">{"Why join the Fellowship?"}</span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
                  <ul>
                    <li>
                      {
                        "Be a founding member of the movement to save the future of humanity"
                      }
                    </li>
                    <li>
                      {
                        "Build skills like strategic analysis, project planning, and leadership"
                      }
                    </li>
                    <li>
                      {"Make professional connections in AI safety / policy"}
                    </li>
                    <li>{"Have fun!"}</li>
                  </ul>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"03"}</span>
                  <span className="faq-q">
                    {"What does the process look like?"}
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
                  <ol>
                    <li>
                      {"Express interest at "}
                      <a
                        className="text-link"
                        style={{ marginTop: "0" } as React.CSSProperties}
                        href="#signup"
                      >
                        {"sapiensfirst.org/fellowship"}
                      </a>
                    </li>
                    <li>
                      {
                        "Meet with the Executive Director to discuss your interests"
                      }
                    </li>
                    <li>
                      {
                        "Receive an initial priority project. Accept by signing the Fellowship agreement."
                      }
                    </li>
                    <li>{"Join the Discord and get started!"}</li>
                  </ol>
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="faq-n">{"04"}</span>
                  <span className="faq-q">
                    {
                      "What does the program look like week by week, month by month?"
                    }
                  </span>
                  <span className="faq-chevron" aria-hidden="true"></span>
                </summary>
                <div className="faq-body">
                  <div className="faq-table-wrap">
                    <table className="faq-table">
                      <thead>
                        <tr>
                          <th>{"Activity"}</th>
                          <th>{"Content"}</th>
                          <th>{"Timing"}</th>
                          <th>{"Priority"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{"Department Sync"}</td>
                          <td>
                            {
                              "Synchronous meeting or written memo sharing progress & reflections on your project"
                            }
                          </td>
                          <td>{"Weekly or biweekly (45 min)"}</td>
                          <td>{"Required"}</td>
                        </tr>
                        <tr>
                          <td>{"1-1s with Rohan"}</td>
                          <td>
                            {
                              "Chat about the movement, strategy, or future project direction"
                            }
                          </td>
                          <td>{"Weekly or biweekly (30 min)"}</td>
                          <td>{"Required"}</td>
                        </tr>
                        <tr>
                          <td>{"General Meetings"}</td>
                          <td>
                            {
                              "Discussions with Fellows about social change, leadership, and your current work."
                            }
                          </td>
                          <td>{"Tuesdays, 6:30–7:30pm PT"}</td>
                          <td>{"Optional"}</td>
                        </tr>
                        <tr>
                          <td>{"Socials in SF / Oakland"}</td>
                          <td>{"Bowling, karaoke, or pizza"}</td>
                          <td>{"Monthly or spontaneous"}</td>
                          <td>{"Optional"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>{"By week, the program will roughly be:"}</p>
                  <ul>
                    <li>
                      <strong>{"Weeks 1–2:"}</strong>
                      {" Research, strategy, create success metrics"}
                    </li>
                    <li>
                      <strong>{"Weeks 3–5:"}</strong>
                      {" Design & build a prototype"}
                    </li>
                    <li>
                      <strong>{"Weeks 6–9:"}</strong>
                      {" Iterate and evolve the prototype"}
                    </li>
                    <li>
                      <strong>{"Weeks 10–12:"}</strong>
                      {" Document and present"}
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </section>
        <section className="apply" id="apply">
          <div className="apply-copy">
            <div className="label alt-green">{"Apply"}</div>
            <h2 style={{ marginTop: "18px" } as React.CSSProperties}>
              {"We're excited to "}
              <span className="marker">{"hear from you."}</span>
            </h2>
            <p className="deck">
              {
                "Interested in the fellowship? Leave your email and we'll be in touch about opportunities and next steps."
              }
            </p>
            <a className="btn primary" href="#signup">
              {"Express interest →"}
            </a>
            <p className="apply-note">
              {"Questions? Email rohan@sapiensfirst.org"}
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
            <div className="label">{"Rolling Cohorts"}</div>
            <div className="apply-deadline">
              {"Always"}
              <br />
              {"Open"}
            </div>
            <p>
              {
                "Leave your email to hear about fellowship opportunities and next steps."
              }
            </p>
            <SignupForm interest="fellowship" buttonText="Keep me posted →" />
          </div>
        </section>
      </main>
    </div>
  );
}
