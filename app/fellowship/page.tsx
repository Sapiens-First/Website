import { pageMetadata } from "@/lib/site";
import { fellowshipRoles } from "@/content/fellowship";
import { Container } from "@/components/layout/Container";
import { FaqItem, FaqList } from "@/components/sections/Faq";
import {
  SplitHero,
  ClosingSection,
  ClosingCopy,
  SignupPanel,
  HeroCopy,
  HeroLede,
  HeroCollage,
  FocusList,
} from "@/components/sections/SplitSection";
import SignupForm from "@/components/SignupForm";
import { ActionLink, TextLink } from "@/components/ui/Action";
import { Deck, FactPill, Kicker, Label } from "@/components/ui/Text";
import {
  Bird,
  Doodle,
  FunLayer,
  Moon,
  Pow,
  Star,
  Zap,
} from "@/components/ui/Doodles";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "AI Advocacy Fellowship",
  description:
    "Become a Sapiens First Fellow — hands-on experience, mentorship, and a key role in our movement to build political power over AI.",
  path: "/fellowship",
});

const h2 = "mt-5 text-4xl lg:text-5xl xl:text-6xl max-sm:text-5xl";
const section =
  "relative overflow-hidden border-b-2 border-ink py-24 max-sm:py-14";
const artTag =
  "absolute border-2 border-ink bg-white px-[13px] py-2.5 text-xs font-black uppercase";

const facts = [
  { value: "Rolling", label: "Program dates", color: "text-coral" },
  { value: "12 weeks", label: "Program length", color: "text-brand-yellow" },
  { value: "3–5 hrs", label: "Time per week", color: "text-brand-blue" },
  { value: "Ongoing", label: "Applications", color: "text-brand-purple" },
];
// Dividers between cells in the 4 / 2 / 1-column layouts.
const factBorders = [
  "border-r-2 max-lg:border-b-2 max-sm:border-r-0",
  "border-r-2 max-lg:border-r-0 max-lg:border-b-2",
  "border-r-2 max-lg:border-r-0 max-sm:border-b-2",
  "",
];
const roleColors = [
  "before:bg-coral",
  "before:bg-brand-blue",
  "before:bg-brand-purple",
  "before:bg-brand-pink",
];

