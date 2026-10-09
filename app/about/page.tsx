import { pageMetadata } from "@/lib/site";
import CycleNodes from "@/components/about/CycleNodes";
import { TextLink } from "@/components/ui/Action";
import {
  HeroCollage,
  HeroCopy,
  HeroLede,
  SplitHero,
} from "@/components/sections/SplitSection";
import { Deck, Kicker, Label } from "@/components/ui/Text";
import { Container } from "@/components/layout/Container";
import Image from "next/image";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn about Sapiens First — who we are, what we do, and the values that guide our fight for humanity's future.",
  path: "/about",
});

const h2 = "text-4xl lg:text-5xl xl:text-6xl max-sm:text-5xl";
const aboutSection = "border-b-2 border-ink bg-white px-0 py-24 max-sm:py-14";
const aboutGrid = "grid grid-cols-2 items-start gap-16 max-lg:grid-cols-1";
const aboutArt =
  "relative min-h-[400px] overflow-hidden border-2 border-ink bg-paper max-lg:min-h-[320px]";
const artTag =
  "absolute border-2 border-ink bg-white px-[13px] py-2.5 text-xs font-black uppercase";

const focusAreas = [
  {
    title: "Democratic Renewal",
    border: "border-coral",
    text: "AI will have profound impacts on our democratic institutions. Done wrong, AI could empower authoritarians to violate our civil liberties; corrupt politicians through rampant wealth inequality; sully public discourse with deepfakes, addictive technology, and sensationalist media. We believe that instead, AI should enhance democratic institutions, and empower ordinary citizens to have greater participation in public life.",
  },
  {
    title: "Common Prosperity",
    border: "border-brand-blue",
    text: "The gains from AI will be vast, and must be shared broadly across society. Currently, wealth gains from AI have concentrated in the hands of the rich few. We believe that it should be instead used to uplift all people in society through redistribution and a reinvestment in public institutions. We also believe that AI should reduce dysfunction in government, and should be used to accelerate advances in science and technology.",
  },
  {
    title: "A Secure Future",
    border: "border-brand-purple",
    text: "Cutting-edge artificial intelligence has the potential to cause mass devastation if left unchecked. To combat this, major powers must cooperate to lead the development of safe superintelligence. Frontier AI must be developed transparently, and we should have the best scientists working to ensure AI remains under human control. Additionally, we must have civil society input on AI governance, so that the power of superintelligence benefits all of humanity.",
  },
];

const strategySteps = [
  {
    title: "Local chapters",
    color: "bg-brand-yellow",
    icon: (
      <>
        <circle cx="18" cy="9" r="4"></circle>
        <path d="M10 26v-7c0-7 16-7 16 0v7M5 14v12M31 14v12M14 26v6M22 26v6"></path>
      </>
    ),
  },
  {
    title: "City campaigns",
    color: "bg-[#bcd8ff]",
    icon: (
      <path d="M5 14h8L29 7v22l-16-7H5zM11 22l3 10h6l-3-9M32 15h2M32 21h2"></path>
    ),
  },
  {
    title: "Statewide movement",
    color: "bg-coral",
    icon: (
      <path d="M3 13L18 4l15 9zM7 16v13M14 16v13M22 16v13M29 16v13M3 32h30"></path>
    ),
  },
];

