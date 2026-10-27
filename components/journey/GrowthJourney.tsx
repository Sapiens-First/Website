"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Kicker, Label } from "@/components/ui/Text";
import {
  growthPresets,
  PARTICIPATION_GOAL,
  simulateGrowth,
  type GrowthAssumptions,
  type MonthlyGrowthPoint,
  type GrowthPreset,
  type TriggerEvent,
} from "@/lib/journey-model";

const monthNames = [
  "Oct ’26",
  "Nov ’26",
  "Dec ’26",
  "Jan ’27",
  "Feb ’27",
  "Mar ’27",
  "Apr ’27",
  "May ’27",
  "Jun ’27",
  "Jul ’27",
  "Aug ’27",
  "Sep ’27",
];

type ChartMode = "cumulative" | "monthly";

function count(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function shortCount(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}b`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}m`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(0)}k`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return count(value);
}

function percent(value: number) {
  return `${value}%`;
}

function multiplier(value: number) {
  return `${value.toFixed(1).replace(/\.0$/, "")}×`;
}

function RangeDial({
  label,
  id: idOverride,
  value,
  min,
  max,
  step,
  output,
  onChange,
}: {
  label: string;
  id?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  output: string;
  onChange: (value: number) => void;
}) {
  const id = idOverride ?? label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  return (
    <div className="border-t border-rule py-3">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm leading-snug font-bold">
          {label}
        </label>
        <output
          htmlFor={id}
          className="shrink-0 font-display text-xl leading-none font-bold tabular-nums"
        >
          {output}
        </output>
      </div>
      <input
        id={id}
        className="h-2 w-full cursor-pointer accent-brand-blue"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Math.max(
              min,
              Math.min(max, Number(event.currentTarget.value) || min),
            ),
          )
        }
      />
    </div>
  );
}

function CountDial({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 border-t border-rule py-3 text-sm leading-snug font-bold">
      <span>{label}</span>
      <input
        className="w-24 border-2 border-ink bg-white px-2 py-1.5 text-right tabular-nums"
        type="number"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) =>
          onChange(
            Math.max(
              min,
              Math.min(max, Number(event.currentTarget.value) || min),
            ),
          )
        }
      />
    </label>
  );
}

function GrowthChart({
  points,
  start,
  selectedMonth,
  onSelectMonth,
  mode,
  triggerEvents,
}: {
  points: MonthlyGrowthPoint[];
  start: number;
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
  mode: ChartMode;
  triggerEvents: TriggerEvent[];
}) {
  const width = 860;
  const height = 340;
  const left = 70;
  const right = 30;
  const top = 24;
  const bottom = 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const goalMultiplier = Math.pow(PARTICIPATION_GOAL / start, 1 / 12);
  const targetValues = points.map((point) =>
    point.monthIndex === 12
      ? PARTICIPATION_GOAL
      : start * Math.pow(goalMultiplier, point.monthIndex),
  );
  const targetMonthlyChanges = targetValues.map((value, index) =>
    index === 0 ? 0 : value - targetValues[index - 1],
  );
  const modelValues = points.map((point) =>
    mode === "cumulative" ? point.participants : point.netNewParticipants,
  );
  const targetLineValues =
    mode === "cumulative" ? targetValues : targetMonthlyChanges;
  const largest = Math.max(1, ...modelValues, ...targetLineValues);
  const smallest = Math.min(0, ...modelValues, ...targetLineValues);
  const maxExponent = Math.max(5, Math.ceil(Math.log10(largest)));
  // SVG attributes must serialize identically across server and browser math engines.
  const coordinate = (value: number) => Number(value.toFixed(3));
  const x = (month: number) => coordinate(left + (month / 12) * plotWidth);
  const y = (value: number) => {
    if (mode === "cumulative") {
      return coordinate(
        top +
          (1 - Math.log10(Math.max(10, value)) / maxExponent) * (plotHeight - 4),
      );
    }
    const range = Math.max(1, largest - smallest);
    return coordinate(top + ((largest - value) / range) * (plotHeight - 4));
  };
  const visiblePoints = mode === "monthly" ? points.slice(1) : points;
  const targetPath = visiblePoints
    .map((point, index) => {
      const value = targetLineValues[point.monthIndex];
      return `${index === 0 ? "M" : "L"}${x(point.monthIndex)},${y(value)}`;
    })
    .join(" ");
  const modelPath = visiblePoints
    .map((point, index) => {
      const value = modelValues[point.monthIndex];
      return `${index === 0 ? "M" : "L"}${x(point.monthIndex)},${y(value)}`;
    })
    .join(" ");
  const selected = points[selectedMonth];
  const selectedValue = modelValues[selectedMonth];
  const monthlyTicks = Array.from(
    { length: 5 },
    (_, index) => largest - ((largest - smallest) * index) / 4,
  );

  function selectFromPointer(clientX: number, rect: DOMRect) {
    const viewX = ((clientX - rect.left) / rect.width) * width;
    const month = Math.round(((viewX - left) / plotWidth) * 12);
    onSelectMonth(Math.max(0, Math.min(12, month)));
  }

  return (
    <div className="overflow-x-auto">
      <svg
        className="h-auto w-full min-w-[680px]"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="growth-chart-title growth-chart-description"
        onPointerMove={(event) =>
          selectFromPointer(
            event.clientX,
            event.currentTarget.getBoundingClientRect(),
          )
        }
        onPointerDown={(event) =>
          selectFromPointer(
            event.clientX,
            event.currentTarget.getBoundingClientRect(),
          )
        }
        style={{ touchAction: "pan-y" }}
      >
        <title id="growth-chart-title">
          {mode === "cumulative"
            ? "Cumulative active participants through September 2027"
            : "Monthly change in active participants through September 2027"}
        </title>
        <desc id="growth-chart-description">
          Hover over the chart or use the month slider to inspect participant,
          member, organizer, and circle counts for each month. Coral bands mark
          trigger-event windows. The dashed line shows the pace required to
          reach 100,000 by September 2027.
        </desc>
        {triggerEvents.map((event, index) => {
          const endMonth = Math.min(12, event.month + event.duration - 1);
          const bandWidth = Math.max(3, x(endMonth) - x(event.month));
          return (
            <g key={event.id}>
              <rect
                x={x(event.month)}
                y={top}
                width={bandWidth}
                height={plotHeight - 4}
                fill="var(--color-coral)"
                opacity="0.14"
              />
              <line
                x1={x(event.month)}
                y1={top}
                x2={x(event.month)}
                y2={height - bottom}
                stroke="var(--color-coral-dark)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle
                cx={x(event.month)}
                cy={top + 9 + (index % 2) * 19}
                r="9"
                fill="var(--color-coral-dark)"
              />
              <text
                x={x(event.month)}
                y={top + 13 + (index % 2) * 19}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="700"
              >
                {index + 1}
              </text>
              <title>
                {event.name}: starts {monthNames[event.month - 1]} and lasts{" "}
                {event.duration} {event.duration === 1 ? "month" : "months"}
              </title>
            </g>
          );
        })}
        {(mode === "cumulative"
          ? Array.from({ length: maxExponent }, (_, index) =>
              Math.pow(10, index + 1),
            )
          : monthlyTicks
        ).map((value, index) => {
          const yy = y(value);
          return (
            <g key={`${value}-${index}`}>
              <line
                x1={left}
                y1={yy}
                x2={width - right}
                y2={yy}
                stroke="var(--color-rule)"
                strokeWidth="1"
              />
              <text
                x={left - 10}
                y={yy + 4}
                textAnchor="end"
                fill="var(--color-ink)"
                fontSize="12"
              >
                {shortCount(value)}
              </text>
            </g>
          );
        })}
        {mode === "cumulative" && (
          <>
            <line
              x1={left}
              y1={y(PARTICIPATION_GOAL)}
              x2={width - right}
              y2={y(PARTICIPATION_GOAL)}
              stroke="var(--color-coral-dark)"
              strokeWidth="2"
              strokeDasharray="7 6"
            />
            <text
              x={left + 8}
              y={y(PARTICIPATION_GOAL) - 8}
              fill="var(--color-coral-dark)"
              fontSize="12"
              fontWeight="700"
            >
              Goal
            </text>
          </>
        )}
        <path
          d={targetPath}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="2"
          strokeDasharray="5 6"
          opacity="0.65"
        />
        <path
          d={modelPath}
          fill="none"
          stroke="var(--color-brand-blue)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point) => {
          const value = modelValues[point.monthIndex];
          const xx = x(point.monthIndex);
          const yy = y(value);
          const active = point.monthIndex === selectedMonth;
          const visible = mode === "cumulative" || point.monthIndex > 0;
          if (!visible) return null;
          return (
            <g key={point.monthIndex}>
              <circle
                cx={xx}
                cy={yy}
                r={active ? 8 : point.monthIndex % 3 === 0 ? 5 : 3}
                fill={
                  active
                    ? "var(--color-brand-yellow)"
                    : "var(--color-brand-blue)"
                }
                stroke={active ? "var(--color-ink)" : "white"}
                strokeWidth="2"
              />
            </g>
          );
        })}
        <line
          x1={x(selected.monthIndex)}
          y1={top}
          x2={x(selected.monthIndex)}
          y2={height - bottom}
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.7"
        />
        <circle
          cx={x(selected.monthIndex)}
          cy={y(selectedValue)}
          r="8"
          fill="var(--color-brand-yellow)"
          stroke="var(--color-ink)"
          strokeWidth="2"
        />
        {(mode === "cumulative" ? [0, 3, 6, 9, 12] : [1, 3, 6, 9, 12]).map(
          (month) => (
            <text
              key={month}
              x={x(month)}
              y={height - 12}
              textAnchor="middle"
              fill="var(--color-ink)"
              fontSize="12"
              fontWeight={month === selectedMonth ? "700" : "400"}
            >
              {mode === "cumulative" && month === 0
                ? "Start"
                : monthNames[month - 1]}
            </text>
          ),
        )}
      </svg>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border-t-2 border-ink py-3">
      <p className="text-xs font-black tracking-widest text-ink/65 uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl leading-none font-bold tabular-nums sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-xs leading-snug text-ink/70">{detail}</p>
    </div>
  );
}

function QuarterCard({
  quarter,
  date,
  target,
  status,
  action,
}: {
  quarter: string;
  date: string;
  target: string;
  status: string;
  action: string;
}) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0_var(--color-brand-yellow)]">
      <p className="text-xs font-black tracking-widest text-coral-dark uppercase">
        {quarter} · {date}
      </p>
      <p className="mt-2 font-display text-3xl leading-none font-bold uppercase">
        {target}
      </p>
      <p className="mt-2 text-sm leading-snug">{action}</p>
      <p className="mt-3 border-t border-rule pt-2 text-xs font-bold text-ink/60">
        {status}
      </p>
    </article>
  );
}

export default function GrowthJourney() {
  const [assumptions, setAssumptions] = useState<GrowthAssumptions>(
    growthPresets.goal,
  );
  const [preset, setPreset] = useState<GrowthPreset | "custom">("goal");
  const [chartMode, setChartMode] = useState<ChartMode>("cumulative");
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [triggerEvents, setTriggerEvents] = useState<TriggerEvent[]>([]);
  const [triggerReadiness, setTriggerReadiness] = useState(70);
  const nextTriggerId = useRef(1);
  const monthlyPoints = simulateGrowth(
    assumptions,
    triggerEvents,
    triggerReadiness,
  );
  const selected = monthlyPoints[selectedMonth];
  const ending = monthlyPoints[monthlyPoints.length - 1];
  const finalQuarter = monthlyPoints.slice(10).reduce(
    (quarter, point) => ({
      invitations: quarter.invitations + point.invitations,
      actions: quarter.actions + point.actions,
      repeats: quarter.repeats + point.repeats,
      newMembers: quarter.newMembers + point.newMembers,
      newlyTrained: quarter.newlyTrained + point.newlyTrained,
      followUpShortfall: quarter.followUpShortfall + point.followUpShortfall,
    }),
    {
      invitations: 0,
      actions: 0,
      repeats: 0,
      newMembers: 0,
      newlyTrained: 0,
      followUpShortfall: 0,
    },
  );
  const noTriggerEnd =
    triggerEvents.length > 0
      ? simulateGrowth(assumptions, [], triggerReadiness)[12]
      : null;
  const triggerLift = noTriggerEnd
    ? ending.participants - noTriggerEnd.participants
    : 0;
  const triggerMemberLift = noTriggerEnd
    ? ending.members - noTriggerEnd.members
    : 0;
  const triggerOrganizerLift = noTriggerEnd
    ? ending.organizers - noTriggerEnd.organizers
    : 0;
  const goalCleared = ending.participants >= PARTICIPATION_GOAL;

  function update<K extends keyof GrowthAssumptions>(key: K, value: number) {
    setAssumptions((current) => ({ ...current, [key]: value }));
    setPreset("custom");
  }

  function choosePreset(next: GrowthPreset) {
    setAssumptions(growthPresets[next]);
    setPreset(next);
  }

  function addTriggerEvent() {
    const id = nextTriggerId.current;
    nextTriggerId.current += 1;
    setSelectedMonth(6);
    setTriggerEvents((current) => [
      ...current,
      {
        id,
        name: `Hypothetical event ${id}`,
        month: 6,
        duration: 2,
        reachMultiplier: 3,
        actionMultiplier: 1.5,
        trainingMultiplier: 2,
      },
    ]);
  }

  function updateTrigger<K extends keyof TriggerEvent>(
    id: number,
    key: K,
    value: TriggerEvent[K],
  ) {
    setTriggerEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, [key]: value } : event,
      ),
    );
  }

  const presetLabels: Record<GrowthPreset, string> = {
    goal: "100k path test",
    planning: "Planning case",
    lower: "Lower growth",
  };

  function signedCount(value: number) {
    const rounded = Math.round(value);
    return `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${count(Math.abs(rounded))}`;
  }

  return (
    <main className="bg-paper pb-16">
      <section id="outcomes" className="border-b-2 border-ink bg-brand-yellow">
        <Container className="py-10 sm:py-14 lg:py-16">
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Kicker>Sapiens First · movement growth model</Kicker>
              <h1 className="max-w-4xl font-display text-6xl leading-[0.92] font-extrabold tracking-tight uppercase sm:text-7xl lg:text-8xl">
                100k active people by September 2027.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-snug font-bold sm:text-xl">
                Test what it would take to build that movement through action,
                recruitment, and training.
              </p>
            </div>
            <div className="border-2 border-ink bg-ink p-5 text-white shadow-[7px_7px_0_var(--color-coral)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-black tracking-widest uppercase">
                  Sep 30, 2027 ·{" "}
                  {preset === "goal"
                    ? "Goal path test"
                    : preset === "custom"
                      ? "Custom case"
                      : presetLabels[preset]}
                </p>
                <span
                  className={`px-2.5 py-1 text-xs font-black tracking-wider text-ink uppercase ${goalCleared ? "bg-brand-yellow" : "bg-coral"}`}
                >
                  {goalCleared ? "Goal cleared" : "Goal not reached"}
                </span>
              </div>
              <p className="mt-5 font-display text-6xl leading-none font-extrabold text-brand-yellow tabular-nums sm:text-7xl">
                {shortCount(ending.participants)}
              </p>
              <p className="mt-2 text-sm font-bold text-white/80">
                active people in this scenario
              </p>
              <p className="mt-5 border-t border-white/25 pt-4 text-sm leading-snug text-white/85">
                This is an ambitious scenario built from unverified assumptions,
                not a forecast or a reported result.
              </p>
            </div>
          </div>

          <nav
            aria-label="Page sections"
            className="mt-9 flex flex-wrap gap-2 border-t-2 border-ink pt-4"
          >
            <a
              className="bg-ink px-3 py-2 text-xs font-black tracking-widest text-white uppercase"
              href="#outcomes"
            >
              Outcomes
            </a>
            <a
              className="border-2 border-ink bg-white px-3 py-1.5 text-xs font-black tracking-widest uppercase"
              href="#strategy"
            >
              Strategy
            </a>
            <a
              className="border-2 border-ink bg-white px-3 py-1.5 text-xs font-black tracking-widest uppercase"
              href="#scorecard"
            >
              Scorecard
            </a>
          </nav>
        </Container>
      </section>

      <section className="border-b-2 border-ink bg-paper py-10 sm:py-14">
        <Container>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label tone="blue">Outcomes</Label>
              <h2 className="mt-4 font-display text-4xl leading-none font-extrabold uppercase sm:text-5xl">
                Participation over time
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink/75">
              Choose a month to inspect the model. Switch between total active
              people and the number gained or lost each month.
            </p>
          </div>

          <div className="border-2 border-ink bg-white p-3 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex flex-wrap items-center gap-2"
                aria-label="Chart view"
              >
                {(
                  [
                    ["cumulative", "Cumulative"],
                    ["monthly", "Monthly change"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    className={`border-2 border-ink px-3 py-2 text-xs font-black tracking-wider uppercase ${chartMode === value ? "bg-brand-yellow" : "bg-white hover:bg-paper"}`}
                    type="button"
                    aria-pressed={chartMode === value}
                    onClick={() => setChartMode(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-ink/60">{selected.date}</p>
            </div>
            <div className="mb-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black tracking-wider uppercase">
              <span className="inline-flex items-center gap-2">
                <i className="h-1 w-6 bg-brand-blue" aria-hidden="true" />
                {chartMode === "cumulative"
                  ? "Active total"
                  : "Net change / month"}
              </span>
              <span className="inline-flex items-center gap-2">
                <i
                  className="h-0 w-6 border-t-2 border-dashed border-ink"
                  aria-hidden="true"
                />
                {chartMode === "cumulative"
                  ? "Required path"
                  : "Change required / month"}
              </span>
              {triggerEvents.length > 0 && (
                <span className="inline-flex items-center gap-2 text-coral-dark">
                  <i
                    className="h-3 w-3 bg-coral/40 ring-1 ring-coral-dark"
                    aria-hidden="true"
                  />
                  Trigger window
                </span>
              )}
            </div>
            <GrowthChart
              points={monthlyPoints}
              start={assumptions.startingPeople}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
              mode={chartMode}
              triggerEvents={triggerEvents}
            />
            <section
              aria-labelledby="trigger-events-heading"
              className="mt-5 border-2 border-ink bg-paper p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <Label tone="coral">Model a trigger</Label>
                  <h3
                    id="trigger-events-heading"
                    className="mt-3 font-display text-2xl leading-none font-bold uppercase sm:text-3xl"
                  >
                    Add a trigger event to the model
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    A public event can bring a short burst of attention. Add a
                    hypothetical one to test how timing, readiness, and
                    follow-up affect participation.
                  </p>
                </div>
                <button
                  className="border-2 border-ink bg-brand-yellow px-3 py-2 text-xs font-black tracking-wider uppercase disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  disabled={triggerEvents.length >= 3}
                  onClick={addTriggerEvent}
                >
                  {triggerEvents.length === 0
                    ? "+ Add an example event"
                    : "+ Add another event"}
                </button>
              </div>

              {triggerEvents.length === 0 ? (
                <p className="mt-4 border-t border-rule pt-3 text-sm leading-relaxed text-ink/70">
                  No event is modeled. The example starts in Mar ’27 for two
                  months; you can change every assumption.
                </p>
              ) : (
                <>
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {triggerEvents.map((event, index) => (
                      <fieldset
                        className="border-2 border-ink bg-white p-4"
                        key={event.id}
                      >
                        <legend className="font-display text-xl font-bold uppercase">
                          Event {index + 1}
                        </legend>
                        <div className="mb-2 flex justify-end">
                          <button
                            className="text-xs font-bold text-coral-dark underline underline-offset-2"
                            type="button"
                            aria-label={`Remove ${event.name}`}
                            onClick={() =>
                              setTriggerEvents((current) =>
                                current.filter((item) => item.id !== event.id),
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                        <label className="block text-sm font-bold">
                          Event label
                          <input
                            className="mt-1 w-full border-2 border-ink px-2 py-2 font-body font-normal"
                            type="text"
                            maxLength={48}
                            value={event.name}
                            onChange={(input) =>
                              updateTrigger(
                                event.id,
                                "name",
                                input.currentTarget.value,
                              )
                            }
                          />
                        </label>
                        <div className="mt-3 grid gap-x-5 sm:grid-cols-2">
                          <label className="block text-sm font-bold">
                            Starts
                            <select
                              className="mt-1 w-full border-2 border-ink bg-white px-2 py-2"
                              value={event.month}
                              onChange={(input) => {
                                const month = Number(input.currentTarget.value);
                                updateTrigger(event.id, "month", month);
                                setSelectedMonth(month);
                              }}
                            >
                              {monthNames.map((month, monthIndex) => (
                                <option key={month} value={monthIndex + 1}>
                                  {month}
                                </option>
                              ))}
                            </select>
                          </label>
                          <RangeDial
                            id={`trigger-${event.id}-duration`}
                            label="Attention spike lasts"
                            value={event.duration}
                            min={1}
                            max={6}
                            step={1}
                            output={`${event.duration} ${event.duration === 1 ? "month" : "months"}`}
                            onChange={(value) =>
                              updateTrigger(event.id, "duration", value)
                            }
                          />
                        </div>
                        <div className="mt-2 grid gap-x-5 sm:grid-cols-2">
                          <RangeDial
                            id={`trigger-${event.id}-reach`}
                            label="Invitations per organizer"
                            value={event.reachMultiplier}
                            min={1}
                            max={8}
                            step={0.1}
                            output={multiplier(event.reachMultiplier)}
                            onChange={(value) =>
                              updateTrigger(event.id, "reachMultiplier", value)
                            }
                          />
                          <RangeDial
                            id={`trigger-${event.id}-action`}
                            label="Invitation → action rate"
                            value={event.actionMultiplier}
                            min={1}
                            max={4}
                            step={0.1}
                            output={multiplier(event.actionMultiplier)}
                            onChange={(value) =>
                              updateTrigger(event.id, "actionMultiplier", value)
                            }
                          />
                        </div>
                        <RangeDial
                          id={`trigger-${event.id}-training`}
                          label="Member → organizer training rate"
                          value={event.trainingMultiplier}
                          min={1}
                          max={5}
                          step={0.1}
                          output={multiplier(event.trainingMultiplier)}
                          onChange={(value) =>
                            updateTrigger(event.id, "trainingMultiplier", value)
                          }
                        />
                      </fieldset>
                    ))}
                  </div>

                  <div className="mt-5 grid items-center gap-x-8 gap-y-2 md:grid-cols-2">
                    <RangeDial
                      id="trigger-readiness"
                      label="Readiness to turn attention into action"
                      value={triggerReadiness}
                      min={0}
                      max={100}
                      step={5}
                      output={percent(triggerReadiness)}
                      onChange={setTriggerReadiness}
                    />
                    <p className="text-xs leading-relaxed text-ink/70">
                      Readiness scales action and organizer-training rates; it
                      does not increase reach. Raise it when local leaders,
                      clear actions, and follow-up are ready.
                    </p>
                  </div>

                  {noTriggerEnd && (
                    <p className="mt-4 border-t-2 border-ink pt-3 text-sm font-bold">
                      Modeled effect by Sep ’27 versus the same assumptions
                      without a trigger: {signedCount(triggerLift)} active
                      people, {signedCount(triggerMemberLift)} members, and{" "}
                      {signedCount(triggerOrganizerLift)} organizers.
                    </p>
                  )}
                </>
              )}

              <p className="mt-4 border-t border-rule pt-3 text-xs leading-relaxed text-ink/65">
                Coral bands show the months when a trigger lifts the model. This
                draws on Bill Moyer’s Movement Action Plan, Stage 4 (take-off).
                A trigger is a scenario assumption, not a scheduled event or a
                prediction. MAP stages can overlap; the model does not predict
                public opinion or policy wins. Read the{" "}
                <a
                  className="font-bold underline decoration-coral underline-offset-2"
                  href="https://www.indybay.org/olduploads/movement_action_plan.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Movement Action Plan
                </a>
                .
              </p>
            </section>
            <label
              className="mt-2 block text-xs font-bold text-ink/70"
              htmlFor="journey-month"
            >
              Use the slider to choose a month
            </label>
            <input
              id="journey-month"
              className="mt-2 h-2 w-full cursor-pointer accent-brand-blue"
              type="range"
              min={0}
              max={12}
              step={1}
              value={selectedMonth}
              aria-label="Choose a month to inspect"
              onChange={(event) =>
                setSelectedMonth(Number(event.currentTarget.value))
              }
            />
            <p className="mt-4 border-l-4 border-coral bg-paper px-3 py-2 text-sm leading-snug">
              {selected.activeTriggerNames.length > 0 ? (
                <>
                  <strong>{selected.activeTriggerNames.join(", ")}</strong> is
                  active: reach is {multiplier(selected.triggerReachMultiplier)}
                  × base invitations per organizer and invitation-to-action
                  conversion is {multiplier(selected.triggerActionMultiplier)}×
                  the base rate; organizer training is{" "}
                  {multiplier(selected.triggerTrainingMultiplier)}× its base
                  rate.
                </>
              ) : triggerEvents.length > 0 ? (
                "No trigger window is active this month. Coral bands show when each event’s temporary lift applies."
              ) : (
                "No trigger is modeled yet. Add a hypothetical event in the panel above to see how it changes the curve."
              )}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              Trigger attention is temporary. If people return and become
              organizers, their work continues after the attention spike ends.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              <Metric
                label="Active people"
                value={shortCount(selected.participants)}
                detail={
                  chartMode === "monthly"
                    ? `${signedCount(selected.netNewParticipants)} this month`
                    : selected.date
                }
              />
              <Metric
                label="Members"
                value={shortCount(selected.members)}
                detail="People in an ongoing role"
              />
              <Metric
                label="Organizers"
                value={shortCount(selected.organizers)}
                detail="Trained and active in the model"
              />
            </div>
            <details className="mt-4 border-t-2 border-ink pt-3">
              <summary className="cursor-pointer text-sm font-bold">
                See this month’s activity details
              </summary>
              <div className="mt-3 grid grid-cols-2 border-t border-rule sm:grid-cols-4">
                {[
                  ["Invitations", selected.invitations],
                  ["First actions", selected.actions],
                  ["Repeat participants", selected.repeats],
                  ["Follow-up gap", selected.followUpShortfall],
                  ["Members", selected.members],
                  ["New member roles", selected.newMembers],
                  ["New organizers", selected.newlyTrained],
                  ["Local circles", selected.circles],
                ].map(([label, value]) => (
                  <div className="border-b border-rule px-2 py-3" key={label}>
                    <p className="text-xs font-bold text-ink/65">{label}</p>
                    <p className="mt-1 font-display text-xl leading-none font-bold tabular-nums">
                      {count(Number(value))}
                    </p>
                  </div>
                ))}
              </div>
            </details>
            <p className="mt-3 text-xs leading-relaxed text-ink/65">
              {chartMode === "cumulative"
                ? "The total view uses a logarithmic scale: equal vertical gaps mean 10× growth. "
                : "Monthly change is linear; below zero means the active group shrank. "}
              This is a scenario, not observed data or a forecast.
            </p>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink/65">
            Capacity assumes local circles handle follow-up; no central
            direct-support staff are included.
          </p>

          <details className="mt-5 border-t-2 border-ink pt-3">
            <summary className="cursor-pointer text-sm font-bold">
              See Q3 activity totals
            </summary>
            <div className="mt-3 grid grid-cols-2 border-t border-rule sm:grid-cols-3">
              {[
                ["Invitations", finalQuarter.invitations],
                ["First actions", finalQuarter.actions],
                ["Repeat participants", finalQuarter.repeats],
                ["Follow-up gap", finalQuarter.followUpShortfall],
                ["New member roles", finalQuarter.newMembers],
                ["New organizers", finalQuarter.newlyTrained],
              ].map(([label, value]) => (
                <div className="border-b border-rule px-3 py-3" key={label}>
                  <p className="text-xs font-bold text-ink/65">{label}</p>
                  <p className="mt-1 font-display text-2xl leading-none font-bold tabular-nums">
                    {shortCount(Number(value))}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <details className="mt-6 border-2 border-ink bg-white open:shadow-[5px_5px_0_var(--color-brand-yellow)]">
            <summary className="cursor-pointer list-none px-4 py-4 font-display text-2xl leading-none font-bold uppercase sm:px-5">
              Adjust the growth dials{" "}
              <span className="float-right text-brand-blue">＋</span>
            </summary>
            <div className="border-t-2 border-ink px-4 py-5 sm:px-5">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {(Object.keys(growthPresets) as GrowthPreset[]).map((key) => (
                  <button
                    className={`border-2 border-ink px-3 py-2 text-xs font-black tracking-widest uppercase transition-colors ${preset === key ? "bg-brand-yellow" : "bg-white hover:bg-paper"}`}
                    type="button"
                    key={key}
                    aria-pressed={preset === key}
                    onClick={() => choosePreset(key)}
                  >
                    {presetLabels[key]}
                  </button>
                ))}
                {preset === "custom" && (
                  <span className="px-2 py-2 text-xs font-bold text-ink/60">
                    Your assumptions
                  </span>
                )}
              </div>

              <div className="grid gap-x-8 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
                <fieldset>
                  <legend className="mb-1 font-display text-xl font-bold uppercase">
                    Invite & return
                  </legend>
                  <RangeDial
                    label="Invitations per organizer / quarter"
                    value={assumptions.invitationsPerOrganizer}
                    min={5}
                    max={10_000}
                    step={5}
                    output={count(assumptions.invitationsPerOrganizer)}
                    onChange={(value) =>
                      update("invitationsPerOrganizer", value)
                    }
                  />
                  <RangeDial
                    label="Invitation → first action"
                    value={assumptions.invitationToAction}
                    min={1}
                    max={50}
                    step={1}
                    output={percent(assumptions.invitationToAction)}
                    onChange={(value) => update("invitationToAction", value)}
                  />
                  <RangeDial
                    label="First action → repeat within 90 days"
                    value={assumptions.actionToRepeat}
                    min={1}
                    max={100}
                    step={1}
                    output={percent(assumptions.actionToRepeat)}
                    onChange={(value) => update("actionToRepeat", value)}
                  />
                </fieldset>

                <fieldset>
                  <legend className="mb-1 font-display text-xl font-bold uppercase">
                    Recruit & train
                  </legend>
                  <RangeDial
                    label="Repeat person → ongoing member role"
                    value={assumptions.repeatToMember}
                    min={1}
                    max={100}
                    step={1}
                    output={percent(assumptions.repeatToMember)}
                    onChange={(value) => update("repeatToMember", value)}
                  />
                  <RangeDial
                    label="Eligible members → organizer each quarter"
                    value={assumptions.memberToOrganizer}
                    min={1}
                    max={100}
                    step={0.5}
                    output={percent(assumptions.memberToOrganizer)}
                    onChange={(value) => update("memberToOrganizer", value)}
                  />
                  <RangeDial
                    label="Active participants retained each year"
                    value={assumptions.participantRetention}
                    min={20}
                    max={99}
                    step={1}
                    output={percent(assumptions.participantRetention)}
                    onChange={(value) => update("participantRetention", value)}
                  />
                  <RangeDial
                    label="Organizers retained each year"
                    value={assumptions.organizerRetention}
                    min={20}
                    max={99}
                    step={1}
                    output={percent(assumptions.organizerRetention)}
                    onChange={(value) => update("organizerRetention", value)}
                  />
                </fieldset>

                <fieldset>
                  <legend className="mb-1 font-display text-xl font-bold uppercase">
                    Starting size & capacity
                  </legend>
                  <CountDial
                    label="Active participants at start"
                    value={assumptions.startingPeople}
                    min={1}
                    max={100_000}
                    onChange={(value) => update("startingPeople", value)}
                  />
                  <CountDial
                    label="Trained organizers at start"
                    value={assumptions.startingOrganizers}
                    min={0}
                    max={10_000}
                    onChange={(value) => update("startingOrganizers", value)}
                  />
                  <CountDial
                    label="Members with an ongoing role"
                    value={assumptions.startingMembers}
                    min={0}
                    max={100_000}
                    onChange={(value) => update("startingMembers", value)}
                  />
                  <RangeDial
                    label="Repeat participants per circle"
                    value={assumptions.peoplePerCircle}
                    min={20}
                    max={40}
                    step={1}
                    output={count(assumptions.peoplePerCircle)}
                    onChange={(value) => update("peoplePerCircle", value)}
                  />
                </fieldset>
              </div>

              <p className="mt-5 max-w-3xl border-l-4 border-brand-yellow pl-3 text-xs leading-relaxed text-ink/70">
                The goal case is intentionally demanding: 500 invitations per
                organizer each quarter, 15.5% of eligible members becoming
                organizers each quarter, and 40 repeat participants per circle.
                Replace these assumptions with observed cohort rates as they
                become available.
              </p>
            </div>
          </details>

          <p className="mt-4 max-w-4xl text-xs leading-relaxed text-ink/65">
            <strong>Active participant:</strong> a distinct person completing at
            least two meaningful campaign actions in a rolling 12 months. A
            sign-up, impression, or RSVP by itself does not count. Starting
            counts and every conversion rate here are unverified assumptions.
          </p>
        </Container>
      </section>

      <section
        id="strategy"
        className="border-b-2 border-ink bg-white py-10 sm:py-14"
      >
        <Container>
          <div className="mb-7 max-w-3xl">
            <Label>Strategy</Label>
            <h2 className="mt-4 font-display text-4xl leading-none font-extrabold uppercase sm:text-5xl">
              One movement. One loop.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Each horizon answers a different question: why, what mission,
              where, what result, and which projects get us there.
            </p>
          </div>

          <div className="divide-y-2 divide-ink border-y-2 border-ink">
            {[
              ["H5", "Purpose", "Technology that serves the common good."],
              [
                "H4",
                "Mission",
                "Build a movement for an AI Treaty that prevents an AI arms race.",
              ],
              [
                "H3",
                "Campaign",
                "California: organize people and local leaders to build public support for a federal AI Treaty.",
              ],
              [
                "H2",
                "Objective · Oct 2026–Sep 2027",
                "Build an Act → Recruit → Train system toward 100,000 active people by Sep 30, 2027.",
              ],
              [
                "H1",
                "Projects",
                "Berkeley circle pilot · Fellowship-to-organizer path · practical training · California policy map.",
              ],
              [
                "H0",
                "Daily tasks",
                "Stay in internal work tools; this public strategy view shows no personal assignments.",
              ],
            ].map(([horizon, label, statement], index) => (
              <article
                className="grid gap-2 py-4 sm:grid-cols-[185px_1fr] sm:items-baseline sm:gap-6"
                key={horizon}
              >
                <p className="font-display text-2xl leading-none font-bold uppercase">
                  <span className="mr-2 text-coral-dark">{horizon}</span>
                  {label}
                </p>
                <p
                  className={
                    index < 2
                      ? "text-lg leading-snug font-bold"
                      : "text-sm leading-relaxed"
                  }
                >
                  {statement}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-black tracking-widest uppercase">
              The organizing loop
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["01", "Act", "Give people a meaningful campaign action."],
                [
                  "02",
                  "Recruit",
                  "Build relationships; invite people into an ongoing role.",
                ],
                [
                  "03",
                  "Train",
                  "Help members lead actions and bring in more people.",
                ],
              ].map(([number, title, description], index) => (
                <article
                  className={`border-2 border-ink p-4 ${index === 0 ? "bg-brand-blue text-white" : index === 1 ? "bg-coral" : "bg-brand-yellow"}`}
                  key={number}
                >
                  <p className="text-xs font-black tracking-widest">{number}</p>
                  <h3 className="mt-2 font-display text-3xl leading-none font-bold uppercase">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-snug">
                    {description}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Trained organizers lead the next action. Growth is only useful if
              people return, take responsibility, and can lead together.
            </p>
          </div>

          <details className="mt-8 border-t-2 border-ink pt-4">
            <summary className="cursor-pointer font-display text-2xl font-bold uppercase">
              Quarterly checkpoints · proposed
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/70">
              Ambitious targets to test, not adopted commitments or measured
              results.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuarterCard
                quarter="Q4 2026"
                date="Oct–Dec"
                target="100 active"
                action="Verify the baseline; test the Berkeley circle and connect learning to real action."
                status="In progress · Oct 16 snapshot"
              />
              <QuarterCard
                quarter="Q1 2027"
                date="Jan–Mar"
                target="1,000 active"
                action="Complete two local Act → Recruit → Train cycles; test Fellowship-to-organizer learning."
                status="Proposed · not adopted"
              />
              <QuarterCard
                quarter="Q2 2027"
                date="Apr–Jun"
                target="10,000 active"
                action="Improve the weakest measured transition; prepare next locations only with local leaders."
                status="Proposed · not adopted"
              />
              <QuarterCard
                quarter="Q3 2027"
                date="Jul–Sep"
                target="100,000 active"
                action="Scale the loop, or report the actual count, gap, and binding constraint."
                status="Proposed · not adopted"
              />
            </div>
          </details>

          <details className="mt-8 border-t-2 border-ink pt-4">
            <summary className="cursor-pointer font-display text-2xl font-bold uppercase">
              History to date · expand quarters
            </summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <article className="border-2 border-ink bg-paper p-4">
                <p className="text-xs font-black tracking-widest text-coral-dark uppercase">
                  March–May 2026 · reconstructed
                </p>
                <h4 className="mt-2 font-display text-2xl font-bold uppercase">
                  Establish a public starting point
                </h4>
                <p className="mt-2 text-sm leading-relaxed">
                  Public activity began in March; the brand launched April 30.
                  The website, organization email, LinkedIn presence, and
                  initial nonprofit paperwork were started. Berkeley campaign
                  exploration began; the exact inception date is not
                  established.
                </p>
              </article>
              <article className="border-2 border-ink bg-paper p-4">
                <p className="text-xs font-black tracking-widest text-coral-dark uppercase">
                  Q2 2026 · inferred from notes
                </p>
                <h4 className="mt-2 font-display text-2xl font-bold uppercase">
                  Learn locally; build the funding path
                </h4>
                <p className="mt-2 text-sm leading-relaxed">
                  Notes point to grant work, warm-network follow-up, local
                  listening, and campaign research. No standalone quarterly OKR
                  was found; broad cold outreach and a second entity were held
                  back.
                </p>
              </article>
              <article className="border-2 border-ink bg-paper p-4">
                <p className="text-xs font-black tracking-widest text-coral-dark uppercase">
                  Q3 2026 · formal OKRs
                </p>
                <h4 className="mt-2 font-display text-2xl font-bold uppercase">
                  Test campaigns and organizer pathways
                </h4>
                <p className="mt-2 text-sm leading-relaxed">
                  Formal objectives covered fundraising, participation pathways,
                  and recruitment actions. The Fellowship launched and eight
                  volunteer contributors were reported by September. Progress
                  against every target was not reconciled.
                </p>
              </article>
              <article className="border-2 border-ink bg-paper p-4">
                <p className="text-xs font-black tracking-widest text-coral-dark uppercase">
                  Q4 2026 · underway at Oct 16
                </p>
                <h4 className="mt-2 font-display text-2xl font-bold uppercase">
                  Test Berkeley organizing
                </h4>
                <p className="mt-2 text-sm leading-relaxed">
                  October direction centers on a Berkeley local-organizing
                  pilot, member and organizer workflows, and practical learning.
                  No formal Q4 re-baseline was found; the year-end update
                  remains open.
                </p>
              </article>
            </div>
          </details>

          <details className="mt-5 border-t border-rule pt-4">
            <summary className="cursor-pointer text-sm font-bold">
              Planning lenses & open alignment question
            </summary>
            <div className="mt-3 grid gap-3 text-sm leading-relaxed sm:grid-cols-3">
              <p>
                <a
                  className="font-bold underline decoration-coral underline-offset-4"
                  href="https://www.jimcollins.com/concepts/the-flywheel.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jim Collins
                </a>
                : improve one repeatable turn at a time.
              </p>
              <p>
                <a
                  className="font-bold underline decoration-coral underline-offset-4"
                  href="https://www.washingtonpost.com/archive/business/1983/10/06/an-insider-looks-at-management/0005629c-42c1-41e5-b4d5-28eeab030a0a/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Andy Grove
                </a>
                : optimize the work that multiplies results across the movement.
              </p>
              <p>
                <a
                  className="font-bold underline decoration-coral underline-offset-4"
                  href="https://commonslibrary.org/resistance-guide/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Paul Engler
                </a>
                : build organizers through action, relationships, and practice.
              </p>
            </div>
            <p className="mt-4 border-l-4 border-brand-yellow pl-3 text-sm leading-relaxed text-ink/70">
              An earlier strategy memo named “landmark legislation for
              democratic AI by 2030.” This draft keeps the AI Treaty as the
              current mission and California as the campaign focus without
              claiming those directions have been formally reconciled.
            </p>
          </details>
        </Container>
      </section>

      <section id="scorecard" className="bg-paper py-10 sm:py-14">
        <Container>
          <details className="border-2 border-ink bg-white open:shadow-[5px_5px_0_var(--color-brand-blue)]">
            <summary className="cursor-pointer list-none px-4 py-4 font-display text-3xl leading-none font-bold uppercase sm:px-5">
              Scorecard{" "}
              <span className="font-body text-sm font-bold normal-case">
                · what to measure
              </span>
              <span className="float-right text-brand-blue">＋</span>
            </summary>
            <div className="border-t-2 border-ink px-4 py-5 sm:px-5">
              <p className="mb-4 max-w-3xl text-sm leading-relaxed text-ink/75">
                Review monthly by cohort. Pick the weakest step to improve each
                quarter. Report participation separately from California policy
                milestones.
              </p>
              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [
                    "First action",
                    "Distinct people taking one meaningful campaign action.",
                  ],
                  [
                    "Return",
                    "First-time participants who take a second action within 90 days.",
                  ],
                  [
                    "Member role",
                    "Repeat participants who accept an ongoing responsibility.",
                  ],
                  [
                    "Organizer",
                    "Members trained who lead an action and its follow-up.",
                  ],
                  [
                    "Organizer return",
                    "Organizers who lead a second cycle and develop others.",
                  ],
                  [
                    "Circle capacity",
                    "Active participants and trained co-leads in each circle.",
                  ],
                  [
                    "Retention",
                    "Participants and organizers still active after 12 months.",
                  ],
                  [
                    "Policy progress",
                    "Publicly verifiable milestones, tracked separately.",
                  ],
                ].map(([label, description]) => (
                  <article
                    className="border-t border-rule py-3 sm:pr-5"
                    key={label}
                  >
                    <h3 className="font-display text-xl font-bold uppercase">
                      {label}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink/70">
                      {description}
                    </p>
                  </article>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink/60">
                Public reporting uses aggregate counts only. Do not publish
                personal assignments or details that could identify individual
                participants.
              </p>
            </div>
          </details>
        </Container>
      </section>
    </main>
  );
}
