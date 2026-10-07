import { cn } from "@/lib/cn";

const stats = [
  {
    value: "300M",
    text: "Jobs exposed to AI automation",
    className: "bg-coral text-ink",
  },
  {
    value: "73%",
    text: "Of Americans favor stronger AI oversight",
    className: "bg-[#bcd8ff] text-ink",
  },
  {
    value: "$100M",
    text: "Raised by industry lobbyists in 2026",
    className: "bg-brand-purple text-white",
  },
];

export default function StatGrid() {
  return (
    <div className="relative z-2 -mx-7 mt-16 -mb-20 grid grid-cols-3 border-t-2 border-white/35 text-base tracking-normal max-lg:grid-cols-1 max-sm:-mx-5 max-sm:mt-8 max-sm:-mb-11 sm:-mx-12 lg:-mx-20 lg:-mb-24">
      {stats.map((stat, index) => (
        <div
          className={cn(
            "relative flex min-h-56 flex-col justify-start gap-5 border-ink px-8 py-9 font-body max-lg:min-h-0 max-sm:items-start max-sm:gap-6 max-sm:px-5 max-sm:py-7",
            index < stats.length - 1 &&
              "border-r-2 max-lg:border-r-0 max-lg:border-b-2",
            stat.className,
          )}
          key={stat.value}
        >
          <strong className="relative w-max font-display text-7xl leading-none font-extrabold tracking-tight after:absolute after:right-0 after:-bottom-2 after:left-[4%] after:h-1.5 after:-rotate-1 after:rounded-full after:bg-ink after:opacity-70 after:content-[''] max-sm:text-6xl xl:text-8xl">
            {stat.value}
          </strong>
          <span className="max-w-sm text-xl leading-normal font-medium tracking-normal max-sm:text-left">
            {stat.text}
          </span>
        </div>
      ))}
    </div>
  );
}
