# Page stories

Each main page has its own short story told through its sections, the way
the homepage runs from a spark to a fire (see `components/home/story/`).
Each piece is one component and one CSS module, used once in its page.
They're all decorative (`aria-hidden`), they don't change any page copy, and
they hold still with reduced motion. To remove one, delete its line in the
page.

Shared here:

- `InView` adds `data-in` the first time an element scrolls into view, so
  CSS can play an entrance.
- `Rise` fades its direct children up in turn as it scrolls in.
- `CountUp` counts the numbers in a string up from zero as it scrolls in.

## About: Gathering (`components/about/story/`)

| Section  | Story                                                                                            | Component                  |
| -------- | ------------------------------------------------------------------------------------------------ | -------------------------- |
| Hero     | Birds form one flock over a flat poster sunrise; halos open and light shimmers toward the viewer | `HeroFlock`, `HeroHorizon` |
| Vision   | Each focus area's colour flies in to stack into one sun                                          | `FocusConverge`            |
| Our Plan | Local groups → state campaigns → federal action, wider ripples each step                         | `PlanSteps`                |
| Strategy | A spark laps Act → Recruit → Train, and each node flares                                         | `CycleSpark`               |
| Founder  | The photo is dealt onto a fanned stack of cards                                                  | `FounderStack`             |

## Human Charter: the North Star (`components/charter/story/`)

One eight-pointed star, one ray per principle, coloured by pillar.

| Section    | Story                                                                        | Component                    |
| ---------- | ---------------------------------------------------------------------------- | ---------------------------- |
| Hero       | All eight rays draw in, in order                                             | `NorthStar variant="hero"`   |
| The Stakes | Night, with one star brighter than the rest                                  | `StakesNight`                |
| Principles | One row per pillar of SDG-style flip cards, the North Star in the spare seat | `PrincipleGrid`              |
| Sign       | The finished star shines on the dark panel                                   | `NorthStar variant="beacon"` |

## Donate: Fuel (`components/donate/story/`)

| Section         | Story                                                                 | Component         |
| --------------- | --------------------------------------------------------------------- | ----------------- |
| Hero            | People bob, the links between them flow, the bubble speaks            | `DonateCircle`    |
| Local groups    | Embers light down California's cities                                 | `SeedCities`      |
| Our story       | The numbers count up                                                  | `CountUp`, `Rise` |
| Founding patron | A small ring of patrons around the flame, inside the turning movement | `PatronCircle`    |

## Get involved and policy

| Page     | Story                                                         | Component     |
| -------- | ------------------------------------------------------------- | ------------- |
| Policy   | 12 blocks stack into 3 pillars and a roof: the people's house | `AgendaHouse` |
| Calendar | Event days in a little month catch like embers, in turn       | `MonthSparks` |
| Groups   | Pins drop onto cities on the dotted US map                    | `MapPins`     |

Low-traffic pages (Atlas, Careers, Privacy) are left plain on purpose. No
Tech Kings has its own story in `components/no-tech-kings/`.
