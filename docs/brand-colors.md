# Palette C — bright and warm

Selected by Rohan on October 15, 2026 for local implementation and review. Publication requires his approval of the combined localhost preview. Develop in small local commits and publish the approved batch together.

The shared colors live in `app/globals.css`. Use these tokens instead of adding independent brand hex values to components.

| Role                                     | Token           | Color   |
| ---------------------------------------- | --------------- | ------- |
| Page canvas                              | paper           | #FFFDF5 |
| Alternate sections                       | soft            | #FFF3D6 |
| Text, outlines, footer                   | ink             | #18251F |
| Coral actions, highlights and decoration | coral           | #FF7870 |
| Readable red text on light surfaces      | coral-dark      | #B53236 |
| Blue accents                             | brand-blue      | #1678EE |
| Yellow labels and Donate                 | brand-yellow    | #FFC928 |
| Green brand accent and success fills     | success         | #00A878 |
| Purple accents                           | brand-purple    | #8B4DFF |
| Pink accents                             | brand-pink      | #ED3B91 |
| Light blue surfaces                      | brand-blue-soft | #D8EBFF |
| Pale coral surfaces                      | coral-soft      | #FFE8E3 |
| Decorative peach                         | brand-peach     | #FFD5B5 |
| Dividers                                 | rule            | #DBD7C7 |
| Secondary copy                           | muted           | #59665E |

For readable smaller text, use `brand-blue-dark` (#1557A4), `brand-purple-dark` (#6B32C9) and `success-dark` (#006C4B) on light surfaces. Blue text on ink uses `brand-blue-light` (#79B7FF). Blue labels and the Charter's blue fact card use the deep blue with white text. Rohan's subsequent feedback restores the original lighter coral for primary actions, paired with ink labels (6.18:1 contrast) and a pale coral hover. Text-heavy coral panels and tags stay pale coral; red text uses the darker variant. Do not use dark red as a filled action color. The header Join action uses the selected active blue with a bold white display label, with deep blue on hover.

The active mark is `public/assets/brand/dinosaur-purple.png`: Rohan's supplied smiling dinosaur recolored in saturated purple using the built-in image editor. The header pairs a 48px dinosaur (36px on phones) with a horizontal Barlow Condensed wordmark and coral underline. Following Rohan’s correction, the navigation follows the original/ACLU-style plain bold links and rectangular actions rather than rounded pills or a stacked wordmark. Primary navigation is About, Calendar and Campaigns; Donate stays yellow and Join stays active blue; both retain bold display labels (20px, extra bold) for legibility. On phones, the primary navigation remains visible in a second row. About and Campaigns are direct links to their overview pages with separate arrow buttons for their dropdowns. About includes Our Story, Careers and Atlas; Campaigns contains only the four individual campaigns, with no redundant All campaigns entry. Primary labels use18px bold type (14px on phones); main controls share a48px minimum height. Balanced spacing and quieter button shadows keep the hierarchy clear. Only one menu opens at a time. Escape closes it and returns focus, and outside clicks/focus departure close it. Campaigns stays active on its detail pages. The footer retains its 40px mark, white wordmark and four-color stripe on ink. Browser/device PNG and ICO sizes are downscaled from the same purple master. The original attachment is preserved unchanged in `design/brand/source/dinosaur-original.png`. Both the production flame and the local blue flame, including their icon variants, are archived under `design/brand/archive/2026-10-15-flame/` with checksums. See `design/brand/README.md` for provenance and the edit prompt. These are local review assets until Rohan approves publication.

The manifest and browser theme match the paper canvas. Atlas circle colors use the selected C tints, retaining record/category assignments and existing label behavior. Its scrolling toolbar clears the header at96px on desktop and128px on tablets; it stays static on smaller screens. Recheck these offsets when changing header dimensions. Brand overlays follow the base color at their previous opacity. Photography and skin tones keep their natural colors.
