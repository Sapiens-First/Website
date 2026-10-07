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
      details.classList.add("is-navigating");
      details.open = false;
      requestAnimationFrame(() => details.classList.remove("is-navigating"));
    }
    const target = document.getElementById(id);
    target?.setAttribute("tabindex", "-1");
    target?.focus({ preventScroll: true });
  }

  return (
    <details
      ref={toc}
      className="job-toc max-lg:border-t max-lg:border-b max-lg:border-solid max-lg:border-t-rule max-lg:border-b-rule"
      open
    >
      <summary>On this page</summary>
      <nav aria-label="Job description sections">
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
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
