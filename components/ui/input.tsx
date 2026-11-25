import * as React from "react";
import { cn } from "@/lib/cn";

/** Shared field look: square, ink-bordered, white. Also used by Textarea and NativeSelect. */
export const fieldClasses =
  "w-full min-w-0 border-2 border-input bg-card px-3 font-body text-base text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldClasses,
        "h-12 file:mr-3 file:border-0 file:bg-transparent file:font-bold",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
