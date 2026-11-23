import { cn } from "@/lib/cn";

const steps = ["Sign in", "About you", "Agree", "Contribute"] as const;

export function JoinSteps({
  current,
  className,
}: {
  current: 1 | 2 | 3 | 4;
  className?: string;
}) {
  return (
    <nav aria-label="Membership steps" className={cn("w-full", className)}>
      <p className="mb-2 font-body text-xs font-black tracking-widest uppercase sm:hidden">
        Step {current} of {steps.length} · {steps[current - 1]}
      </p>
      <ol className="grid grid-cols-4 border-2 border-ink bg-white">
        {steps.map((label, index) => {
          const number = index + 1;
          const state =
            number < current ? "done" : number === current ? "current" : "next";
          return (
            <li
              key={label}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex min-w-0 items-center gap-1.5 px-2 py-2 font-body text-xs font-black tracking-wide uppercase max-sm:h-3 max-sm:p-0 sm:py-2.5",
                index > 0 && "border-l-2 border-ink",
                state === "current" && "bg-coral",
                state === "done" && "bg-ink text-paper sm:bg-soft sm:text-ink",
                state === "next" && "text-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center border-2 border-ink text-[0.7rem] max-sm:hidden",
                  state === "done" ? "bg-ink text-paper" : "bg-white text-ink",
                )}
              >
                {state === "done" ? "✓" : number}
              </span>
              <span className="truncate max-sm:sr-only">
                {label}
                {state === "done" && <span className="sr-only"> (done)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
