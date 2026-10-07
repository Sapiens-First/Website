"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { campaignTeasers as campaigns } from "@/content/campaigns";
import { cn } from "@/lib/cn";

/** Abstract poster art per campaign, drawn with the art layer and its two pseudo-elements. */
const art: Record<string, string> = {
  freeze:
    "bg-brand-blue before:-top-[10%] before:left-[21%] before:aspect-square before:w-[58%] before:rounded-full before:border-[34px] before:border-white/70 before:shadow-[0_0_0_25px_rgba(255,255,255,0.15)] after:top-[44%] after:-left-[15%] after:h-[18px] after:w-[130%] after:-rotate-8 after:bg-ink",
  surveillance:
    "bg-coral before:top-[17%] before:left-[15%] before:h-[42%] before:w-[70%] before:rounded-full before:border-[26px] before:border-ink after:top-[calc(38%-55px)] after:left-[calc(50%-55px)] after:size-[110px] after:rounded-full after:border-[18px] after:border-ink after:bg-brand-yellow",
  robots:
    "bg-brand-purple before:top-[6%] before:left-[calc(50%-125px)] before:h-[300px] before:w-[250px] before:bg-ink before:[clip-path:polygon(20%_0,80%_0,100%_20%,85%_100%,15%_100%,0_20%)] after:top-[26%] after:left-[calc(50%-19px)] after:size-[38px] after:rounded-full after:bg-brand-pink after:shadow-[-68px_0_0_var(--color-brand-pink),68px_0_0_var(--color-brand-pink)]",
};

export default function CampaignCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<number>(campaigns.length);
  const wrapTimerRef = useRef<number | null>(null);
  const instantScrollRef = useRef(false);
  const [position, setPosition] = useState<number>(campaigns.length);

  function center(index: number, behavior: ScrollBehavior) {
    const viewport = viewportRef.current;
    const card = trackRef.current?.children.item(index);
    if (!(viewport && card instanceof HTMLElement)) return;
    viewport.scrollTo({
      left: card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2,
      behavior:
        behavior === "smooth" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "instant",
    });
  }

  function move(direction: -1 | 1) {
    if (wrapTimerRef.current) window.clearTimeout(wrapTimerRef.current);
    let next = positionRef.current + direction;
    if (next >= campaigns.length * 3) next -= campaigns.length;
    if (next < 0) next += campaigns.length;
    positionRef.current = next;
    instantScrollRef.current = false;
    setPosition(next);

    wrapTimerRef.current = window.setTimeout(() => {
      wrapTimerRef.current = null;
      const current = positionRef.current;
      const wrapped =
        current >= campaigns.length * 2
          ? current - campaigns.length
          : current < campaigns.length
            ? current + campaigns.length
            : current;
      if (wrapped === current) return;
      positionRef.current = wrapped;
      instantScrollRef.current = true;
      setPosition(wrapped);
    }, 600);
  }

  useEffect(() => {
    center(position, instantScrollRef.current ? "instant" : "smooth");
    instantScrollRef.current = false;
  }, [position]);

  useEffect(() => {
    const recenter = () => center(positionRef.current, "instant");
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
  }, []);

  useEffect(
    () => () => {
      if (wrapTimerRef.current) window.clearTimeout(wrapTimerRef.current);
    },
    [],
  );

  return (
    <>
      <div
        className="relative left-1/2 w-screen -translate-x-1/2 snap-x snap-proximity [scrollbar-width:none] overflow-x-auto scroll-smooth px-6 py-4 sm:px-20 lg:px-32 [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        ref={viewportRef}
      >
        <div className="flex w-max gap-5 max-sm:gap-3" ref={trackRef}>
          {[-1, 0, 1].flatMap((copy) =>
            campaigns.map((campaign) => (
              <article
                key={`${copy}-${campaign.id}`}
                className="relative isolate min-h-112 flex-[0_0_min(68vw,760px)] snap-center overflow-hidden border-2 border-ink after:absolute after:inset-0 after:-z-1 after:bg-[linear-gradient(180deg,transparent_10%,rgba(0,0,0,0.78)_55%,rgba(0,0,0,0.95)_100%)] after:content-[''] max-sm:min-h-96 max-sm:basis-[84vw]"
                aria-hidden={copy === 0 ? undefined : true}
                inert={copy === 0 ? undefined : true}
              >
                <div
                  className={cn(
                    "absolute inset-0 -z-2 overflow-hidden before:absolute before:content-[''] after:absolute after:content-['']",
                    art[campaign.id],
                  )}
                  aria-hidden="true"
                />
                <div className="absolute right-8 bottom-7 left-8 text-white max-sm:right-5 max-sm:bottom-5 max-sm:left-5">
                  <h4 className="mx-0 mt-0 mb-2.5 font-display text-5xl leading-none font-extrabold tracking-tight uppercase max-sm:text-6xl lg:text-6xl xl:text-7xl">
                    {campaign.title}
                  </h4>
                  <p className="m-0 max-w-lg text-lg leading-normal font-medium xl:text-xl">
                    {campaign.description}
                  </p>
                </div>
              </article>
            )),
          )}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-5 max-sm:grid-cols-1 max-sm:gap-5">
        <div
          className="col-start-2 flex gap-2 max-sm:col-start-1 max-sm:justify-self-center"
          aria-label="Campaign carousel controls"
        >
          <button
            className="h-12 w-12 cursor-pointer border-2 border-solid border-ink bg-paper text-xl font-extrabold text-ink hover:bg-brand-yellow max-sm:h-10 max-sm:w-10"
            type="button"
            aria-label="Previous campaign"
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            className="h-12 w-12 cursor-pointer border-2 border-solid border-ink bg-paper text-xl font-extrabold text-ink hover:bg-brand-yellow max-sm:h-10 max-sm:w-10"
            type="button"
            aria-label="Next campaign"
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
        <Link
          className="m-0 block w-max justify-self-end border-b-2 border-solid border-b-ink pb-0.5 font-body text-base font-bold tracking-wider uppercase hover:border-coral hover:text-coral"
          href="/campaigns"
        >
          See all campaigns →
        </Link>
      </div>
    </>
  );
}
