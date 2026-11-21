"use client";

import { useCountdown } from "@/components/redesign/Countdown";
import { campaignConfig } from "@/lib/no-tech-kings/config";
import styles from "./ntk.module.css";

const when = `${campaignConfig.eventDateLabel.replace(/, \d{4}$/, "")} · ${campaignConfig.eventTimeLabel}`;

/** Days / Hours / Minutes until the mass action; the date once it has begun. */
export function NtkCountdown({
  className,
  caption = true,
}: {
  className?: string;
  /** Off when the date is already shown nearby (the hero). */
  caption?: boolean;
}) {
  const state = useCountdown();
  if (state.kind === "hidden") return null;
  if (state.kind === "date") {
    if (!caption) return null;
    return (
      <p className={`${styles.date} ${className ?? ""}`}>
        {campaignConfig.eventDateLabel} · {campaignConfig.eventTimeLabel}
      </p>
    );
  }
  const units = [
    [state.days, "Days"],
    [state.hours, "Hours"],
    [state.minutes, "Minutes"],
  ] as const;
  return (
    <div className={className}>
      <div
        className={styles.countdown}
        role="timer"
        aria-label={`${state.days} days, ${state.hours} hours, ${state.minutes} minutes until ${when}`}
      >
        {units.map(([amount, unit]) => (
          <div key={unit} className={styles.tick} aria-hidden="true">
            <strong>{amount}</strong>
            <span>{unit}</span>
          </div>
        ))}
      </div>
      {caption ? <p className={styles.date}>Until {when}</p> : null}
    </div>
  );
}
