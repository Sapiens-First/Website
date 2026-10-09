import type { CSSProperties } from "react";
const masks = {
  circle:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='6.5' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='8' r='2.4' fill='%23000'/%3E%3C/svg%3E\")",
  role: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='5.4' r='2.6' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3Cpath d='M2.6 14c.7-3 2.8-4.6 5.4-4.6s4.7 1.6 5.4 4.6' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
  mission:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 1v14M8 3l5 2.5L8 8 3 5.5 8 3z' fill='none' stroke='%23000' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  pillar:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 1.5l6 3v3c0 4-2.6 6.4-6 7-3.4-.6-6-3-6-7v-3z' fill='none' stroke='%23000' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  program:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M2.5 2.5v11M2.5 2.5h8.3l-1.6 2.7 1.6 2.6H2.5' fill='none' stroke='%23000' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  project:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='2.5' y='2.5' width='11' height='11' rx='2' fill='none' stroke='%23000' stroke-width='1.4'/%3E%3Cpath d='M5 8.2l2 2 4-4.4' fill='none' stroke='%23000' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  product:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 1.5l6 3.3v6.4L8 14.5l-6-3.3V4.8z' fill='none' stroke='%23000' stroke-width='1.4' stroke-linejoin='round'/%3E%3Cpath d='M2 4.8L8 8l6-3.2M8 8v6.5' fill='none' stroke='%23000' stroke-width='1.2'/%3E%3C/svg%3E\")",
};
const types: Record<string, keyof typeof masks> = {
  Mission: "mission",
  Pillar: "pillar",
  Objective: "pillar",
  Program: "program",
  Domain: "product",
  "Product/Service": "product",
  Project: "project",
  Circle: "circle",
  Role: "role",
  Person: "role",
};

/** Masked glyphs keep labels' text content intact. */
export function TypeIcon({ type }: { type: string }) {
  return (
    <span
      aria-hidden="true"
      className="mr-[7px] inline-block size-[15px] flex-none bg-current [mask-image:var(--icon)] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] align-[-3px] opacity-82"
      style={{ "--icon": masks[types[type] || "role"] } as CSSProperties}
    />
  );
}
