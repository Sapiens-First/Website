import Image from "next/image";
import Link from "next/link";
import crown from "@/public/no-tech-kings/three-point-crown.svg";
import { cn } from "@/lib/cn";

/** Homepage feature for the No Tech Kings campaign, in that page's night-to-dawn sky. */
export default function NtkFeature({ className }: { className?: string }) {
  return (
    <Link
      href="/no-tech-kings"
      className={cn(
        "group relative isolate flex flex-col items-center overflow-hidden border-2 border-ink px-6 pt-14 pb-16 text-center text-paper no-underline max-sm:px-5 max-sm:pt-10 max-sm:pb-12",
        className,
      )}
      style={{
        background:
          "linear-gradient(in oklch to bottom, #070707 0%, var(--color-navy) 34%, color-mix(in oklch, var(--color-brand-purple) 38%, var(--color-navy)) 58%, color-mix(in oklch, var(--color-brand-pink) 62%, var(--color-navy)) 80%, var(--color-coral) 100%)",
      }}
    >
      {/* sun glow on the horizon */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-1 size-96 -translate-x-1/2 rounded-full opacity-80 blur-2xl transition-transform duration-1000 ease-out group-hover:-translate-y-4 motion-reduce:transition-none"
        style={{
          background:
            "radial-gradient(circle, #ffd08a 0%, #ffa62b 30%, color-mix(in oklch, var(--color-coral) 50%, transparent) 55%, transparent 72%)",
        }}
      />
      <Image
        src={crown}
        alt=""
        className="h-auto w-24 drop-shadow-[0_4px_24px_color-mix(in_oklch,var(--color-brand-yellow)_35%,transparent)] max-sm:w-20"
      />
      <p className="mt-5 text-sm font-bold tracking-[0.14em] text-brand-yellow uppercase">
        Our campaign
      </p>
      <h3 className="mt-3 font-display text-6xl leading-none font-extrabold tracking-tight text-brand-yellow uppercase [text-shadow:0_2px_28px_rgba(7,7,7,0.45)] max-sm:text-5xl lg:text-7xl xl:text-8xl">
        No Tech Kings.
      </h3>
      <p className="mt-5 max-w-lg text-lg leading-snug font-medium text-balance xl:text-xl">
        We call on Gavin Newsom to stand up to Big Tech.
      </p>
      <span className="mt-8 inline-flex items-center gap-2 border-2 border-ink bg-brand-yellow px-4 py-3 font-body text-sm font-black text-ink uppercase transition-[translate,background-color] duration-300 group-hover:-translate-y-0.5 group-hover:bg-paper">
        Learn more <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
