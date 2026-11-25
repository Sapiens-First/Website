"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./site-backdrop.module.css";

/**
 * Site-wide background: soft brand-colour washes behind every page that
 * drift slowly and shift with scroll (--p, 0 → 1 down the page). Skipped on
 * pages that bring their own background.
 */
export default function SiteBackdrop() {
  const path = usePathname();
  const skip =
    path === "/no-tech-kings" ||
    path.startsWith("/no-tech-kings/") ||
    path.startsWith("/preview");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (skip || !el) return;
    const html = document.documentElement;
    html.setAttribute("data-site-bg", "");

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(1, html.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      html.removeAttribute("data-site-bg");
    };
  }, [skip, path]);

  if (skip) return null;
  return (
    <div ref={ref} className={styles.backdrop} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
