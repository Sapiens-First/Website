"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Design-preview root. Publishes scroll progress as --p (0 → 1 over the
 * page) and reveals elements matching `reveal` as they scroll in, staggered
 * within their section. Without JS (or with reduced motion) nothing is hidden.
 */
export function PreviewStage({
  className,
  reveal,
  children,
}: {
  className?: string;
  reveal?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      root.style.setProperty("--p", clamp(window.scrollY / max).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let io: IntersectionObserver | undefined;
    if (reveal && !reduce && "IntersectionObserver" in window) {
      const items = [...root.querySelectorAll<HTMLElement>(reveal)];
      const perSection = new Map<Element | null, number>();
      for (const item of items) {
        const section = item.closest("section");
        const i = perSection.get(section) ?? 0;
        perSection.set(section, i + 1);
        item.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
        item.setAttribute("data-inview", "");
      }
      root.setAttribute("data-reveal", "");
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute("data-in", "");
            io?.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      items.forEach((item) => io?.observe(item));
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
    };
  }, [reveal]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
