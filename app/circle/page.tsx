import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import CircleHeroArt from "@/components/circle/CircleHeroArt";
import { Container } from "@/components/layout/Container";
import { FaqItem, FaqList } from "@/components/sections/Faq";
import {
  SplitHero,
  ClosingSection,
  ClosingCopy,
  SignupPanel,
  HeroCopy,
  HeroLede,
  FocusList,
} from "@/components/sections/SplitSection";
import { Bird, Doodle, FunLayer, Zap } from "@/components/ui/Doodles";
import { cn } from "@/lib/cn";
import SignupForm from "@/components/SignupForm";
import { ActionLink } from "@/components/ui/Action";
import { Deck, FactPill, Kicker, Label } from "@/components/ui/Text";

export const metadata = pageMetadata({
  title: "Start a Circle",
  description:
    "Create a local home for action on Big Tech and democracy. Start a Circle with mentorship, shared leadership, and a three-month commitment.",
  path: "/circle",
});

const h2 = "mt-5 text-4xl lg:text-5xl xl:text-6xl max-sm:text-5xl";
const section =
  "relative overflow-hidden border-b-2 border-ink py-24 max-sm:py-14";
const grid =
  "grid grid-cols-2 items-start gap-16 max-lg:grid-cols-1 max-sm:gap-9";

const steps = [
  {
    title: "Join Sapiens First",
    color: "text-coral-dark",
    text: (
      <>
        <a href="#signup">Tell us you’re interested</a> in starting a Circle.
        We’ll help you take the next step toward membership and connect you with
        support from the Global team.
      </>
    ),
  },
  {
    title: "Invite two friends",
    color: "text-brand-blue",
    text: "Start with people who care about the issue and can share the work. Two friends is a good starting point, not a requirement. You can find your people along the way.",
  },
  {
    title: "Plan your first gathering",
    color: "text-brand-purple",
    text: "Pick a time and a welcoming place: a library, park, classroom, or someone’s home. Make space to connect, then choose one thing you’d like to do together.",
  },
];

const leadership = [
  {
    title: "Help someone take their first step",
    text: "Invite a member to host a gathering, welcome someone new, or try an idea they care about. Give them encouragement and room to make it their own.",
  },
  {
    title: "Build it together",
    text: "Share the work as people find their feet. A Circle gets stronger when more people feel able to contribute and lead.",
  },
  {
    title: "Pass it on",
    text: "You can get a Circle going, help someone else grow into leading it, then hand it over. The community you helped build can keep going when you step back.",
  },
];

