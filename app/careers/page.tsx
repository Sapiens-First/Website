import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Explore open roles at Sapiens First. Help build political power to ensure technology serves the common good.",
  path: "/careers",
});

export default function Page() {
  return (
    <>
      <main
        className={
          "mx-auto my-0 w-full max-w-4xl px-5 pt-16 pb-24 max-sm:pt-10 max-sm:pb-16"
        }
      >
        <h1
          className={
            "relative z-2 max-w-none font-display text-6xl leading-none font-extrabold tracking-tight uppercase max-sm:tracking-tighter lg:text-7xl"
          }
        >
          Careers
        </h1>
        <p className="mt-6 mr-0 mb-14 ml-0 max-w-2xl text-lg leading-relaxed max-sm:mb-10">
          Help build political power to ensure technology serves the common
          good. Join a small team with high ownership, fast iteration, and a
          strong bias toward shipping.
        </p>
        <section
          className={"border-b-2 border-ink max-sm:scroll-mt-20"}
          aria-labelledby="open-roles"
        >
          <h2
            className={
              "mb-5 font-body text-xl leading-snug font-extrabold tracking-tight normal-case"
            }
            id="open-roles"
          >
            Open roles
          </h2>
          <Link
            className={cn(
              "group",
              "flex items-center justify-between gap-6 border-t border-b border-solid border-t-rule border-b-rule px-0 py-7",
            )}
            href="/careers/builder"
          >
            <div>
              <h3 className="mb-2.5 text-xl leading-snug group-hover:underline group-hover:underline-offset-4">
                AI-Native Builder (Contract)
              </h3>
              <p className="text-lg leading-relaxed text-ink/70">
                Remote · India preferred · 20 or 40 hours/week · 3 months
              </p>
            </div>
            <span className="text-3xl" aria-hidden="true">
              →
            </span>
          </Link>
        </section>
      </main>
    </>
  );
}
