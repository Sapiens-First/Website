"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { campaignDetails as campaigns } from "@/content/campaigns";

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
    <div className="campaign-grid mt-7 mr-auto mb-0 ml-auto max-w-none grid grid-cols-3 gap-x-2.5 gap-y-0 max-md:max-w-full max-sm:flex max-sm:flex-col max-sm:gap-2.5">
      {campaigns.map((campaign, index) => (
        <Fragment key={campaign.id}>
          <button
            className={`campaign-tab accordion-toggle reveal${index ? ` reveal-d${index}` : ""}${activeId === campaign.id ? " is-active" : ""}`}
            type="button"
            aria-expanded={activeId === campaign.id}
            aria-controls="campaign-shared-panel"
            onClick={() => select(campaign.id)}
          >
            <span className="campaign-header flex flex-col gap-1.5 min-w-0">
              <span className="card-title">{campaign.title}</span>
              <span className="campaign-objective font-body text-lg font-medium text-ink">
                {campaign.objective}
              </span>
            </span>
            <span
              className="campaign-chevron accordion-chevron"
              aria-hidden="true"
            />
          </button>
          {panelPosition === campaign.id && (
            <div
              className={`campaign-panel accordion-panel${activeId ? " is-open" : ""}`}
              id="campaign-shared-panel"
            >
              <div
                className={`campaign-panel-inner accordion-panel-inner${fading ? " is-fading" : ""}`}
              >
                {campaigns.map((item) => (
                  <div
                    className="campaign-body py-6 px-7 max-md:p-5"
                    id={`campaign-content-${item.id}`}
                    key={item.id}
                    hidden={panel?.id !== item.id}
                  >
                    <p className="campaign-desc card-text mt-0 mr-0 mb-4 ml-0">
                      {item.description}
                    </p>
                    <span className="eyebrow eyebrow--accent campaign-metrics-label block mb-2">
                      Metrics
                    </span>
                    <ul className="campaign-list list-none m-0 flex flex-col gap-1.5">
                      {item.metrics.map((metric) => (
                        <li key={metric}>{metric}</li>
                      ))}
                    </ul>
                    <p className="campaign-note card-text italic mt-3.5 mb-0">
                      {item.resources}
                    </p>
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
