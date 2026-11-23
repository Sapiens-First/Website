import Link from "next/link";
import HomePage from "@/app/(public)/page";
import { PreviewStage } from "./PreviewStage";
import styles from "./subtle.module.css";

/**
 * Homepage polish previews. Each option renders the real homepage unchanged
 * and layers subtle background and motion on top from subtle.module.css.
 * Throwaway: delete components/preview and app/(public)/preview.
 */

/** Options 1–3: lots of things ease in on scroll (everything below the hero). */
const revealMany = [
  "main > section:not(:first-child) :is(h2, blockquote, form)",
  "main > section:not(:first-child) h2 + p",
  "main > section:nth-child(2) .max-w-xl",
  "main > section:not(:first-child) [class*='grid-cols-3'] > div",
  "#vision .mt-5",
  "#strategy .grid > div > p",
].join(", ");

/** Option 4: only the section headings. */
const revealFew = [
  "main > section:not(:first-child) h2",
  "main > section:nth-child(2) .max-w-xl",
].join(", ");

export const previewOptions = [
  {
    id: "1",
    name: "Motion",
    layers: [styles.motion],
    reveal: revealMany,
  },
  {
    id: "2",
    name: "Soft edges",
    layers: [styles.motion, styles.blend],
    reveal: revealMany,
  },
  {
    id: "3",
    name: "Living background",
    layers: [styles.motion, styles.blend, styles.living],
    reveal: revealMany,
  },
  {
    id: "4",
    name: "Refined",
    layers: [styles.calm, styles.blend, styles.living, styles.vivid],
    reveal: revealFew,
  },
] as const;

export type PreviewOption = (typeof previewOptions)[number]["id"];

export function SubtleHome({ option }: { option: PreviewOption }) {
  const current = previewOptions.find((o) => o.id === option)!;

  return (
    <>
      <PreviewStage
        className={[styles.stage, ...current.layers].join(" ")}
        reveal={current.reveal}
      >
        <div className={styles.backdrop} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <HomePage />

        <nav className={styles.switcher} aria-label="Design options">
          {previewOptions.map((o) => (
            <Link
              key={o.id}
              href={`/preview/${o.id}`}
              aria-current={o.id === option ? "page" : undefined}
            >
              <b>{o.id}</b> {o.name}
            </Link>
          ))}
          <Link href="/" className={styles.current}>
            Current site
          </Link>
        </nav>
      </PreviewStage>
    </>
  );
}
