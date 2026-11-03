# Brand mark provenance

The active mark is the original orange flame. The header, footer, and browser and app icons use the artwork from `archive/2026-10-15-flame/production-original/`.

## Dinosaur logo exploration

Rohan supplied the smiling dinosaur PNG and requested a saturated-purple version on October 15, 2026. The purple dinosaur was used on the website before the original flame was restored.

- Untouched supplied image: `source/dinosaur-original.png` (copied from the attached `codex-clipboard-74d6d770-9005-4b7a-8637-da8628e1e740.png`).
- Transparent purple master: `source/dinosaur-purple.png`.
- Tool: built-in image generation/editing tool, precise-object edit with transparency. The first purple output is used; a subsequent cleanup variation was discarded. This is a raster recolor, not a newly traced vector or a claim of pixel-identical geometry.
- The header and footer used the purple master, and the dinosaur PNG and ICO browser variants were downscaled from it with ImageMagick.
- `archive/2026-10-15-flame/palette-c-blue/` preserves all pre-change local favicon assets from commit `fad4500`.
- `archive/2026-10-15-flame/production-original/` preserves the production favicon assets from commit `bc36ee957c3d926022674d3a5ed8f0c987d73ab0`.
- `archive/2026-10-15-flame/SHA256SUMS` verifies the archived files. Archives are outside the served public directory.

## Final selected edit prompt

Use case: precise-object-edit

Asset type: website dinosaur logo, transparent PNG

Input images: Image 1 is the edit target, the user's approved dinosaur silhouette.

Primary request: Change only the black dinosaur's fill to one flat, opaque saturated purple, #8B4DFF. Preserve the EXACT existing silhouette, smiling expression, eye cutout, open mouth, raised hands, curved tail, feet, pose and proportions. Keep the square framing and all original negative spaces.

Scene/backdrop: genuinely transparent background, including eye and mouth cutouts.

Constraints: strictly a color replacement of the supplied mark, no redesign, no added details, no gradients, no shading, no outlines, no text, no watermark. Crisp smooth edges, logo suitable for a website header.

Generated color is visually saturated violet and has small raster variation; the CSS accent remains the exact `brand-purple` token. Do not describe the raster as an exact flat-color vector.
