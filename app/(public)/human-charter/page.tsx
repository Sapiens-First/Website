import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Label } from "@/components/ui/Text";
import { ActionLink } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import { NorthStar } from "@/components/charter/story/NorthStar";
import {
  StakesNight,
  stakesNight,
} from "@/components/charter/story/StakesNight";
import InterestForm from "@/components/members/InterestForm";
import { PrincipleGrid } from "@/components/charter/PrincipleGrid";

export const metadata: Metadata = pageMetadata({
  title: "The Human Charter",
  description:
    "The Human Charter — eight principles for a brighter future, organized around Life, Liberty, and the pursuit of Happiness in the age of AI.",
  path: "/human-charter",
});

export default function Page() {
  return (
    <>
      <main>
        <section className="border-b-2 border-ink bg-paper px-7 py-20 text-center max-sm:scroll-mt-20 max-sm:pt-14 max-sm:pr-0 max-sm:pb-12 max-sm:pl-0 sm:px-12 lg:px-20 lg:py-24">
          <Container>
            <NorthStar
              variant="hero"
              className="mx-auto mb-7 w-28 sm:w-36 lg:w-40"
            />
            <div className="mx-auto mt-0 mb-6 inline-block w-max bg-ink px-2.5 py-2 font-body text-xs font-black tracking-widest text-white uppercase">
              The Human Charter · V0.1
            </div>
            <h1 className="relative z-2 mx-auto my-0 max-w-xl text-center font-display text-6xl leading-none font-extrabold tracking-tight uppercase max-sm:max-w-xs max-sm:text-5xl max-sm:tracking-tighter lg:text-8xl xl:text-9xl">
              The Human Charter
            </h1>
            <p className="mx-auto mt-7 mb-0 max-w-md font-body text-xl leading-snug font-bold text-ink lg:text-2xl xl:text-3xl">
              Eight Principles for the Future of Humanity.
            </p>
            <p className="mx-auto mt-5 mb-0 max-w-3xl text-lg leading-normal text-ink">
              Artificial intelligence holds great promise, but also poses grave
              threats to our future. As we confront this historic challenge, we
              offer the Human Charter — eight principles for a brighter future.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 max-sm:gap-2">
              <ActionLink
                className="tracking-wide"
                variant="primary"
                href="#sign"
              >
                Add Your Name →
              </ActionLink>
              <ActionLink
                className="tracking-wide"
                variant="outline"
                href="#principles"
              >
                Read the Principles ↓
              </ActionLink>
            </div>
          </Container>
        </section>
        <section className="relative overflow-hidden border-b-2 border-ink bg-ink max-sm:scroll-mt-20">
          <StakesNight />
          <div className="relative z-1 px-7 py-20 font-display text-4xl leading-none tracking-tight text-white sm:px-12 lg:px-20 lg:py-24 xl:text-5xl">
            <Label className="mb-7 w-max" tone="yellow">
              The Stakes
            </Label>
            <div className="max-w-sm font-extrabold uppercase">
              A brighter future is not guaranteed. It has to be{" "}
              <em className={cn("text-coral not-italic", stakesNight.glow)}>
                fought for.
              </em>
            </div>
          </div>
        </section>
        <section
          className="border-b-2 border-ink bg-paper py-20 max-sm:scroll-mt-20 max-sm:py-14 lg:py-24"
          id="principles"
          aria-labelledby="principles-heading"
        >
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
              <div>
                <Label tone="coral">The Principles</Label>
                <h2
                  className="mt-5 font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                  id="principles-heading"
                >
                  Eight principles.{" "}
                  <span className="ink-underline ink-underline-brand-yellow">
                    Three pillars.
                  </span>
                </h2>
              </div>
              <p className="max-w-xs text-base leading-snug font-semibold">
                Tap a card to read the principle.
              </p>
            </div>
            <PrincipleGrid />
          </Container>
        </section>
        <section
          className="grid grid-cols-2 border-b-2 border-ink bg-paper max-lg:grid-cols-1 max-sm:scroll-mt-20"
          id="sign"
        >
          <div className="relative px-7 py-20 sm:px-12 lg:px-20 lg:py-24">
            <Label tone="yellow">Sign the Charter</Label>
            <h2 className="mt-5 font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl">
              Add your name to the{" "}
              <span className="ink-underline">North Star.</span>
            </h2>
            <p className="mx-0 mt-6 mb-7 max-w-sm font-body text-xl leading-snug text-ink lg:text-2xl xl:text-3xl">
              <strong>Join the movement fighting for these principles.</strong>
            </p>
            <InterestForm interest="membership" submitLabel="Add my name →" />
          </div>
          <div className="relative flex min-h-112 flex-col justify-end overflow-hidden border-l-2 border-solid border-l-ink bg-ink px-14 py-16 text-white before:absolute before:-top-24 before:left-6 before:font-quote before:text-9xl before:leading-none before:text-coral before:content-['\201C'] max-lg:border-t-2 max-lg:border-l-0 max-lg:border-t-ink">
            <NorthStar
              variant="beacon"
              className="absolute top-10 right-10 w-36 max-sm:top-6 max-sm:right-6 max-sm:w-24 lg:w-48"
            />
            <blockquote className="relative z-2 m-0 font-quote text-3xl leading-tight font-medium tracking-tight xl:text-4xl">
              We offer these as a North Star — a vision that empowers us to
              fight for our Rights for the decades ahead.
            </blockquote>
            <cite className="relative z-2 mt-5 block font-body text-sm font-bold tracking-wider text-brand-yellow uppercase not-italic">
              The Human Charter, v0.1
            </cite>
          </div>
        </section>
      </main>
    </>
  );
}
