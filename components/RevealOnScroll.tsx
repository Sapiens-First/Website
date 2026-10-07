"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Adds `.visible` to each `.reveal` element as it scrolls into view; re-runs per route. */
export default function RevealOnScroll() {
  const path = usePathname();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);
  return null;
}
