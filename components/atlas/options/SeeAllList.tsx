"use client";

import { useId, useState, type ReactNode } from "react";
import { plural } from "./text";

export default function SeeAllList<T>({
  items,
  noun,
  itemKey,
  renderItem,
  listClassName,
  forceOpen = false,
}: {
  items: T[];
  noun: string;
  itemKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  listClassName?: string;
  forceOpen?: boolean;
}) {
  const listId = useId();
  const long = items.length > 6;
  const [mode, setMode] = useState<"auto" | "open" | "closed">("auto");
  const [seenForce, setSeenForce] = useState(false);
  if (forceOpen && !seenForce) {
    setSeenForce(true);
    setMode("open");
  } else if (!forceOpen && seenForce) {
    setSeenForce(false);
  }
  const open = !long || mode === "open" || (mode === "auto" && forceOpen);
  const [live, setLive] = useState("");
  return (
    <div className={open ? "lst is-open" : "lst"}>
      <ul id={listId} className={listClassName}>
        {items.map((item, index) => (
          <li
            key={itemKey(item)}
            data-extra={long && index >= 5 ? "" : undefined}
            hidden={long && index >= 5 && !open}
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
      {long ? (
        <button
          type="button"
          className="more"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => {
            const next = !open;
            setMode(next ? "open" : "closed");
            setLive(
              next
                ? `Showing all ${plural(items.length, noun)}`
                : `Showing ${plural(5, noun)}`,
            );
          }}
        >
          {open ? "Show fewer" : `See all ${plural(items.length, noun)}`}{" "}
          <span className="ar" aria-hidden="true">
            {open ? "↑" : "↓"}
          </span>
        </button>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
    </div>
  );
}
