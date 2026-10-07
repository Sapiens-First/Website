"use client";

import { useEffect, useRef } from "react";
import { useActiveSection } from "@/lib/useActiveSection";

const sections = [
  { id: "about-sapiens-first", title: "About Sapiens First" },
  { id: "the-role", title: "About the Role" },
  { id: "about-you", title: "About You" },
  { id: "benefits", title: "Benefits" },
  { id: "apply", title: "Apply" },
];
const ids = sections.map((section) => section.id);
// Tailwind's `lg` breakpoint, matching the page's max-lg: layout.
const desktopQuery = "(min-width: 64rem)";

export default function BuilderToc() {
  const toc = useRef<HTMLDetailsElement>(null);
  const activeId = useActiveSection(ids);

  useEffect(() => {
    const desktop = window.matchMedia(desktopQuery);
    const sync = () => {
      if (toc.current) toc.current.open = desktop.matches;
    };
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);

  function navigate(id: string) {
    const details = toc.current;
    if (details && !window.matchMedia(desktopQuery).matches) {
      // Collapse instantly so the jump lands on the heading, not mid-animation.
      details.setAttribute("data-navigating", "");
      details.open = false;
      requestAnimationFrame(() => details.removeAttribute("data-navigating"));
    }
    const target = document.getElementById(id);
    target?.setAttribute("tabindex", "-1");
    target?.focus({ preventScroll: true });
  }

  return (
    <details
      ref={toc}
      className="group/toc data-navigating:details-content:transition-none supports-[interpolate-size:allow-keywords]:[interpolate-size:allow-keywords] supports-[interpolate-size:allow-keywords]:details-content:h-0 supports-[interpolate-size:allow-keywords]:details-content:overflow-clip supports-[interpolate-size:allow-keywords]:details-content:transition-[height,content-visibility] supports-[interpolate-size:allow-keywords]:details-content:transition-discrete supports-[interpolate-size:allow-keywords]:details-content:duration-240 supports-[interpolate-size:allow-keywords]:open:details-content:h-auto motion-reduce:details-content:transition-none max-lg:border-t max-lg:border-b max-lg:border-solid max-lg:border-t-rule max-lg:border-b-rule max-lg:px-0 max-lg:py-1"
      open
    >
      <summary className="cursor-pointer px-0 py-3 text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        On this page
      </summary>
      <nav aria-label="Job description sections">
        <ul className="mx-0 mt-2 mb-5 list-none p-0">
          {sections.map((section) => (
            <li className="m-0 p-0 text-base leading-normal" key={section.id}>
              <a
                href={`#${section.id}`}
                className="block border-l-2 border-rule px-3 py-2 font-semibold text-ink no-underline transition-[background-color,border-color] duration-200 hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[current=location]:border-coral-dark aria-[current=location]:bg-soft motion-reduce:transition-none"
                aria-current={activeId === section.id ? "location" : undefined}
                onClick={() => navigate(section.id)}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
