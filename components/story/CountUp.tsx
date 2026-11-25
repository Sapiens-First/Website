"use client";

import { useEffect, useRef } from "react";

/**
 * Text whose numbers count up from zero the first time it scrolls into view,
 * e.g. "300–400" or "50+". Renders the final text on the server, and keeps
 * it without JS or with reduced motion. Screen readers get the final text.
 */
export function CountUp({
  value,
  duration = 1400,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const parts = value.split(/(\d+)/);
    const render = (t: number) => {
      el.textContent = parts
        .map((part, i) => (i % 2 ? String(Math.round(Number(part) * t)) : part))
        .join("");
    };
    render(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          render(1 - (1 - t) ** 3);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, duration]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
