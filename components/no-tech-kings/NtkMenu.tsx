"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ntk.module.css";

type BarLink = { label: string; href: string };

/**
 * Hamburger for narrow screens: the page links drop down under the bar.
 * Hidden at 1000px and up, where the links fit inline.
 */
export function NtkMenu({ nav }: { nav: readonly BarLink[] }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target) || button.current?.contains(target))
        return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        ref={panel}
        id={id}
        className={styles.menu}
        data-open={open ? "" : undefined}
        inert={!open}
      >
        <nav aria-label="On this page">
          {nav.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
