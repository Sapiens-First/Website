import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { fieldClasses } from "./input";

type NativeSelectProps = React.ComponentProps<"select"> & {
  /** Classes for the wrapping element (width, margins). */
  wrapperClassName?: string;
};

function NativeSelect({
  className,
  wrapperClassName,
  ...props
}: NativeSelectProps) {
  return (
    <div
      data-slot="native-select-wrapper"
      className={cn("relative w-full", wrapperClassName)}
    >
      <select
        data-slot="native-select"
        className={cn(
          fieldClasses,
          "h-12 cursor-pointer appearance-none pr-10",
          className,
        )}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        data-slot="native-select-icon"
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-foreground"
      />
    </div>
  );
}

function NativeSelectOption(props: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}

export { NativeSelect, NativeSelectOption };
