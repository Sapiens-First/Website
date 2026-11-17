import { links } from "@/lib/no-tech-kings/links";

/**
 * One source for the tea-party meter, the countdown window, and the popup.
 * `hostForm` is the live Google host form (`links.hostTeaParty`), not a second URL.
 */
export const campaignConfig = {
  eventStart: "2026-12-14T08:00:00Z",
  hideCountdownAfter: "2026-12-16T08:00:00Z",
  teaParties: { done: 5, goal: 10 },
  popup: {
    storageKey: "sf-popup-tea-party-2026-11",
    expireDays: 7,
    autoOpenDelayMs: 8000,
    autoOpenMinWidth: 700,
  },
  hostForm: links.hostTeaParty.href,
  eventDateLabel: "December 14, 2026",
} as const;

export function meterLabel(
  done = campaignConfig.teaParties.done,
  goal = campaignConfig.teaParties.goal,
) {
  return `${done} of ${goal} tea parties`;
}

export function meterHelp(
  done = campaignConfig.teaParties.done,
  goal = campaignConfig.teaParties.goal,
) {
  return `Help us get to ${goal} tea parties. ${done} hosted so far.`;
}

export function hostCountLine(
  done = campaignConfig.teaParties.done,
  goal = campaignConfig.teaParties.goal,
) {
  return `${done} tea parties have been hosted so far. Help us get to ${goal}.`;
}

export function meterPercent(
  done = campaignConfig.teaParties.done,
  goal = campaignConfig.teaParties.goal,
) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((done / goal) * 100));
}
