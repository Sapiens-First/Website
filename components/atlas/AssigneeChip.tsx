"use client";

import { useHolders } from "@/components/atlas/Holders";
import type { AtlasRow } from "@/lib/atlas/model";

function Lock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2" y="5" width="8" height="6" rx="1.5" fill="currentColor" />
      <path
        d="M4 5V3.6a2 2 0 0 1 4 0V5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
  );
}

export default function AssigneeChip({ row }: { row: AtlasRow }) {
  const holders = useHolders();
  if (!holders) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-ink/6 px-2.5 py-1 text-[13px] font-semibold text-muted-foreground"
        title="Names are visible to signed-in members"
      >
        <Lock />
        Redacted
      </span>
    );
  }
  const names = holders[row.ID] ?? [];
  if (!names.length) {
    return (
      <span className="text-[15px] font-semibold text-muted-foreground">
        Unfilled
      </span>
    );
  }
  return (
    <span className="text-[15px] font-semibold text-ink">
      {names.join(", ")}
    </span>
  );
}
