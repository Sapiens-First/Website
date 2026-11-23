# Homepage story

Each homepage section has one background image, and together they run from
a spark to a fire:

| Section      | Theme     | Component        |
| ------------ | --------- | ---------------- |
| Hero         | Spark     | `HeroEmbers`     |
| Crisis       | Night     | `CrisisSky`      |
| Vision       | Daybreak  | `VisionDaybreak` |
| Strategy     | Spreading | `StepNetwork`    |
| Get involved | Fire      | `InvolvedFire`   |

Embers on the seed cities in the hero; the dark of the crisis; first light
behind No Tech Kings; the cities lighting up and connecting, one step at a
time; and the sparks from the hero grown into a fire at the call to join.

Each theme is one component and one CSS module, used once in
`app/(public)/page.tsx`. Delete the component's line there to remove it.
All of them are decorative (`aria-hidden`) and still with reduced motion.