export default function Page() {
  return (
    <>
      <main>
        <SplitHero>
          <HeroCopy>
            <Kicker>Fellowship · Rolling Cohorts</Kicker>
            <h1
              className={
                "relative z-2 max-w-xs font-display text-6xl font-extrabold tracking-tight uppercase max-sm:tracking-tighter sm:max-w-md lg:max-w-xl lg:text-8xl"
              }
            >
              Become a <span className="marker">Fellow.</span>
            </h1>
            <HeroLede>
              As a Fellow, you&apos;ll get hands-on experience, mentorship, and
              play a key role in our movement.
            </HeroLede>
            <div className="relative z-2 mb-7 flex flex-wrap gap-2">
              <FactPill>Rolling admissions</FactPill>
              <FactPill>12 weeks</FactPill>
              <FactPill>3–5 hrs / week</FactPill>
              <FactPill>Volunteer</FactPill>
            </div>
            <SignupForm
              className={"relative z-2 scroll-mt-28"}
              interest="fellowship"
              buttonText="Keep me posted →"
              id="signup"
            />
            <HeroLede className="text-ink italic">
              You&apos;ll work directly with the founder and a growing team of
              Fellows from across the country.
            </HeroLede>
          </HeroCopy>
          <HeroCollage
            posters={[
              <>
                Join the
                <br />
                fellowship
              </>,
              <>
                Be the
                <br />
                change
              </>,
            ]}
          />
        </SplitHero>
        <section
          className={"border-b-2 border-ink bg-ink p-0 max-sm:scroll-mt-20"}
        >
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {facts.map((fact, index) => (
              <div
                className={cn(
                  "flex min-h-48 flex-col justify-between border-white/18 px-6 py-7 text-white max-sm:min-h-0 max-sm:px-5 max-sm:py-6",
                  factBorders[index],
                )}
                key={fact.label}
              >
                <strong
                  className={cn(
                    "font-display text-3xl leading-none font-extrabold uppercase max-sm:text-4xl xl:text-4xl",
                    fact.color,
                  )}
                >
                  {fact.value}
                </strong>
                <span className="text-base font-bold tracking-wide text-white uppercase">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            section,
            "bg-white",
          )}
          id="about"
        >
          <Container className="grid grid-cols-2 items-start gap-16 max-lg:grid-cols-1">
            <div>
              <Label tone="coral">About</Label>
              <h2 className={cn(h2)}>
                We imagine tech that serves the{" "}
                <span className="ink-underline ink-underline-brand-blue">
                  common good.
                </span>
              </h2>
              <Deck size="compact" className="mx-0 mt-6 mb-0 max-w-md">
                Our mission is to achieve revolutionary political change for
                technology before the arrival of superintelligence.
              </Deck>
              <TextLink className="mt-4" href="/learn">
                Learn more →
              </TextLink>
            </div>
            <div className="relative min-h-[400px] overflow-hidden border-2 border-ink bg-paper max-lg:min-h-[320px]">
              <div className="absolute top-1/2 left-1/2 size-[220px] -translate-1/2 rounded-full bg-coral shadow-[14px_-12px_0_var(--color-brand-yellow),-14px_14px_0_var(--color-brand-blue)]"></div>
              <div className={cn(artTag, "top-[10%] left-[6%] -rotate-3")}>
                Political change
              </div>
              <div className={cn(artTag, "top-[20%] right-[6%] rotate-3")}>
                AI safety
              </div>
              <div className={cn(artTag, "bottom-[12%] left-[10%] rotate-2")}>
                Democracy
              </div>
            </div>
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            section,
            "bg-paper",
          )}
          id="about-you"
        >
          <FunLayer>
            <Doodle className="top-[8%] left-[5%] -rotate-8 text-ink">
              <Bird />
            </Doodle>
            <Doodle className="top-[16%] left-[13%] scale-70 rotate-6 text-ink">
              <Bird />
            </Doodle>
            <Doodle className="right-[6%] bottom-[12%] w-14 text-brand-yellow">
              <Moon size={56} />
            </Doodle>
          </FunLayer>
          <Container className="grid grid-cols-2 items-start gap-16 max-lg:grid-cols-1">
            <div>
              <Label tone="yellow">About you</Label>
              <h2 className={cn(h2)}>
                We&apos;re looking for people who{" "}
                <span className="ink-underline ink-underline-brand-yellow">
                  care deeply.
                </span>
              </h2>
              <p className="mt-6 font-semibold text-ink italic">
                We look for enthusiasm, dedication, and a desire to grow.
              </p>
            </div>
            <FocusList
              items={[
                { title: "Care deeply about technology and society" },
                {
                  title: "Are inspired by activism as a tool for social change",
                },
                { title: "Can work consistently for 3-5 hours a week" },
              ]}
            />
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            section,
            "bg-white",
          )}
          id="roles"
        >
          <Container>
            <Label tone="coral">Roles</Label>
            <h2 className={cn(h2)}>
              Four{" "}
              <span className="ink-underline ink-underline-brand-purple">
                workstreams,
              </span>{" "}
              one movement.
            </h2>
            <Deck size="compact" className="mt-6 max-w-lg">
              We are currently looking for people to work on four primary
              workstreams.
            </Deck>
            <div className="mt-11 border-t-2 border-ink">
              {fellowshipRoles.map((role, index) => (
                <details
                  className={cn("group", "relative border-b-2 border-ink")}
                  key={role.title}
                  open={index === 0}
                >
                  <summary
                    className={cn(
                      "relative flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-6 gap-y-4 pt-6 pr-11 pb-6 pl-5 max-sm:pt-5 max-sm:pr-10 max-sm:pb-5 max-sm:pl-4 [&::-webkit-details-marker]:hidden",
                      "before:absolute before:inset-y-0 before:left-0 before:w-2 before:content-['']",
                      roleColors[index % roleColors.length],
                    )}
                  >
                    <span className="pl-3.5 font-display text-2xl font-extrabold tracking-normal uppercase max-sm:pl-2.5 max-sm:text-xl xl:text-4xl">
                      {role.title}
                    </span>
                    <span className="border-2 border-ink px-2 py-1 text-xs font-black tracking-wider whitespace-nowrap uppercase">
                      Remote-friendly
                    </span>
                    <span
                      className="absolute top-7 right-[22px] grid size-[22px] place-items-center border-2 border-ink text-sm font-black after:content-['+'] group-open:after:content-['–'] max-sm:top-[22px] max-sm:right-[18px]"
                      aria-hidden="true"
                    ></span>
                  </summary>
                  <div className="pt-0 pr-5 pb-8 pl-11 max-sm:pr-4 max-sm:pb-6 max-sm:pl-8">
                    <p className="max-w-3xl text-base leading-normal font-medium">
                      {role.description}
                    </p>
                    <span className="mx-0 mt-5 mb-2.5 block text-xs font-black tracking-widest text-coral-dark uppercase">
                      Example activities
                    </span>
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {role.activities.map((activity) => (
                        <li
                          className="relative pl-4 text-base leading-normal font-semibold before:absolute before:left-0 before:text-ink before:opacity-50 before:content-['–']"
                          key={activity}
                        >
                          {activity}
                        </li>
                      ))}
                    </ul>
                    {role.note && (
                      <p className="mt-4 max-w-3xl font-semibold text-ink italic">
                        {role.note}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
        <section
          className={
            "relative overflow-hidden border-b-2 border-ink bg-coral px-0 py-14 max-sm:scroll-mt-20"
          }
        >
          <FunLayer>
            <Doodle className="top-[22%] left-[4%] w-[30px] -rotate-6 text-ink">
              <Zap size={30} />
            </Doodle>
            <Doodle className="right-[8%] bottom-[18%] w-[60px] text-ink">
              <Pow size={60} />
            </Doodle>
          </FunLayer>
          <Container className="flex flex-wrap items-center justify-between gap-6 max-sm:flex-col max-sm:items-start">
            <p className="m-0 max-w-md font-display text-2xl leading-none font-extrabold uppercase xl:text-4xl">
              Find your voice, find some friends, and fight like hell.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["Rolling cohorts", "12 weeks", "3–5 hrs / week"].map((pill) => (
                <span
                  className="bg-ink px-3.5 py-2.5 text-xs font-black tracking-wider text-white uppercase"
                  key={pill}
                >
                  {pill}
                </span>
              ))}
            </div>
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            section,
            "bg-paper",
          )}
          id="benefits"
        >
          <FunLayer>
            <Doodle className="top-[20%] right-[10%] rotate-8 text-ink">
              <Bird />
            </Doodle>
            <Doodle className="right-[4%] bottom-[16%] w-3.5 -rotate-10 text-coral">
              <Star size={14} />
            </Doodle>
          </FunLayer>
          <Container className="grid grid-cols-2 items-start gap-16 max-lg:grid-cols-1">
            <div>
              <Label tone="coral">Benefits</Label>
              <h2 className={cn(h2)}>
                What you{" "}
                <span className="ink-underline ink-underline-brand-blue">
                  receive.
                </span>
              </h2>
            </div>
            <div>
              <Deck size="compact" className="mx-0 mt-6 mb-0 max-w-xl">
                This is a volunteer program, but we provide support (travel,
                meals) for in-person activities, and will reimburse
                organizational expenses. Strong fellows may be invited to extend
                after the initial term.
              </Deck>
            </div>
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            section,
            "bg-white",
          )}
          id="faq"
        >
          <Container>
            <Label tone="coral">FAQ</Label>
            <h2 className={cn(h2)}>
              Questions,{" "}
              <span className="ink-underline ink-underline-brand-purple">
                answered.
              </span>
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
                <div className="mb-3.5 overflow-x-auto">
                  <table className="w-full border-collapse text-sm [&_:is(th,td)]:border-b [&_:is(th,td)]:border-rule [&_:is(th,td)]:py-2.5 [&_:is(th,td)]:pr-4 [&_:is(th,td)]:pl-0 [&_:is(th,td)]:text-left [&_:is(th,td)]:align-top [&_th]:text-xs [&_th]:font-black [&_th]:tracking-wider [&_th]:text-coral-dark [&_th]:uppercase">
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
            <h2 className={cn(h2)}>
              We&apos;re excited to{" "}
              <span className="marker">hear from you.</span>
            </h2>
            <Deck size="compact" className="mx-0 mt-6 mb-7 max-w-md">
              Interested in the fellowship? Leave your email and we&apos;ll be
              in touch about opportunities and next steps.
            </Deck>
            <ActionLink variant="primary" href="#signup">
              Express interest →
            </ActionLink>
            <p className="mt-4 text-base font-semibold text-ink italic">
              Questions? Email rohan@sapiensfirst.org
            </p>
          </ClosingCopy>
          <SignupPanel>
            <FunLayer>
              <Doodle className="top-[10%] left-[8%] -rotate-6 text-white">
                <Bird />
              </Doodle>
              <Doodle className="top-[20%] left-[20%] scale-65 rotate-6 text-white">
                <Bird />
              </Doodle>
            </FunLayer>
            <Label className="relative z-2 mb-6 w-max" tone="coral">
              Rolling Cohorts
            </Label>
            <div className="relative z-2 font-display text-5xl leading-none font-extrabold text-coral uppercase max-sm:text-5xl lg:text-7xl xl:text-8xl">
              Always
              <br />
              Open
            </div>
            <p className="relative z-2 mx-0 mt-4 mb-5 max-w-sm text-base leading-normal font-semibold text-white">
              Leave your email to hear about fellowship opportunities and next
              steps.
            </p>
            <SignupForm
              className="relative z-2"
              interest="fellowship"
              buttonText="Keep me posted →"
            />
          </SignupPanel>
        </ClosingSection>
      </main>
    </>
  );
}
