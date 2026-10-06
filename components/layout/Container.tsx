import type { ComponentProps } from "react";

const widths = {
  site: "max-w-7xl",
  content: "max-w-4xl",
  prose: "max-w-2xl",
} as const;

export function Container({
  width = "site",
  className = "",
  ...props
}: ComponentProps<"div"> & { width?: keyof typeof widths }) {
  return (
    <div
      className={`site-container relative z-2 mx-auto w-full px-3 sm:px-6 ${widths[width]} ${className}`}
      {...props}
    />
  );
}
