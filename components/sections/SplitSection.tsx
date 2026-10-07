import type { ComponentProps } from "react";
import { Bird, Doodle, burstClip } from "@/components/ui/Doodles";
import { cn } from "@/lib/cn";

export function SplitHero({
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "border-b-2 border-ink max-sm:scroll-mt-20",
        "grid min-h-screen grid-cols-1 border-b-2 border-ink max-sm:min-h-0 lg:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

export function ClosingSection({
  className = "",
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "border-b-2 border-ink max-sm:scroll-mt-20",
        "grid grid-cols-1 border-b-2 border-ink bg-paper lg:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

export function ClosingCopy({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-7 py-20 max-sm:px-5 max-sm:pt-14 max-sm:pb-12 sm:px-12 lg:px-20 lg:py-24",
        className,
      )}
      {...props}
    />
  );
}

export function SignupPanel({
  className = "",
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex min-h-96 flex-col justify-center overflow-hidden border-t-2 border-ink bg-ink px-7 py-16 text-white sm:px-12 lg:border-t-0 lg:border-l-2",
        "after:absolute after:right-8 after:bottom-9 after:h-2.5 after:w-24 after:-rotate-3 after:rounded-full after:bg-brand-yellow after:content-['']",
        className,
      )}
      {...props}
    />
  );
}

/** Left half of a SplitHero. The dashed circle behind the copy is the default decoration. */
export function HeroCopy({
  circle = true,
  className = "",
  ...props
}: ComponentProps<"div"> & { circle?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden bg-paper px-7 py-20 max-sm:px-5 max-sm:pt-14 max-sm:pb-12 sm:px-12 sm:max-md:px-8 sm:max-md:py-16 lg:px-20 lg:py-24",
        circle &&
          "before:absolute before:top-[31%] before:-right-28 before:size-48 before:rounded-full before:border-2 before:border-dashed before:border-ink before:opacity-20 before:content-['']",
        className,
      )}
      {...props}
    />
  );
}

export function HeroLede({ className = "", ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "relative z-2 mt-[30px] mb-[26px] max-w-md font-body text-lg leading-[1.45] font-semibold max-sm:max-w-none max-sm:text-base xl:text-xl",
        className,
      )}
      {...props}
    />
  );
}

/** Right half of a SplitHero: paper cut-outs (sun, burst, face, confetti, birds) on coral. */
export function HeroArt({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden border-ink bg-coral max-lg:min-h-[420px] max-lg:border-t-2 max-sm:min-h-[320px] lg:border-l-2",
        className,
      )}
      {...props}
    />
  );
}

const confetti = [
  "top-[18%] left-[8%] rotate-24 bg-brand-yellow",
  "top-[9%] left-[18%] -rotate-28 bg-brand-blue",
  "top-[13%] right-[15%] rotate-42 bg-brand-purple",
  "top-[26%] right-[7%] -rotate-18 bg-brand-pink",
];

export function HeroCollage({
  posters,
}: {
  posters?: [React.ReactNode, React.ReactNode];
}) {
  const poster =
    "absolute -rotate-5 border-2 border-ink px-4 py-[13px] font-body text-[clamp(0.95rem,1.7vw,1.4rem)] leading-[0.95] font-[950] uppercase max-sm:px-[11px] max-sm:py-[9px] max-sm:text-[0.85rem]";
  return (
    <HeroArt className="before:absolute before:-top-[42px] before:-right-[42px] before:z-2 before:size-[150px] before:rounded-full before:border-2 before:border-ink before:bg-brand-yellow before:mix-blend-multiply before:content-[''] max-sm:before:-top-7 max-sm:before:-right-8 max-sm:before:size-[94px]">
      <div className="absolute top-[72px] -right-[100px] size-[390px] rounded-full border-2 border-ink bg-[#f2c9b6] max-sm:top-10 max-sm:-right-[70px] max-sm:size-[230px]" />
      <div
        className={cn(
          "absolute top-[11%] left-[8%] size-[190px] bg-paper max-sm:size-[120px]",
          burstClip,
        )}
      />
      <div className="absolute -bottom-[60px] left-[14%] h-[410px] w-[280px] -rotate-7 overflow-hidden rounded-[46%_46%_40%_40%/31%_31%_60%_60%] border-2 border-ink bg-ink after:absolute after:-inset-[18px] after:bg-[repeating-linear-gradient(126deg,transparent_0_13px,var(--color-paper)_13px_17px)] after:opacity-95 after:content-[''] max-sm:-bottom-14 max-sm:left-[10%] max-sm:h-[280px] max-sm:w-[180px]" />
      {posters && (
        <>
          <div
            className={cn(poster, "right-[6%] bottom-[12%] bg-ink text-white")}
          >
            {posters[0]}
          </div>
          <div
            className={cn(
              poster,
              "bottom-[32%] left-[7%] rotate-4 bg-paper text-ink max-sm:left-[5%]",
            )}
          >
            {posters[1]}
          </div>
        </>
      )}
      {confetti.map((position) => (
        <div className={cn("absolute h-6 w-2", position)} key={position} />
      ))}
      <Doodle className="top-[8%] left-[10%] z-2 -rotate-6 text-ink">
        <Bird />
      </Doodle>
      <Doodle className="top-[16%] left-[20%] z-2 scale-70 rotate-4 text-ink">
        <Bird />
      </Doodle>
    </HeroArt>
  );
}

const focusNumberColors = [
  "text-coral",
  "text-brand-blue",
  "text-brand-purple",
];

/** Numbered list of short points with a ruled divider between rows. */
export function FocusList({
  items,
}: {
  items: { title: React.ReactNode; text?: React.ReactNode }[];
}) {
  return (
    <div className="border-t-2 border-ink">
      {items.map((item, index) => (
        <div
          className="flex items-start gap-4 border-b border-rule px-0 py-6 max-sm:gap-3"
          key={index}
        >
          <span
            className={cn(
              "w-8 shrink-0 text-xs font-black",
              focusNumberColors[index % focusNumberColors.length],
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="m-0 text-xl leading-snug font-extrabold">
              {item.title}
            </h3>
            {item.text && (
              <p className="mx-0 mt-2 mb-0 text-base leading-relaxed">
                {item.text}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Plain full-width page header used by content pages (campaigns, policy, learn, events, membership). */
export function PageHero({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden border-b-2 border-ink bg-paper px-0 py-40 max-md:pt-28 max-md:pb-20",
        className,
      )}
      {...props}
    />
  );
}

export function PageTitle({ className = "", ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "relative z-2 font-display leading-none font-extrabold tracking-tight uppercase max-sm:tracking-tighter",
        "relative z-2 max-w-xs animate-fade-up text-center font-display text-6xl leading-none font-extrabold tracking-tighter text-ink uppercase opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 sm:max-w-md lg:max-w-xl lg:text-8xl",
        className,
      )}
      {...props}
    />
  );
}
