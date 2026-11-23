/**
 * The elements of the "day after dawn" backdrop. Each one is a separate
 * block in day-backdrop.module.css, scaled by its level (0 = removed,
 * 1 = full). `start` is the current pick from review (warm layers halved after the
 * second review); elements at 0 are
 * kept here only so they can be brought back in the preview.
 *
 * Story: No Tech Kings is the night and the sunrise. Every other page picks
 * up just after dawn and runs one day as you scroll: morning at the top,
 * plain daylight through the middle, golden hour at the bottom.
 */
export const dayLayers = [
  {
    id: "warmth",
    start: 0.5,
    label: "Warm paper",
    note: "The page colour warms from paper to cream to peach as you scroll.",
  },
  {
    id: "sky",
    start: 0.5,
    label: "Sky tint",
    note: "A peach-gold dawn at the top of the page and a pink blush at dusk.",
  },
  {
    id: "sun",
    start: 0,
    label: "Sun glow",
    note: "A large soft glow on an arc: low left → high centre → low right, yellow → coral.",
  },
  {
    id: "rays",
    start: 0,
    label: "Light rays",
    note: "Faint rays turning slowly around the sun, strongest at morning and golden hour.",
  },
  {
    id: "haze",
    start: 0.5,
    label: "Horizon haze",
    note: "A warm band along the bottom of the screen, peach in the morning, coral at dusk.",
  },
  {
    id: "clouds",
    start: 0,
    label: "Clouds",
    note: "Four soft clouds drifting by, pink at dawn, peach later on.",
  },
  {
    id: "birds",
    start: 1,
    label: "Birds",
    note: "Three small flocks: one in the morning, one at midday, one heading home at dusk.",
  },
  {
    id: "hills",
    start: 0,
    label: "Hills",
    note: "Three layers of hills at the bottom that rise into view as the day goes on.",
  },
  {
    id: "trees",
    start: 0,
    label: "Trees",
    note: "A few trees along the nearest hill. Has no effect when Hills is off.",
  },
  {
    id: "motes",
    start: 0,
    label: "Golden-hour motes",
    note: "Specks of light drifting upward in the last third of the page.",
  },
  {
    id: "grain",
    start: 1,
    label: "Paper grain",
    note: "A fine paper texture over the whole backdrop.",
  },
  {
    id: "footer",
    start: 1,
    label: "See-through footer",
    note: "Fades the footer's cream fill so the golden hour shows behind it.",
  },
  {
    id: "motion",
    start: 1,
    label: "Motion speed",
    note: "Speed of the drifting, flapping and floating. 0 = completely still.",
  },
] as const;

export type DayLayerId = (typeof dayLayers)[number]["id"];
export type DayLevels = Record<DayLayerId, number>;

export const fullLevels = Object.fromEntries(
  dayLayers.map((l) => [l.id, 1]),
) as DayLevels;

export const startLevels = Object.fromEntries(
  dayLayers.map((l) => [l.id, l.start]),
) as DayLevels;
