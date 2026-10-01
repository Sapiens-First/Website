"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const campaigns = [
  {
    id: "stop-1984",
    title: "Stop 1984",
    objective: "Ban AI-enabled mass surveillance.",
    description:
      "Mass surveillance is a threat to our civil liberties and free speech. AI-enabled surveillance could mean unprecedented concentration of power. We believe that a variety of coalition groups and civil society organizations could support a ban on AI-enabled mass surveillance.",
    metrics: [
      "Get individuals and organizations to sign onto our open letter against AI-enabled mass surveillance (forthcoming)",
      "Get city councils to do resolutions against AI-enabled mass surveillance",
    ],
    resources: "Resources: forthcoming",
  },
  {
    id: "no-killer-robots",
    title: "No Killer Robots",
    objective: "Regulate autonomous weapons in the military.",
    description:
      "Militaries around the world are racing to deploy autonomous weapons that can select and kill targets without human oversight. However, most people are unaware this is already happening, or don't grasp how quickly it's becoming normalized. Increasing awareness of this threat expands the Overton window, and builds political will for regulation.",
    metrics: [
      "Get mainstream media to write positively about activism against autonomous weapons",
      "Increase awareness through social media",
    ],
    resources: "Resources: forthcoming",
  },
  {
    id: "save-our-future",
    title: "AI Freeze",
    objective:
      "Negotiate a coordinated slowdown on the development of artificial intelligence.",
    description:
      "Experts in artificial intelligence, including those at frontier AI labs, have warned for years about the dangers of superintelligence. However, most people are unaware of these risks, or are not acting appropriately given their severity. Increasing awareness of existential risk expands the Overton window, and builds political will for AI safety.",
    metrics: [
      "Get mainstream media to write positively about activism against existential risk posed by AI",
      "Increase awareness through social media",
    ],
    resources: "Resources: forthcoming",
  },
] as const;

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
    <div className="campaign-grid">
      {campaigns.map((campaign, index) => (
        <Fragment key={campaign.id}>
          <button
            className={`campaign-tab accordion-toggle reveal${index ? ` reveal-d${index}` : ""}${activeId === campaign.id ? " is-active" : ""}`}
            type="button"
            aria-expanded={activeId === campaign.id}
            aria-controls="campaign-shared-panel"
            onClick={() => select(campaign.id)}
          >
            <span className="campaign-header">
              <span className="card-title">{campaign.title}</span>
              <span className="campaign-objective">{campaign.objective}</span>
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
                    className="campaign-body"
                    id={`campaign-content-${item.id}`}
                    key={item.id}
                    hidden={panel?.id !== item.id}
                  >
                    <p className="campaign-desc card-text">
                      {item.description}
                    </p>
                    <span className="eyebrow eyebrow--accent campaign-metrics-label">
                      Metrics
                    </span>
                    <ul className="campaign-list">
                      {item.metrics.map((metric) => (
                        <li key={metric}>{metric}</li>
                      ))}
                    </ul>
                    <p className="campaign-note card-text">{item.resources}</p>
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