export default function Page() {
  return (
    <>
      <main>
        <SplitHero>
          <HeroCopy>
            <Kicker>Local people. Shared purpose.</Kicker>
            <h1
              className={
                "relative z-2 max-w-xs font-display text-6xl font-extrabold tracking-tight uppercase max-sm:tracking-tighter sm:max-w-md lg:max-w-xl lg:text-8xl"
              }
            >
              Start a <span className="marker">Circle.</span>
            </h1>
            <HeroLede>
              Create a home for action on Big Tech and democracy.
            </HeroLede>
            <div
              className="relative z-2 mb-7 flex flex-wrap gap-2"
              aria-label="Time commitment"
            >
              <FactPill>3–5 hours a week</FactPill>
              <FactPill>try for 3 months</FactPill>
            </div>
            <SignupForm
              className={"relative z-2 scroll-mt-28"}
              interest="start-a-circle"
              buttonText="I’m interested →"
              id="signup"
            />
            <p className="relative z-2 mx-0 mt-3.5 mb-0 max-w-lg text-sm font-medium text-ink italic">
              Start with a conversation. Expressing interest doesn’t commit you
              to running a Circle.
            </p>
          </HeroCopy>
          <CircleHeroArt />
        </SplitHero>
        <p className="m-0 flex items-center gap-[22px] border-b-2 border-ink bg-coral px-[max(28px,7vw)] py-[30px] font-display text-[clamp(1.6rem,2.7vw,2.7rem)] leading-[1.1] font-extrabold text-ink uppercase max-sm:gap-4 max-sm:px-5 max-sm:py-6">
          <Zap className="h-10 w-[26px] shrink-0" />
          <span>Find your voice, find some friends, and fight like hell.</span>
        </p>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            section,
            "bg-paper",
          )}
          id="why"
        >
          <Container className={grid}>
            <div>
              <Label tone="yellow">What you get</Label>
              <h2 className={cn(h2)}>
                Find your people.
                <br />
                <span className="ink-underline ink-underline-brand-yellow">
                  Make a difference.
                </span>
              </h2>
              <Deck size="compact" className="mx-0 mt-6 mb-0 max-w-xl">
                A Circle is a small local group with a shared purpose. It’s a
                place to turn concern about technology into connection,
                learning, and action.
              </Deck>
            </div>
            <FocusList
              items={[
                {
                  title: "A voice in the future of tech",
                  text: "Bring your community’s concerns into a wider movement. Help shape campaigns and build public pressure for technology that serves people.",
                },
                {
                  title: "Mentorship and guidance",
                  text: "Get support from the Sapiens First Global team and advice from other people starting Circles. You don’t have to figure it all out alone.",
                },
                {
                  title: "Leadership skills, built by doing",
                  text: "Learn to bring people together, facilitate a good conversation, and turn an idea into a plan. Help others take on responsibility as you go.",
                },
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
          id="getting-started"
        >
          <Container>
            <Label tone="blue">Getting started</Label>
            <h2 className={cn(h2)}>
              Start small.
              <br />
              <span className="ink-underline ink-underline-brand-blue">
                Build together.
              </span>
            </h2>
            <ol className="mx-0 mt-11 mb-0 grid list-none grid-cols-3 gap-8 p-0 max-sm:grid-cols-1 max-sm:gap-7">
              {steps.map((step, index) => (
                <li className="border-t-3 border-ink pt-6" key={step.title}>
                  <span
                    className={cn(
                      "font-display text-5xl leading-none font-extrabold",
                      step.color,
                    )}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mx-0 mt-4 mb-3 text-xl">{step.title}</h3>
                  <p className="m-0 text-base leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
        <section
          className={
            "border-b-2 border-ink bg-ink px-0 py-20 text-white max-sm:scroll-mt-20 max-sm:py-14"
          }
          id="shared-leadership"
        >
          <Container className={grid}>
            <div>
              <Label tone="yellow">Room for everyone to lead</Label>
              <h2 className={cn(h2)}>
                Start a Circle.
                <br />
                Grow more leaders.
              </h2>
              <Deck
                size="compact"
                className="mx-0 mt-6 mb-0 max-w-lg text-white"
              >
                We’re building a movement with abundant leadership. Starting a
                Circle means helping others find their confidence, bring their
                ideas, and take the lead alongside you.
              </Deck>
            </div>
            <ul className="m-0 list-none border-t border-[#777] p-0">
              {leadership.map((item) => (
                <li
                  className="border-b border-[#777] px-0 py-5"
                  key={item.title}
                >
                  <strong className="mb-1.5 block text-lg text-brand-yellow">
                    {item.title}
                  </strong>
                  <span className="text-base leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
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
            <Label tone="purple">FAQ</Label>
            <h2 className={cn(h2)}>
              Before you{" "}
              <span className="ink-underline ink-underline-brand-yellow">
                begin.
              </span>
            </h2>
            <FaqList>
              <FaqItem
                number={1}
                question={<>How much time am I committing?</>}
                open
              >
                <p>
                  Starting a Circle takes about{" "}
                  <strong>3–5 hours a week</strong>, with an initial commitment
                  of <strong>three months</strong>. After that, you decide
                  whether to continue every six months.
                </p>
                <p>
                  Keep the first few months manageable: bring people together,
                  share the work, and find a rhythm that fits your life.
                </p>
              </FaqItem>
              <FaqItem
                number={2}
                question={<>Do I need experience or a group already?</>}
              >
                <p>
                  No. You can learn as you go, with mentorship and guidance from
                  Sapiens First Global and other Circle organizers. Bringing two
                  reliable friends is recommended, but you can start without
                  them.
                </p>
              </FaqItem>
              <FaqItem
                number={3}
                question={
                  <>Does my Circle have to organize protests or advocacy?</>
                }
              >
                <p>
                  No. You can host a space for thoughtful conversation about
                  technology and democracy. Building trust and connection is a
                  worthwhile place to begin.
                </p>
                <p>
                  Choose a format that fits your community. You can explore
                  advocacy together when it feels right.
                </p>
              </FaqItem>
              <FaqItem
                number={4}
                question={<>What might a Circle do week to week?</>}
              >
                <p>
                  For a Circle focused on advocacy, we suggest three simple
                  habits:
                </p>
                <ul>
                  <li>
                    <strong>Meet regularly.</strong> Make gatherings welcoming,
                    meaningful, and easy to participate in.
                  </li>
                  <li>
                    <strong>Invite new people.</strong> Choose one repeatable
                    way to reach them, such as personal invitations, local
                    outreach, or door-knocking.
                  </li>
                  <li>
                    <strong>Work toward a shared goal.</strong> You might invite
                    people to sign a campaign’s open letter, then join your next
                    meeting.
                  </li>
                </ul>
                <p>
                  Start with what your group can sustain. You can add activities
                  as more people take on roles.
                </p>
              </FaqItem>
              <FaqItem
                number={5}
                question={<>Can we propose our own campaign?</>}
              >
                <p>
                  Yes. You can join a{" "}
                  <Link href="/campaigns">priority campaign</Link> or propose a
                  different campaign that falls within{" "}
                  <Link href="/about">Sapiens First’s focus areas</Link>. Bring
                  your idea to the Global team so you can explore how it fits
                  and what support would help.
                </p>
              </FaqItem>
              <FaqItem
                number={6}
                question={<>Can I start a Circle and hand it over later?</>}
              >
                <p>
                  Yes. You can start a Circle, help others gain confidence, and
                  hand it over when someone is ready to take the lead. You might
                  stay involved as a member or step back.
                </p>
                <p>
                  Share opportunities to lead from the beginning. When you’re
                  ready to move on, talk with your Circle and the Global team
                  about a handover. Helping someone else become a leader is a
                  lasting contribution to the movement.
                </p>
              </FaqItem>
              <FaqItem
                number={7}
                question={<>Can a Circle grow into something bigger?</>}
              >
                <p>
                  Yes. As membership grows, a Circle can develop into a Hub,
                  Chapter, or Alliance:
                </p>
                <ul>
                  <li>
                    <strong>Circle:</strong> up to 10 members
                  </li>
                  <li>
                    <strong>Hub:</strong> up to 50 members
                  </li>
                  <li>
                    <strong>Chapter:</strong> up to 150 members
                  </li>
                  <li>
                    <strong>Alliance:</strong> up to 500 members
                  </li>
                </ul>
                <p>
                  As more people grow into leadership, your group can take on
                  more together. Staying small is fine, too: growth should serve
                  your community and the work you want to do together.
                </p>
              </FaqItem>
            </FaqList>
          </Container>
        </section>
        <ClosingSection id="apply">
          <ClosingCopy>
            <Label tone="purple">Start</Label>
            <h2 className={cn(h2)}>
              Make room for <span className="marker">your people.</span>
            </h2>
            <Deck size="compact" className="mx-0 mt-6 mb-7 max-w-md">
              You don’t need a full team or a perfect plan. Bring your interest,
              and we’ll help you take the first step.
            </Deck>
            <ActionLink variant="primary" href="#signup">
              Express interest →
            </ActionLink>
            <p className="mt-4 text-base font-semibold text-ink italic">
              Questions? <a href="mailto:rohan@sapiensfirst.org">Email Rohan</a>
              .
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
              Start a Circle
            </Label>
            <div className="relative z-2 font-display text-5xl leading-none font-extrabold text-coral uppercase max-sm:text-7xl xl:text-6xl">
              Small start.
              <br />
              Shared purpose.
            </div>
            <p className="relative z-2 mx-0 mt-4 mb-0 max-w-sm text-base leading-normal font-semibold text-white">
              Leave your email and we&apos;ll be in touch about starting a
              Circle in your community.
            </p>
            <SignupForm
              className="relative z-2 mt-5"
              interest="start-a-circle"
              buttonText="I’m interested →"
            />
          </SignupPanel>
        </ClosingSection>
      </main>
    </>
  );
}
