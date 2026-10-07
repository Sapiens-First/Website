import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function CardText({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-lg leading-relaxed font-medium text-ink", className)}
      {...props}
    />
  );
}
