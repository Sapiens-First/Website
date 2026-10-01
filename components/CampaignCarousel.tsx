"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const campaigns = [
  {
    id: "freeze",
    title: "Freeze AI.",
    description:
      "Call on the US to slow the development of frontier intelligence.",
  },
  {
    id: "surveillance",
    title: "Stop 1984.",
    description: "End AI-enabled mass surveillance.",
  },
  {
    id: "robots",
    title: "No Killer Robots.",
    description: "Regulate deadly, autonomous weapons.",
  },
] as const;

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
      <div className="campaign-viewport" tabIndex={0} ref={viewportRef}>
        <div className="campaign-track" ref={trackRef}>
          {[-1, 0, 1].flatMap((copy) =>
            campaigns.map((campaign) => (
              <article
                key={`${copy}-${campaign.id}`}
                className={`campaign-card ${campaign.id}`}
                aria-hidden={copy === 0 ? undefined : true}
                inert={copy === 0 ? undefined : true}
              >
                <div className="campaign-art" aria-hidden="true" />
                <div className="campaign-copy">
                  <h4>{campaign.title}</h4>
                  <p>{campaign.description}</p>
                </div>
              </article>
            )),
          )}
        </div>
      </div>
      <div className="campaigns-footer">
        <div
          className="campaign-controls"
          aria-label="Campaign carousel controls"
        >
          <button
            className="campaign-arrow campaign-prev"
            type="button"
            aria-label="Previous campaign"
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            className="campaign-arrow campaign-next"
            type="button"
            aria-label="Next campaign"
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
        <Link className="campaigns-link" href="/campaigns">
          See all campaigns →
        </Link>
      </div>
    </>
  );
}
