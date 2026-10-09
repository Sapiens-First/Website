"use client";

import { Fragment, useState } from "react";
import { CardText } from "@/components/ui/Card";
import { AccordionChevron } from "@/components/sections/Faq";
import { cn } from "@/lib/cn";

type Campaign = {
  id: string;
  title: string;
  objective: string;
  description: string;
  metrics: string[];
};

const tabColors = [
  "col-start-1 border-t-coral",
  "col-start-2 border-t-brand-purple",
  "col-start-3 border-t-brand-blue",
];

export default function CampaignAccordion({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  // The panel keeps its last campaign while collapsing, so `panelId` outlives `open`.
  const [panelId, setPanelId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const activeId = open ? panelId : null;
  const panel = campaigns.find((campaign) => campaign.id === panelId);
  const panelPosition = panelId ?? campaigns.at(-1)?.id;

  function select(id: string) {
    setOpen(activeId !== id);
    setPanelId(id);
  }

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
              <div className="min-h-0 overflow-hidden">
                {panel && (
                  // Keyed by campaign so each switch fades the new copy in.
                  <div
                    className="px-7 py-6 transition-opacity duration-150 max-md:p-5 starting:opacity-0"
                    key={panel.id}
                  >
                    <CardText className="mt-0 mr-0 mb-4 ml-0">
                      {panel.description}
                    </CardText>
                    <span className="mb-2 block font-body text-sm tracking-widest text-coral-dark uppercase">
                      Metrics
                    </span>
                    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                      {panel.metrics.map((metric) => (
                        <li
                          className="relative pl-4 text-lg leading-normal font-medium text-ink before:absolute before:left-0 before:text-coral before:opacity-60 before:content-['–']"
                          key={metric}
                        >
                          {metric}
                        </li>
                      ))}
                    </ul>
                    <CardText className="mt-3.5 mb-0 italic">
                      Resources: forthcoming
                    </CardText>
                  </div>
                )}
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
