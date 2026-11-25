import type { ComponentProps } from "react";
import { Bird, Doodle } from "@/components/ui/Doodles";
import { HeroHorizon } from "@/components/sections/HeroHorizon";
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
        "relative z-2 mt-7.5 mb-6.5 max-w-md font-body text-lg leading-[1.45] font-semibold max-sm:max-w-none max-sm:text-base xl:text-xl",
        className,
      )}
      {...props}
    />
  );
}

export function HeroArt({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden border-ink bg-coral max-lg:min-h-105 max-lg:border-t-2 max-sm:min-h-80 lg:border-l-2",
        className,
      )}
      {...props}
    />
  );
}

export function HeroCollage({
  posters,
  children,
}: {
  posters?: [React.ReactNode, React.ReactNode];
  /** Extra decorative layers, drawn on top of the scene. */
  children?: React.ReactNode;
}) {
  const poster =
    "absolute z-2 -rotate-5 border-2 border-ink px-4 py-3.25 font-body text-[clamp(0.95rem,1.7vw,1.4rem)] leading-[0.95] font-[950] uppercase max-sm:px-2.75 max-sm:py-2.25 max-sm:text-[0.85rem]";
  return (
    <HeroArt className="bg-brand-peach">
      <HeroHorizon />
      {posters && (
        <>
          <div
            className={cn(poster, "right-[6%] bottom-[8%] bg-ink text-white")}
          >
            {posters[0]}
          </div>
          <div
            className={cn(
              poster,
              "top-[34%] left-[7%] rotate-4 bg-paper text-ink max-sm:left-[5%]",
            )}
          >
            {posters[1]}
          </div>
        </>
      )}
      <Doodle className="top-[8%] left-[10%] z-2 -rotate-6 text-ink">
        <Bird />
      </Doodle>
      <Doodle className="top-[16%] left-[20%] z-2 scale-70 rotate-4 text-ink">
        <Bird />
      </Doodle>
      {children}
    </HeroArt>
  );
}

const focusNumberColors = [
  "text-coral-dark",
  "text-brand-blue-dark",
  "text-brand-purple-dark",
];

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
        "relative z-2 text-left font-display font-extrabold text-ink uppercase max-sm:tracking-tighter sm:max-w-md lg:max-w-xl",
        className,
      )}
      {...props}
    />
  );
}
