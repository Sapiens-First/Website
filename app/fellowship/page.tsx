import { pageMetadata } from "@/lib/site";
import { fellowshipRoles } from "@/content/fellowship";
import { Container } from "@/components/layout/Container";
import { FaqItem, FaqList } from "@/components/sections/Faq";
import {
  SplitHero,
  ClosingSection,
  ClosingCopy,
  SignupPanel,
} from "@/components/sections/SplitSection";
import SignupForm from "@/components/SignupForm";
import { ActionLink, TextLink } from "@/components/ui/Action";
import { FactPill, Label } from "@/components/ui/Label";

export const metadata = pageMetadata({
  title: "AI Advocacy Fellowship",
  description:
    "Become a Sapiens First Fellow — hands-on experience, mentorship, and a key role in our movement to build political power over AI.",
  path: "/fellowship",
});

export default function Page() {
  return (
    <div className="route-root route-fellowship">
      <main className="route-fellowship">
        <SplitHero>
          <div className="hero-copy">
            <div className="kicker">Fellowship · Rolling Cohorts</div>
            <h1>
              Become a <span className="marker">Fellow.</span>
            </h1>
            <p>
              As a Fellow, you&apos;ll get hands-on experience, mentorship, and
              play a key role in our movement.
            </p>
            <div className="fact-pills">
              <FactPill>Rolling admissions</FactPill>
              <FactPill>12 weeks</FactPill>
              <FactPill>3–5 hrs / week</FactPill>
              <FactPill>Volunteer</FactPill>
            </div>
            <SignupForm
              interest="fellowship"
              buttonText="Keep me posted →"
              id="signup"
            />
            <p className="hero-note">
              You&apos;ll work directly with the founder and a growing team of
              Fellows from across the country.
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun"></div>
            <div className="burst"></div>
            <div className="face"></div>
            <div className="poster">
              Join the
              <br />
              fellowship
            </div>
            <div className="poster alt">
              Be the
              <br />
              change
            </div>
            <div className="confetti c1"></div>
            <div className="confetti c2"></div>
            <div className="confetti c3"></div>
            <div className="confetti c4"></div>
            <i
              style={{
                position: "absolute",
                left: "10%",
                top: "8%",
                zIndex: "2",
                color: "var(--color-ink)",
                transform: "rotate(-6deg)",
              }}
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
            <i
              style={{
                position: "absolute",
                left: "20%",
                top: "16%",
                zIndex: "2",
                color: "var(--color-ink)",
                transform: "rotate(4deg) scale(.7)",
              }}
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
          </div>
        </SplitHero>
        <section className="factbar bg-ink">
          <div className="stats">
            <div className="stat">
              <strong>Rolling</strong>
              <span>Program dates</span>
            </div>
            <div className="stat">
              <strong>12 weeks</strong>
              <span>Program length</span>
            </div>
            <div className="stat">
              <strong>3–5 hrs</strong>
              <span>Time per week</span>
            </div>
            <div className="stat">
              <strong>Ongoing</strong>
              <span>Applications</span>
            </div>
          </div>
        </section>
        <section className="about" id="about">
          <Container className="about-grid">
            <div className="about-copy">
              <Label tone="coral">About</Label>
              <h2 className="mt-5">
                We imagine tech that serves the{" "}
                <span className="ink-underline blue">common good.</span>
              </h2>
              <p className="deck">
                Our mission is to achieve revolutionary political change for
                technology before the arrival of superintelligence.
              </p>
              <TextLink href="/learn">Learn more →</TextLink>
            </div>
            <div className="about-art">
              <div className="circle"></div>
              <div className="tag t1">Political change</div>
              <div className="tag t2">AI safety</div>
              <div className="tag t3">Democracy</div>
            </div>
          </Container>
        </section>
        <section className="about-you" id="about-you">
          <div className="fun-layer" aria-hidden="true">
            <i
              style={{
                left: "5%",
                top: "8%",
                transform: "rotate(-8deg)",
                color: "var(--color-ink)",
              }}
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
            <i
              style={{
                left: "13%",
                top: "16%",
                transform: "rotate(6deg) scale(.7)",
                color: "var(--color-ink)",
              }}
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
            <i
              style={{
                right: "6%",
                bottom: "12%",
                width: "56px",
                color: "var(--color-brand-yellow)",
              }}
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
          <Container className="you-grid">
            <div>
              <Label tone="yellow">About you</Label>
              <h2 className="mt-5">
                We&apos;re looking for people who{" "}
                <span className="ink-underline yellow">care deeply.</span>
              </h2>
              <p className="you-note mt-6 font-semibold text-ink italic">
                We look for enthusiasm, dedication, and a desire to grow.
              </p>
            </div>
            <div className="focus">
              <div className="focus-row">
                <span className="n">01</span>
                <span className="name">
                  Care deeply about technology and society
                </span>
              </div>
              <div className="focus-row">
                <span className="n">02</span>
                <span className="name">
                  Are inspired by activism as a tool for social change
                </span>
              </div>
              <div className="focus-row">
                <span className="n">03</span>
                <span className="name">
                  Can work consistently for 3-5 hours a week
                </span>
              </div>
            </div>
          </Container>
        </section>
        <section className="roles bg-white" id="roles">
          <Container>
            <div className="roles-head">
              <Label tone="coral">Roles</Label>
              <h2 className="mt-5">
                Four <span className="ink-underline green">workstreams,</span>{" "}
                one movement.
              </h2>
              <p className="deck">
                We are currently looking for people to work on four primary
                workstreams.
              </p>
            </div>
            <div className="role-acc mt-11 border-t-2 border-solid border-t-ink">
              {fellowshipRoles.map((role, index) => (
                <details
                  className="role border-b-2 border-solid border-b-ink"
                  key={role.title}
                  open={index === 0}
                >
                  <summary>
                    <span className="role-title pl-3.5 font-display font-extrabold tracking-normal uppercase max-sm:pl-2.5 max-sm:text-xl">
                      {role.title}
                    </span>
                    <span className="role-tag border-2 border-solid border-ink px-2 py-1 text-xs font-black tracking-wider whitespace-nowrap uppercase">
                      Remote-friendly
                    </span>
                    <span className="role-chevron" aria-hidden="true"></span>
                  </summary>
                  <div className="role-body pt-0 pr-5 pb-8 pl-11 max-sm:pt-0 max-sm:pr-4 max-sm:pb-6 max-sm:pl-8">
                    <p>{role.description}</p>
                    <span className="role-activities-label mt-5 mr-0 mb-2.5 ml-0 block text-xs font-black tracking-widest text-coral-dark uppercase">
                      Example activities
                    </span>
                    <ul className="role-list">
                      {role.activities.map((activity) => (
                        <li key={activity}>{activity}</li>
                      ))}
                    </ul>
                    {role.note && (
                      <p className="role-note mt-4 font-semibold text-ink italic">
                        {role.note}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
        <section className="commitment overflow-hidden bg-coral px-0 py-14">
          <div className="fun-layer" aria-hidden="true">
            <i
              style={{
                left: "4%",
                top: "22%",
                width: "30px",
                color: "var(--color-ink)",
                transform: "rotate(-6deg)",
              }}
            >
              <svg className="zap" viewBox="0 0 24 40" width="30" height="30">
                <path d="M14 1L2 22h8l-4 17 16-24h-9l5-14z"></path>
              </svg>
            </i>
            <i
              style={{
                right: "8%",
                bottom: "18%",
                width: "60px",
                color: "var(--color-ink)",
              }}
            >
              <svg className="pow" viewBox="0 0 24 24" width="60" height="60">
                <rect width="24" height="24" fill="currentColor"></rect>
              </svg>
            </i>
          </div>
          <Container className="commitment-inner flex flex-wrap items-center justify-between gap-6 max-sm:flex-col max-sm:items-start">
            <p>Find your voice, find some friends, and fight like hell.</p>
            <div className="commitment-pills flex flex-wrap gap-2.5">
              <span>Rolling cohorts</span>
              <span>12 weeks</span>
              <span>3–5 hrs / week</span>
            </div>
          </Container>
        </section>
        <section className="benefits overflow-hidden bg-paper" id="benefits">
          <div className="fun-layer" aria-hidden="true">
            <i
              style={{
                right: "10%",
                top: "20%",
                transform: "rotate(8deg)",
                color: "var(--color-ink)",
              }}
            >
              <svg className="bird" viewBox="0 0 24 12">
                <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
              </svg>
            </i>
            <i
              style={{
                right: "4%",
                bottom: "16%",
                width: "14px",
                color: "var(--color-coral)",
                transform: "rotate(-10deg)",
              }}
            >
              <svg className="star" viewBox="0 0 24 24" width="14" height="14">
                <rect width="24" height="24" fill="currentColor"></rect>
              </svg>
            </i>
          </div>
          <Container className="benefits-grid grid items-start gap-16">
            <div>
              <Label tone="coral">Benefits</Label>
              <h2 className="mt-5">
                What you <span className="ink-underline blue">receive.</span>
              </h2>
            </div>
            <div>
              <p className="deck">
                This is a volunteer program, but we provide support (travel,
                meals) for in-person activities, and will reimburse
                organizational expenses. Strong fellows may be invited to extend
                after the initial term.
              </p>
            </div>
          </Container>
        </section>
        <section className="faq" id="faq">
          <Container>
            <Label tone="coral">FAQ</Label>
            <h2 className="mt-5">
              Questions, <span className="ink-underline green">answered.</span>
            </h2>
            <FaqList>
              <FaqItem number={1} question={<>What is the Fellowship?</>} open>
                <p>
                  Each Fellow will own a priority project, and sync with a team
                  working on a similar project. There&apos;ll also be
                  programming to connect, learn about social change, politics,
                  and hang out.
                </p>
              </FaqItem>
              <FaqItem number={2} question={<>Why join the Fellowship?</>}>
                <ul>
                  <li>
                    Be a founding member of the movement to save the future of
                    humanity
                  </li>
                  <li>
                    Build skills like strategic analysis, project planning, and
                    leadership
                  </li>
                  <li>Make professional connections in AI safety / policy</li>
                  <li>Have fun!</li>
                </ul>
              </FaqItem>
              <FaqItem
                number={3}
                question={<>What does the process look like?</>}
              >
                <ol>
                  <li>
                    Express interest at{" "}
                    <TextLink href="#signup">
                      sapiensfirst.org/fellowship
                    </TextLink>
                  </li>
                  <li>
                    Meet with the Executive Director to discuss your interests
                  </li>
                  <li>
                    Receive an initial priority project. Accept by signing the
                    Fellowship agreement.
                  </li>
                  <li>Join the Discord and get started!</li>
                </ol>
              </FaqItem>
              <FaqItem
                number={4}
                question={
                  <>
                    What does the program look like week by week, month by
                    month?
                  </>
                }
              >
                <div className="faq-table-wrap mb-3.5 overflow-x-auto">
                  <table className="faq-table w-full">
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>Content</th>
                        <th>Timing</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Department Sync</td>
                        <td>
                          {
                            "Synchronous meeting or written memo sharing progress & reflections on your project"
                          }
                        </td>
                        <td>Weekly or biweekly (45 min)</td>
                        <td>Required</td>
                      </tr>
                      <tr>
                        <td>1-1s with Rohan</td>
                        <td>
                          Chat about the movement, strategy, or future project
                          direction
                        </td>
                        <td>Weekly or biweekly (30 min)</td>
                        <td>Required</td>
                      </tr>
                      <tr>
                        <td>General Meetings</td>
                        <td>
                          Discussions with Fellows about social change,
                          leadership, and your current work.
                        </td>
                        <td>Tuesdays, 6:30–7:30pm PT</td>
                        <td>Optional</td>
                      </tr>
                      <tr>
                        <td>Socials in SF / Oakland</td>
                        <td>Bowling, karaoke, or pizza</td>
                        <td>Monthly or spontaneous</td>
                        <td>Optional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>By week, the program will roughly be:</p>
                <ul>
                  <li>
                    <strong>Weeks 1–2:</strong> Research, strategy, create
                    success metrics
                  </li>
                  <li>
                    <strong>Weeks 3–5:</strong> Design &amp; build a prototype
                  </li>
                  <li>
                    <strong>Weeks 6–9:</strong> Iterate and evolve the prototype
                  </li>
                  <li>
                    <strong>Weeks 10–12:</strong> Document and present
                  </li>
                </ul>
              </FaqItem>
            </FaqList>
          </Container>
        </section>
        <ClosingSection id="apply">
          <ClosingCopy>
            <Label tone="purple">Apply</Label>
            <h2 className="mt-5">
              We&apos;re excited to{" "}
              <span className="marker">hear from you.</span>
            </h2>
            <p className="deck">
              Interested in the fellowship? Leave your email and we&apos;ll be
              in touch about opportunities and next steps.
            </p>
            <ActionLink variant="primary" href="#signup">
              Express interest →
            </ActionLink>
            <p className="apply-note">
              Questions? Email rohan@sapiensfirst.org
            </p>
          </ClosingCopy>
          <SignupPanel>
            <div className="fun-layer" aria-hidden="true">
              <i
                style={{
                  left: "8%",
                  top: "10%",
                  transform: "rotate(-6deg)",
                  color: "#fff",
                }}
              >
                <svg className="bird" viewBox="0 0 24 12">
                  <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
                </svg>
              </i>
              <i
                style={{
                  left: "20%",
                  top: "20%",
                  transform: "rotate(6deg) scale(.65)",
                  color: "#fff",
                }}
              >
                <svg className="bird" viewBox="0 0 24 12">
                  <path d="M1 9C4 2 8 2 12 7C16 2 20 2 23 9"></path>
                </svg>
              </i>
            </div>
            <Label tone="coral">Rolling Cohorts</Label>
            <div className="apply-deadline">
              Always
              <br />
              Open
            </div>
            <p>
              Leave your email to hear about fellowship opportunities and next
              steps.
            </p>
            <SignupForm interest="fellowship" buttonText="Keep me posted →" />
          </SignupPanel>
        </ClosingSection>
      </main>
    </div>
  );
}
