import * as React from "react";
import { cn } from "@/lib/cn";

/*
 * Native checkbox in the shadcn slot. Kept native (not the Radix button
 * version) so `required` validation and plain FormData posts keep working
 * with the server-action forms.
 */
function Checkbox({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "peer mt-1 size-5 shrink-0 cursor-pointer accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
