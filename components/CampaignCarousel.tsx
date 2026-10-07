"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { campaignTeasers as campaigns } from "@/content/campaigns";

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
        className="campaign-viewport relative left-1/2 w-screen -translate-x-1/2 overflow-x-auto px-6 py-4 sm:px-20 lg:px-32"
        tabIndex={0}
        ref={viewportRef}
      >
        <div
          className="campaign-track flex w-max gap-5 max-sm:gap-3"
          ref={trackRef}
        >
          {[-1, 0, 1].flatMap((copy) =>
            campaigns.map((campaign) => (
              <article
                key={`${copy}-${campaign.id}`}
                className={`campaign-card ${campaign.id}`}
                aria-hidden={copy === 0 ? undefined : true}
                inert={copy === 0 ? undefined : true}
              >
                <div className="campaign-art" aria-hidden="true" />
                <div className="campaign-copy absolute right-8 bottom-7 left-8 text-white max-sm:right-5 max-sm:bottom-5 max-sm:left-5">
                  <h4>{campaign.title}</h4>
                  <p>{campaign.description}</p>
                </div>
              </article>
            )),
          )}
        </div>
      </div>
      <div className="campaigns-footer mt-5 grid items-center gap-5 max-sm:grid-cols-1 max-sm:gap-5">
        <div
          className="campaign-controls flex gap-2 max-sm:justify-self-center"
          aria-label="Campaign carousel controls"
        >
          <button
            className="campaign-arrow campaign-prev h-12 w-12 cursor-pointer border-2 border-solid border-ink text-xl font-extrabold text-ink max-sm:h-10 max-sm:w-10"
            type="button"
            aria-label="Previous campaign"
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            className="campaign-arrow campaign-next h-12 w-12 cursor-pointer border-2 border-solid border-ink text-xl font-extrabold text-ink max-sm:h-10 max-sm:w-10"
            type="button"
            aria-label="Next campaign"
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
        <Link
          className="campaigns-link m-0 block w-max justify-self-end border-b-2 border-solid border-b-ink pb-0.5 font-body text-base font-bold tracking-wider uppercase"
          href="/campaigns"
        >
          See all campaigns →
        </Link>
      </div>
    </>
  );
}
