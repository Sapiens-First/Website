import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import {
  HeroArt,
  HeroCopy,
  SplitHero,
} from "@/components/sections/SplitSection";
import { Container } from "@/components/layout/Container";
import { Deck, Label } from "@/components/ui/Text";
import { starClip } from "@/components/ui/Doodles";
import { CrisisSky, crisisSky } from "@/components/home/story/CrisisSky";
import { HeroEmbers } from "@/components/home/story/HeroEmbers";
import { VisionDaybreak } from "@/components/home/story/VisionDaybreak";
import { StepNetwork } from "@/components/home/story/StepNetwork";
import {
  InvolvedFire,
  involvedFire,
} from "@/components/home/story/InvolvedFire";
import Image from "next/image";
import StatGrid from "@/components/home/StatGrid";
import NtkFeature from "@/components/home/NtkFeature";
import { ActionLink } from "@/components/ui/button";
import { DiscordMark } from "@/components/DiscordMark";
import { join, joinLinkProps } from "@/lib/community";
import InterestForm from "@/components/members/InterestForm";
import { cn } from "@/lib/cn";

const stars = [
  ["28%", "9%", "5.6px"],
  ["61%", "16%", "7.7px"],
  ["43%", "23%", "9.8px"],
  ["78%", "30%", "5.6px"],
  ["32%", "37%", "7.7px"],
  ["67%", "44%", "9.8px"],
  ["48%", "51%", "5.6px"],
  ["82%", "58%", "7.7px"],
  ["36%", "65%", "9.8px"],
  ["71%", "72%", "5.6px"],
  ["53%", "79%", "11.2px"],
  ["25%", "86%", "7px"],
] as const;

const steps = [
  { title: "Local groups", underline: "after:bg-coral" },
  { title: "State campaigns", underline: "after:bg-brand-blue" },
  { title: "Federal action", underline: "after:bg-brand-purple" },
];

const h2 = "mt-5 text-5xl lg:text-6xl xl:text-7xl";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Sapiens First — Building the Pro-Human Movement" },
  description:
    "Sapiens First is building the pro-human movement. Stand up to Big Tech, fight for democracy, and join our No Tech Kings campaign.",
  path: "/",
});

