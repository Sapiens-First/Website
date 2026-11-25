"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * A div that gets `data-in` the first time it scrolls into view, so CSS can
 * play an entrance. Without JS, or with reduced motion, it is marked in
 * straight away and shows its final state.
 */
export function InView(props: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      el.setAttribute("data-in", "");
      return;
    }
    el.setAttribute("data-wait", "");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.setAttribute("data-in", "");
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} {...props} />;
}
