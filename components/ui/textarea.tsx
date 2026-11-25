import * as React from "react";
import { cn } from "@/lib/cn";
import { fieldClasses } from "./input";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClasses, "min-h-32 py-2.5 leading-relaxed", className)}
      {...props}
    />
  );
}

export { Textarea };
