"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./ntk.module.css";

/** How far into the sunrise the page is when the Demand section arrives. */
const FIRST_LIGHT = 0.22;
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Page root. Drives the sunrise: --rise stays near 0 (black) at the top,
 * reaches first light by the Demand section, and hits 1 (sun up) at the
 * closing Get Involved section. Also reveals
 * [data-inview] blocks as they scroll in (content stays visible without JS).
 */
export function NtkStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const demand = root.querySelector<HTMLElement>("#demand");
      const signup = root.querySelector<HTMLElement>("#involved");
      if (!demand || !signup) return;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - vh,
      );
      const at = (el: HTMLElement) =>
        el.getBoundingClientRect().top + y - vh * 0.15;
      const sunUp = Math.max(1, Math.min(at(signup), maxScroll));
      const firstLight = Math.max(1, Math.min(at(demand), sunUp - 1));
      // Night at the top, first colour by Demand, sun fully up at the end.
      const rise =
        y <= firstLight
          ? FIRST_LIGHT * (y / firstLight) ** 2
          : FIRST_LIGHT +
            (1 - FIRST_LIGHT) *
              smooth(Math.min(1, (y - firstLight) / (sunUp - firstLight)));
      root.style.setProperty("--rise", rise.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const blocks = root.querySelectorAll<HTMLElement>("[data-inview]");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let io: IntersectionObserver | undefined;
    if (!reduce && "IntersectionObserver" in window) {
      root.setAttribute("data-reveal", "");
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute("data-in", "");
            io?.unobserve(entry.target);
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
      );
      blocks.forEach((block) => io?.observe(block));
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.page} ${className ?? ""}`}>
      {children}
    </div>
  );
}