const socials = [
  {
    label: "X / Twitter",
    href: "https://x.com/rohantohab",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/therohanprasad/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function Page() {
  return (
    <>
      <main>
        <SplitHero>
          <HeroCopy>
            <Kicker>About Sapiens First</Kicker>
            <h1 className="relative z-2 max-w-xs font-display text-6xl font-extrabold tracking-tight uppercase max-sm:tracking-tighter sm:max-w-md lg:max-w-xl lg:text-8xl">
              We are the human{" "}
              <span className="ink-underline whitespace-nowrap ink-underline-brand-yellow">
                movement.
              </span>
            </h1>
            <HeroLede>
              We build political power to make sure artificial intelligence
              benefits the common good.
            </HeroLede>
            <a
              className="relative z-2 mt-4 inline-block w-max border-b-2 border-ink pb-0.5 font-body text-xs font-black tracking-widest uppercase"
              href="#vision"
            >
              Read more →
            </a>
            <HeroLede className="text-ink italic">
              Non-profit · Founded 2026 · Volunteer-powered
            </HeroLede>
          </HeroCopy>
          <HeroCollage />
        </SplitHero>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            aboutSection,
          )}
          id="vision"
        >
          <Container className={aboutGrid}>
            <div>
              <Label tone="coral">Vision</Label>
              <h2 className={cn(h2, "mt-5")}>
                We imagine tech for the{" "}
                <span className="ink-underline ink-underline-brand-blue">
                  common good.
                </span>
              </h2>
              <Deck size="compact" className="mx-0 mt-6 mb-0 max-w-md">
                AI will reshape democracy, prosperity, and security. We&apos;re
                building the political power to make sure it reshapes them for
                the better.
              </Deck>
              <TextLink className="mt-4" href="/policy">
                Read our Recommendations →
              </TextLink>
            </div>
            <div className={aboutArt}>
              <div className="absolute top-1/2 left-1/2 size-[220px] -translate-1/2 rounded-full bg-coral shadow-[14px_-12px_0_var(--color-brand-yellow),-14px_14px_0_var(--color-brand-blue)]"></div>
              <div className={cn(artTag, "top-[10%] left-[6%] -rotate-3")}>
                Democratic Renewal
              </div>
              <div className={cn(artTag, "top-[20%] right-[6%] rotate-3")}>
                Common Prosperity
              </div>
              <div className={cn(artTag, "bottom-[12%] left-[10%] rotate-2")}>
                A Secure Future
              </div>
            </div>
          </Container>
          <Container>
            <details
              className={cn("group", "mt-11 border-t-2 border-b-2 border-ink")}
              id="focus-areas"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-0 py-6 font-display text-2xl leading-tight font-extrabold uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue xl:text-3xl [&::-webkit-details-marker]:hidden">
                Our focus areas{" "}
                <span
                  aria-hidden="true"
                  className="after:content-['+'] group-open:after:content-['−']"
                ></span>
              </summary>
              {focusAreas.map((area) => (
                <article
                  className={cn(
                    "mt-0 mb-7 border-l-6 pt-0 pr-0 pb-0 pl-5",
                    area.border,
                  )}
                  key={area.title}
                >
                  <h3 className="mb-3.5 font-display text-2xl leading-tight font-extrabold uppercase xl:text-3xl">
                    {area.title}
                  </h3>
                  <p className="max-w-4xl text-base leading-normal">
                    {area.text}
                  </p>
                </article>
              ))}
            </details>
          </Container>
        </section>
        <section
          className="border-b-2 border-ink bg-[#e5efff] py-[100px] max-sm:scroll-mt-20 max-sm:py-16"
          id="roadmap"
        >
          <Container>
            <Label tone="blue">Our Plan</Label>
            <h2 className={cn(h2, "mt-[18px]")}>
              City by city,{" "}
              <span className="ink-underline ink-underline-brand-blue">
                state by state.
              </span>
            </h2>
            <Deck size="compact" className="mt-6 max-w-3xl">
              We build local chapters, press city councils to act on AI, and
              bring that momentum together to win policy in California.
            </Deck>
            <ol className="mt-14 grid list-none grid-cols-3 gap-12 p-0 max-sm:grid-cols-1 max-sm:gap-14">
              {strategySteps.map((step, index) => (
                <li
                  className={cn(
                    "relative text-center",
                    index > 0 &&
                      "before:absolute before:top-8 before:-left-10 before:text-3xl before:leading-none before:content-['→'] max-sm:before:-top-11 max-sm:before:left-1/2 max-sm:before:-translate-x-1/2 max-sm:before:content-['↓']",
                  )}
                  key={step.title}
                >
                  <span
                    className={cn(
                      "mx-auto mt-0 mb-6 grid size-[100px] place-items-center rounded-full border-2 border-ink shadow-[3px_3px_0_var(--color-ink)]",
                      step.color,
                    )}
                    aria-hidden="true"
                  >
                    <svg
                      className="size-[54px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                      viewBox="0 0 36 36"
                    >
                      {step.icon}
                    </svg>
                  </span>
                  <h3 className="m-0 font-display text-3xl leading-tight font-extrabold text-balance uppercase">
                    {step.title}
                  </h3>
                </li>
              ))}
            </ol>
          </Container>
        </section>
        <section
          className="border-b-2 border-ink bg-white px-0 py-24 max-sm:scroll-mt-20 max-sm:py-16"
          id="strategy"
        >
          <Container>
            <Label tone="purple">Strategy</Label>
            <h2 className={cn(h2, "mt-5")}>
              We build{" "}
              <span className="ink-underline ink-underline-brand-purple">
                movement power.
              </span>
            </h2>
            <Deck size="compact" className="mt-8 max-w-3xl">
              We believe power comes from the bottom-up. We build movement power
              through a cycle of civic engagement.
            </Deck>
            <div
              className="relative mx-auto mt-12 mb-3 aspect-[380/330] w-full max-w-md max-sm:mt-10 max-sm:mb-2 max-sm:max-w-xs"
              role="group"
              aria-label="Act, Recruit, Train cycle"
            >
              <svg
                className="absolute inset-0 h-full w-full overflow-visible [&_path]:fill-none [&_path]:stroke-ink [&_path]:stroke-3"
                viewBox="0 0 380 330"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="cycle-arrowhead"
                    markerWidth="9"
                    markerHeight="9"
                    refX="6.5"
                    refY="3.5"
                    orient="auto"
                  >
                    <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--color-ink)"></path>
                  </marker>
                </defs>
                <path
                  d="M230 118 C258 142 282 174 294 210"
                  markerEnd="url(#cycle-arrowhead)"
                ></path>
                <path
                  d="M246 262 C210 282 168 282 132 262"
                  markerEnd="url(#cycle-arrowhead)"
                ></path>
                <path
                  d="M88 210 C100 174 124 142 152 118"
                  markerEnd="url(#cycle-arrowhead)"
                ></path>
              </svg>
              <div className="absolute top-[62%] left-1/2 z-2 -translate-1/2 -rotate-2 border-2 border-ink bg-white px-4 py-2.5 text-center font-display text-base leading-tight font-extrabold tracking-wider whitespace-nowrap uppercase shadow-[5px_5px_0_var(--color-ink)] max-sm:px-3 max-sm:py-2 max-sm:text-sm">
                Movement
                <br />
                power
              </div>
              <CycleNodes />
            </div>
            <TextLink className="mt-8 ml-auto block w-max" href="/learn">
              Read the Guide →
            </TextLink>
          </Container>
        </section>
        <section
          className={cn(
            "border-b-2 border-ink max-sm:scroll-mt-20",
            aboutSection,
          )}
          id="founder"
        >
          <Container className={aboutGrid}>
            <div
              className={cn(
                aboutArt,
                "aspect-[4/5] min-h-0 w-[min(100%,320px)] justify-self-center max-lg:min-h-0 max-sm:aspect-square",
              )}
            >
              <Image
                className="object-cover object-[50%_32%]"
                src="/assets/rohan-prasad.jpg"
                alt="Rohan Prasad, founder of Sapiens First"
                fill
                sizes="(max-width: 340px) calc(100vw - 24px), 320px"
              />
            </div>
            <div>
              <Label tone="yellow">Founder</Label>
              <h2 className={cn(h2, "mt-5")}>
                Rohan Prasad{" "}
                <span className="ink-underline ink-underline-brand-yellow after:w-[min(100%,3.5em)]">
                  Executive Director.
                </span>
              </h2>
              <Deck size="compact" className="mx-0 mt-6 mb-0 max-w-md">
                Rohan founded Sapiens First because he realized no one was doing
                anything about the AI Crisis. Previously, Rohan worked as an AI
                safety researcher at Constellation Institute, was an English
                teacher in Taiwan, and was a community organizer for animal
                rights. He likes to{" "}
                <a
                  href="https://www.rohanprasad.org"
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  blog
                </a>
                , play guitar, and run barefoot.
              </Deck>
              <div className="mt-6 flex gap-2.5">
                {socials.map((social) => (
                  <a
                    className="inline-flex size-[42px] items-center justify-center border-2 border-ink bg-white text-ink transition-[background-color,color,translate] duration-150 hover:-translate-y-0.5 hover:bg-coral hover:text-white"
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={social.label}
                    key={social.label}
                  >
                    <svg
                      className="block size-[18px]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={social.path}></path>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
