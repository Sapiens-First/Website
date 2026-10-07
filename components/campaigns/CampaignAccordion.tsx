"use client";
import { CardText } from "@/components/ui/Card";

import { Fragment, useEffect, useRef, useState } from "react";

import { campaignDetails as campaigns } from "@/content/campaigns";
import { cn } from "@/lib/cn";
import { AccordionChevron } from "@/components/sections/Faq";

const tabColors = [
  "col-start-1 border-t-coral",
  "col-start-2 border-t-brand-purple",
  "col-start-3 border-t-brand-blue",
];

export default function CampaignAccordion() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelId, setPanelId] = useState<string | null>(null);
  const [shownId, setShownId] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  function clearPendingTransition() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    timerRef.current = null;
    frameRef.current = null;
  }

  function select(id: string) {
    clearPendingTransition();
    if (activeId === id) {
      setActiveId(null);
      setFading(false);
      return;
    }

    setActiveId(id);
    setPanelId(id);
    if (!shownId || shownId === id) {
      setShownId(id);
      setFading(false);
      return;
    }

    setFading(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setShownId(id);
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setFading(false);
      });
    }, 150);
  }

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const panel = campaigns.find((campaign) => campaign.id === shownId);
  const panelPosition = panelId ?? campaigns.at(-1)?.id;

  return (
    <div className="mt-7 mr-auto mb-0 ml-auto grid max-w-none grid-cols-3 gap-x-2.5 gap-y-0 max-md:max-w-full max-sm:flex max-sm:flex-col max-sm:gap-2.5">
      {campaigns.map((campaign, index) => (
        <Fragment key={campaign.id}>
          <button
            className={cn(
              "group row-start-1 flex w-full cursor-pointer items-center justify-center gap-3.5 border-2 border-t-8 border-ink bg-white px-6 py-5 text-left font-[inherit] text-inherit transition-[background,border-color] duration-220 hover:bg-paper focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--color-coral)_40%,transparent)] max-md:px-5",
              tabColors[index],
              index > 0 && (index === 1 ? "delay-150" : "delay-300"),
              activeId === campaign.id &&
                "border-b-white bg-white hover:bg-white max-sm:border-b-ink",
            )}
            type="button"
            aria-expanded={activeId === campaign.id}
            aria-controls="campaign-shared-panel"
            onClick={() => select(campaign.id)}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="mb-2 font-display text-3xl leading-none font-extrabold tracking-normal text-ink uppercase xl:text-4xl">
                {campaign.title}
              </span>
              <span className="font-body text-lg font-medium text-ink">
                {campaign.objective}
              </span>
            </span>
            <AccordionChevron />
          </button>
          {panelPosition === campaign.id && (
            <div
              className={cn(
                "col-span-full row-start-2 grid border-2 border-t-0 border-ink bg-white transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] max-sm:border-t-2",
                activeId
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
              id="campaign-shared-panel"
            >
              <div
                className={cn(
                  "min-h-0 overflow-hidden transition-opacity duration-150",
                  fading && "opacity-0",
                )}
              >
                {campaigns.map((item) => (
                  <div
                    className="px-7 py-6 max-md:p-5"
                    id={`campaign-content-${item.id}`}
                    key={item.id}
                    hidden={panel?.id !== item.id}
                  >
                    <CardText className="mt-0 mr-0 mb-4 ml-0">
                      {item.description}
                    </CardText>
                    <span className="mb-2 block font-body text-sm tracking-widest text-coral-dark uppercase">
                      Metrics
                    </span>
                    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                      {item.metrics.map((metric) => (
                        <li
                          className="relative pl-4 text-lg leading-normal font-medium text-ink before:absolute before:left-0 before:text-coral before:opacity-60 before:content-['–']"
                          key={metric}
                        >
                          {metric}
                        </li>
                      ))}
                    </ul>
                    <CardText className="mt-3.5 mb-0 italic">
                      {item.resources}
                    </CardText>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
