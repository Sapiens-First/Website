"use client";

import { useState } from "react";
import {
  Gauge,
  HandCoins,
  Handshake,
  Landmark,
  MessagesSquare,
  RotateCw,
  Scale,
  Sprout,
  Wrench,
} from "lucide-react";
import { Label } from "@/components/ui/Text";
import { NorthStar } from "@/components/charter/story/NorthStar";
import { pillars, type Pillar, type Principle } from "./principles";
import { cn } from "@/lib/cn";
import styles from "./principle-grid.module.css";

const icons = {
  gauge: Gauge,
  handshake: Handshake,
  landmark: Landmark,
  scale: Scale,
  messages: MessagesSquare,
  wrench: Wrench,
  coins: HandCoins,
  sprout: Sprout,
} as const;

/** Front-of-card colours for each pillar's tone. */
const tileColors = {
  yellow: "bg-brand-yellow text-ink",
  blue: "bg-brand-blue-dark text-white",
  purple: "bg-brand-purple text-white",
} as const;

/**
 * The Human Charter as a grid of flip cards, SDG-style: one row per pillar,
 * labelled on the left, with the North Star in the spare first seat of the
 * two-principle row. Each card turns over to show its principle.
 */
/** Where each pillar's numbering starts: 01, 03, 06. */
const starts = pillars.map((_, p) =>
  pillars.slice(0, p).reduce((sum, x) => sum + x.principles.length, 1),
);

export function PrincipleGrid() {
  return (
    <div className="mt-12 space-y-10 lg:space-y-5">
      {pillars.map((pillar, p) => (
        <div
          key={pillar.numeral}
          className="grid gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-[minmax(0,17rem)_repeat(3,minmax(0,1fr))] lg:gap-5"
        >
          <PillarLabel pillar={pillar} />
          {p === 0 && <CharterTile />}
          {pillar.principles.map((principle, i) => (
            <PrincipleCard
              key={principle.title}
              number={String(starts[p] + i).padStart(2, "0")}
              pillar={pillar}
              principle={principle}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PillarLabel({ pillar }: { pillar: Pillar }) {
  return (
    <div className="sm:col-span-3 lg:col-span-1 lg:self-center lg:pr-2">
      <Label tone={pillar.tone}>
        {pillar.numeral} · {pillar.value}
      </Label>
      <h3 className="mt-3 font-display text-3xl leading-none font-extrabold tracking-tight uppercase lg:text-4xl">
        {pillar.title}
      </h3>
      <p className="mt-2 max-w-md text-base leading-snug text-ink/80">
        {pillar.deck}
      </p>
    </div>
  );
}

function CharterTile() {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden border-2 border-ink bg-ink p-5 text-center text-white max-sm:hidden lg:aspect-square"
      aria-hidden="true"
    >
      <NorthStar variant="beacon" className="w-24 lg:w-28" />
      <p className="mt-4 font-display text-2xl leading-none font-extrabold tracking-tight uppercase lg:text-3xl">
        The Human Charter
      </p>
      <p className="mt-2 text-xs font-bold tracking-widest text-brand-yellow uppercase">
        8 principles · 3 pillars
      </p>
    </div>
  );
}

function PrincipleCard({
  number,
  pillar,
  principle,
}: {
  number: string;
  pillar: Pillar;
  principle: Principle;
}) {
  const [flipped, setFlipped] = useState(false);
  const Icon = icons[principle.icon];
  const tile = tileColors[pillar.tone];

  return (
    <button
      type="button"
      id={`principle-${number}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      className={cn(
        styles.card,
        "group block w-full scroll-mt-28 text-left font-body focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink lg:aspect-square",
      )}
    >
      <span className={styles.inner}>
        <span
          className={cn(
            styles.face,
            "flex min-h-48 flex-col border-2 border-ink p-5 sm:min-h-64 lg:p-6",
            tile,
          )}
          aria-hidden={flipped}
        >
          <span className="font-display text-3xl leading-none font-extrabold tracking-tight opacity-85">
            {number}
          </span>
          <span className="mt-2 font-display text-[2rem] leading-[0.92] font-extrabold tracking-tight text-balance uppercase sm:text-[1.6rem] lg:text-[2.15rem] xl:text-[2.3rem]">
            {principle.short}
          </span>
          <span className="mt-auto flex items-end justify-between gap-4 pt-6">
            <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase opacity-80">
              Read
              <RotateCw
                className="size-3.5 transition-transform duration-300 group-hover:rotate-90"
                aria-hidden="true"
              />
            </span>
            <Icon
              className="size-14 shrink-0 transition-transform duration-300 group-hover:-rotate-6 sm:size-16 lg:size-20"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        </span>
        <span
          className={cn(
            styles.face,
            styles.back,
            "flex flex-col border-2 border-ink bg-paper p-5 text-ink lg:p-6",
          )}
          aria-hidden={!flipped}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-xs font-black tracking-widest uppercase">
              {number} · {pillar.value}
            </span>
            <span className={cn("size-4 shrink-0 border-2 border-ink", tile)} />
          </span>
          <span className="mt-4 font-display text-2xl leading-[0.95] font-extrabold tracking-tight uppercase lg:text-[1.7rem]">
            {principle.title}
          </span>
          <span className="mt-3 text-base leading-snug">{principle.text}</span>
          <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-black tracking-widest uppercase opacity-60">
            Back
            <RotateCw className="size-3.5" aria-hidden="true" />
          </span>
        </span>
      </span>
    </button>
  );
}