export default function Page() {
  return (
    <>
      <main>
        <SplitHero>
          <HeroCopy
            circle={false}
            className="isolate before:pointer-events-none before:absolute before:top-[16%] before:right-[-20%] before:z-0 before:aspect-1000/589 before:w-[112%] before:-rotate-9 before:content-[''] before:[background:radial-gradient(circle,color-mix(in_srgb,var(--color-coral)_25%,transparent)_1px,transparent_1.3px)_0_0/5px_5px,color-mix(in_srgb,var(--color-coral)_5.5%,transparent)] before:[mask:url(/assets/us.svg)_center/contain_no-repeat] max-sm:before:top-[13%] max-sm:before:right-[-26%] max-sm:before:w-[120%]"
          >
            <HeroEmbers />
            <h1 className="relative z-2 font-display text-7xl font-extrabold tracking-tight uppercase max-sm:text-6xl max-sm:tracking-tighter lg:text-7xl 2xl:text-8xl">
              Revolt for{" "}
              <span className="inline-block -rotate-2 bg-brand-yellow px-[0.08em] leading-none text-ink">
                our future.
              </span>
            </h1>
            <p className="relative z-2 mx-0 mt-8 mb-7 max-w-md font-body text-xl leading-snug font-bold max-sm:my-6 max-sm:leading-normal lg:text-2xl xl:text-3xl">
              Stand up to Big Tech and fight for democracy.
            </p>
            <InterestForm interest="membership" />
          </HeroCopy>
          <HeroArt className="bg-coral after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_38%),linear-gradient(0deg,color-mix(in_srgb,var(--color-coral)_18%,transparent),transparent_48%)] after:mix-blend-screen after:content-[''] max-lg:min-h-130 max-sm:min-h-97.5 sm:max-md:min-h-115">
            <Image
              className="absolute inset-0 h-full w-full object-cover object-[55%_68%] brightness-108 contrast-93 saturate-108 max-sm:object-[54%_72%]"
              src="/assets/homepage-hero-photo.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              preload
            />
          </HeroArt>
        </SplitHero>

        <section className="border-b-2 border-ink bg-white">
          <div className="relative overflow-hidden bg-black px-7 py-20 font-display text-4xl leading-none tracking-tighter text-white max-sm:px-5 max-sm:py-11 max-sm:text-4xl sm:px-12 lg:px-20 lg:py-24 lg:text-5xl xl:text-6xl">
            <CrisisSky />
            <svg
              className="pointer-events-none absolute top-25 right-[5%] z-0 h-auto w-[clamp(300px,39vw,560px)] -rotate-12 text-brand-blue opacity-42 max-sm:top-17 max-sm:-right-27.5 max-sm:w-[320px] max-sm:opacity-18"
              viewBox="0 0 400 400"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <clipPath id="crisis-earth-disc">
                  <circle cx="200" cy="200" r="170"></circle>
                </clipPath>
              </defs>
              <circle
                cx="200"
                cy="200"
                r="170"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              ></circle>
              <g clipPath="url(#crisis-earth-disc)">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity=".4"
                >
                  <ellipse cx="200" cy="200" rx="86" ry="170"></ellipse>
                  <ellipse cx="200" cy="200" rx="170" ry="62"></ellipse>
                  <path d="M200 30V370M30 200H370M58 108Q200 163 342 108M58 292Q200 237 342 292"></path>
                </g>

                <g
                  fill="currentColor"
                  fillOpacity={0.22}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M35 113L65 82L106 64L142 72L157 94L145 110L160 126L141 146L124 148L114 169L99 177L112 194L128 201L137 220L125 226L110 207L94 199L82 174L64 165L51 145L31 141Z"></path>
                  <path d="M136 220L159 215L183 231L197 253L181 279L176 305L160 325L150 350L139 337L140 308L129 282L116 261L118 237Z"></path>
                  <path d="M173 43L204 39L217 54L205 78L188 91L173 76Z"></path>
                  <path d="M237 103L250 80L266 69L273 92L288 94L304 81L339 89L372 118L383 158L356 172L336 159L321 173L305 149L287 154L275 139L254 144L245 128L227 130L224 115Z"></path>
                  <path d="M240 154L272 151L287 170L302 185L286 213L281 244L264 265L249 253L242 226L225 211L217 189L223 167Z"></path>
                  <path d="M302 256L311 274L305 292L298 280ZM334 280L360 270L381 291L366 315L339 310L324 296Z"></path>
                </g>
              </g>
            </svg>
            <div className="relative z-2">
              <Label className="relative z-2 mb-7 w-max" size="section">
                Crisis
              </Label>
              <div className="relative z-2 max-w-xl font-extrabold uppercase">
                Artificial intelligence is threatening the future of{" "}
                <em className={cn("text-coral not-italic", crisisSky.glow)}>
                  <span className="relative inline-block after:absolute after:right-[-0.02em] after:bottom-[-0.07em] after:left-0 after:h-[0.12em] after:-rotate-2 after:bg-coral after:content-[''] after:[clip-path:polygon(0_25%,96%_0,100%_65%,4%_100%)]">
                    humanity.
                  </span>
                </em>
              </div>
              <div
                className={cn(
                  "pointer-events-none absolute -top-20 right-[calc(clamp(300px,39vw,560px)*1.1+16px-2vw)] -bottom-16 left-0 z-1 max-sm:-top-11 max-sm:right-60 max-sm:-bottom-8",
                  crisisSky.stars,
                )}
                aria-hidden="true"
              >
                {stars.map(([left, top, size]) => (
                  <i
                    className={cn("absolute block bg-brand-yellow", starClip)}
                    key={top}
                    style={{ left, top, width: size, height: size }}
                  />
                ))}
              </div>
            </div>
            <StatGrid />
          </div>
        </section>

        <section
          className="relative overflow-hidden border-b-2 border-ink bg-paper px-0 py-28 max-sm:scroll-mt-20 max-sm:px-0 max-sm:py-14"
          id="vision"
        >
          <VisionDaybreak />
          <Container className="relative z-1">
            <div>
              <Label tone="yellow" size="section">
                Vision
              </Label>
              <h2 className={cn(h2)}>
                Technology for the{" "}
                <span className="ink-underline ink-underline-brand-blue">
                  common good.
                </span>
              </h2>
              <Deck className="mx-0 mt-8 mb-0 leading-normal max-sm:mt-5">
                We imagine a world where technology serves the people, not just
                a rich few.
              </Deck>
            </div>
            <div className="mt-5 max-sm:mt-4">
              <NtkFeature />
            </div>
          </Container>
        </section>

        <section
          className="relative overflow-hidden border-b-2 border-ink bg-white bg-[url(/assets/homepage-strategy-contours.svg)] bg-size-[1000px_600px] bg-position-[right_-100px_top_-160px] bg-no-repeat px-0 pt-20 pb-0 max-sm:scroll-mt-20 max-sm:bg-position-[right_-360px_top_-120px] max-sm:pt-12"
          id="strategy"
        >
          <Container className="grid grid-cols-2 items-center gap-12 max-lg:grid-cols-1 max-lg:gap-8 max-sm:gap-5 max-sm:pb-8">
            <div>
              <Label tone="coral" size="section">
                Strategy
              </Label>
              <h2 className={cn(h2, "font-bold tracking-tight")}>
                We build movement{" "}
                <span className="relative inline-block -rotate-2 bg-brand-blue-dark px-[0.09em] pt-[0.02em] pb-[0.04em] leading-none text-white shadow-[0.045em_0.045em_0_var(--color-ink)]">
                  power.
                </span>
              </h2>
            </div>
            <div>
              <Deck className="m-0 max-w-md leading-normal">
                We fight for revolutionary political change around technology.
                We start in our cities and schools, building towards state and
                federal action.
              </Deck>
            </div>
          </Container>
          <div className="relative isolate mt-12 grid grid-cols-3 border-t-2 border-ink before:absolute before:inset-0 before:-z-1 before:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-coral-soft)_91%,transparent),color-mix(in_srgb,var(--color-paper)_84%,transparent),rgba(255,255,255,0.68))] before:content-[''] after:absolute after:inset-0 after:-z-1 after:bg-[radial-gradient(var(--color-ink)_0.8px,transparent_0.8px)] after:bg-size-[5px_5px] after:opacity-15 after:content-[''] max-lg:grid-cols-1 max-sm:mt-0 max-sm:before:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-coral-soft)_90%,transparent),color-mix(in_srgb,var(--color-paper)_82%,transparent),rgba(255,255,255,0.7))]">
            {steps.map((step, index) => (
              <div
                className={cn(
                  "relative border-ink px-9 pt-11 pb-12 max-lg:flex max-lg:items-start max-lg:gap-6 max-lg:pt-9 max-lg:pb-11 max-sm:gap-5 max-sm:px-6 max-sm:pt-8 max-sm:pb-9",
                  index < steps.length - 1 &&
                    "border-r-2 max-lg:border-r-0 max-lg:border-b-2",
                )}
                key={step.title}
              >
                <StepNetwork step={index as 0 | 1 | 2} />
                <small className="mb-7 block font-display text-5xl leading-none font-extrabold tracking-tighter text-coral-dark uppercase max-lg:mb-0 xl:text-6xl">
                  {String(index + 1).padStart(2, "0")}
                </small>
                <h3
                  className={cn(
                    "relative m-0 inline-block font-display text-3xl leading-none font-extrabold tracking-tighter uppercase after:absolute after:inset-x-0 after:-bottom-2 after:h-1 after:rounded-full after:content-[''] max-sm:text-3xl xl:text-4xl",
                    step.underline,
                  )}
                >
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        <section
          className="grid grid-cols-2 border-b-2 border-ink bg-paper max-lg:grid-cols-1 max-sm:scroll-mt-20"
          id="involved"
        >
          <div className="relative overflow-hidden bg-[url(/assets/homepage-involved-arcs.svg)] bg-size-[900px_900px] bg-position-[right_-460px_bottom_-470px] bg-no-repeat px-7 py-20 max-sm:bg-position-[right_-520px_bottom_-510px] max-sm:pt-14 max-sm:pr-5 max-sm:pb-11 max-sm:pl-5 sm:px-12 lg:px-20 lg:py-24">
            <InvolvedFire />
            <Label className="relative z-2" tone="purple">
              Get involved
            </Label>
            <h2 className={cn(h2, "relative z-2 leading-none tracking-tight")}>
              Dare to{" "}
              <em className="relative isolate inline-block text-ink not-italic before:pointer-events-none before:absolute before:inset-[-5%_-0.1em_-7%] before:-z-1 before:-rotate-3 before:bg-coral before:content-[''] before:[clip-path:polygon(0_12%,16%_5%,37%_9%,63%_0,84%_6%,100%_2%,97%_35%,100%_69%,97%_91%,76%_96%,53%_90%,28%_100%,3%_92%,5%_60%)]">
                fight
              </em>{" "}
              for a brighter future.
            </h2>
            <Deck className="relative z-2 mx-0 mt-2 mb-5 leading-normal lg:text-xl xl:text-2xl">
              <strong>Connect to your local group today.</strong>
            </Deck>
            <ActionLink
              href={join.href}
              {...joinLinkProps}
              variant="primary"
              className={cn("w-max gap-2.5", involvedFire.button)}
            >
              <DiscordMark />
              {join.label} ↗
            </ActionLink>
            <p className="relative z-2 mt-3 max-w-sm text-sm text-ink/75">
              {join.note}
            </p>
          </div>
          <div className="relative flex min-h-128 flex-col justify-end overflow-hidden border-ink bg-[linear-gradient(180deg,rgba(24,37,31,0.08)_15%,rgba(24,37,31,0.9)_100%),url(/assets/homepage-quote-texture.png)] bg-cover bg-position-[48%_center] bg-no-repeat px-14 py-16 text-white before:absolute before:-top-24 before:left-6 before:font-quote before:text-9xl before:leading-none before:text-[color-mix(in_srgb,var(--color-coral)_92%,transparent)] before:content-['\201C'] before:text-shadow-[0_2px_0_var(--color-ink)] after:absolute after:right-8 after:bottom-9 after:h-2.5 after:w-24 after:-rotate-3 after:rounded-full after:bg-brand-yellow after:content-[''] max-lg:border-t-2 max-sm:min-h-72 max-sm:bg-position-[51%_center] max-sm:px-5 max-sm:py-10 max-sm:before:-top-12 max-sm:before:left-3 max-sm:after:right-5 max-sm:after:bottom-6 max-sm:after:h-1.5 max-sm:after:w-16 sm:max-md:min-h-120 lg:border-l-2">
            <blockquote className="relative z-2 m-0 border-l-8 border-coral bg-ink/76 p-6 font-quote text-3xl leading-tight font-medium tracking-tight shadow-[14px_14px_0_color-mix(in_srgb,var(--color-coral)_24%,transparent)] text-shadow-[0_2px_18px_rgba(0,0,0,0.75)] max-sm:border-l-6 max-sm:p-4 max-sm:text-3xl max-sm:shadow-[9px_9px_0_color-mix(in_srgb,var(--color-coral)_24%,transparent)] lg:text-4xl xl:text-5xl">
              “It always seems impossible until it is done.”
              <cite className="mt-6 block font-body text-base leading-normal font-bold tracking-wider text-white uppercase not-italic">
                Nelson Mandela
              </cite>
            </blockquote>
          </div>
        </section>
      </main>
    </>
  );
}
