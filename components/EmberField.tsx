"use client";

import { useEffect, useRef } from "react";

const colors = [
  "#ff5252",
  "#ff8080",
  "#ffbe0b",
  "#c80000",
  "#ff6b6b",
  "#ffd60a",
];

/** Randomised embers are created after mount so server and client markup match. */
export default function EmberField() {
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = field.current;
    if (!element) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 174; i++) {
      const ember = document.createElement("div");
      ember.className =
        "absolute animate-ember rounded-full opacity-0 shadow-[0_0_var(--eg,3px)_var(--ec,#f97316)]";
      const size = 1.5 + Math.random() * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = (2.2 + Math.random() * 3.52).toFixed(2);
      const delay = (-Math.random() * 7).toFixed(2);
      const peak = (0.35 + Math.random() * 0.55).toFixed(2);
      const glow = (size * 1.8).toFixed(1);
      const x = Math.random() * 100;
      const y = ((-0.8 + Math.sqrt(0.64 + 0.8 * Math.random())) / 0.4) * 100;
      ember.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:${color};--ec:${color};--ed:${duration}s;--ey:${delay}s;--ep:${peak};--eg:${glow}px`;
      fragment.appendChild(ember);
    }
    element.appendChild(fragment);
    return () => element.replaceChildren();
  }, []);
  return (
    <div
      className="pointer-events-none absolute inset-0 z-1"
      aria-hidden="true"
      ref={field}
    />
  );
}
