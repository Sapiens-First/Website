import {
  campaignConfig,
  meterLabel,
  meterPercent,
} from "@/lib/no-tech-kings/config";

export function ProgressMeter({
  appearance,
}: {
  appearance: "announce" | "popup";
}) {
  const label = meterLabel();
  const percent = meterPercent();
  const track = (
    <span
      className={
        appearance === "announce"
          ? "block h-2 w-[7.5rem] max-w-[30vw] shrink-0 border border-paper/55 bg-paper/20"
          : "block h-3.5 w-full border border-ink bg-ink/22"
      }
    >
      <span
        className="block h-full bg-brand-yellow"
        style={{ width: `${percent}%` }}
      />
    </span>
  );
  const barProps = {
    role: "progressbar" as const,
    "aria-valuemin": 0,
    "aria-valuenow": campaignConfig.teaParties.done,
    "aria-valuemax": campaignConfig.teaParties.goal,
    "aria-label": label,
  };

  if (appearance === "popup") {
    return (
      <div>
        <div {...barProps}>{track}</div>
        <p className="mt-1.5 text-sm font-bold">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2.5" {...barProps}>
      {track}
      <span className="text-sm leading-snug font-semibold">{label}</span>
    </div>
  );
}
