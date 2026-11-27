"use client";

import { useEffect, useState } from "react";
import type { AtlasOption } from "@/lib/atlas/option";
import "./options.css";

const choices: { value: AtlasOption | null; label: string }[] = [
  { value: null, label: "Current" },
  { value: "a", label: "Outline" },
  { value: "b", label: "Columns" },
  { value: "c", label: "Chart" },
];

export default function OptionSwitcher({
  current,
}: {
  current: AtlasOption | null;
}) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (!current) return;
    const root = document.documentElement;
    const previous = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = "150px";
    return () => {
      root.style.scrollPaddingTop = previous;
    };
  }, [current]);
  return (
    <nav className="opt-switch" aria-label="Atlas design options">
      <span>Design</span>
      {choices.map((choice) => {
        const query = choice.value ? `?option=${choice.value}` : "";
        const on = current === choice.value;
        return (
          <a
            key={choice.label}
            href={`/atlas${query}${hash}`}
            aria-current={on ? "true" : undefined}
          >
            {choice.label}
          </a>
        );
      })}
    </nav>
  );
}
