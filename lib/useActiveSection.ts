"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy shared by the policy, guide and builder tables of contents.
 * A section is active once its top reaches `offset` (default: its own scroll-margin-top);
 * the last section wins at the bottom of the page.
 */
export function useActiveSection(ids: readonly string[], offset?: number) {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null);
    if (!sections.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: HTMLElement | undefined;
      for (const section of sections) {
        const line =
          offset ?? parseFloat(getComputedStyle(section).scrollMarginTop) + 2;
        if (section.getBoundingClientRect().top <= line) current = section;
        else break;
      }
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      setActiveId((atBottom ? sections.at(-1) : current)?.id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids, offset]);

  return activeId;
}
