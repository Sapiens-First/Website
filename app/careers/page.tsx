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
    <div className="route-root route-careers">
      <main className="careers-page route-careers mx-auto w-full max-w-4xl px-5 pt-16 pb-24 max-sm:pt-10 max-sm:pb-16">
        <h1>Careers</h1>
        <p className="careers-intro mt-6 mr-0 mb-14 ml-0 max-w-2xl text-lg leading-relaxed max-sm:mb-10">
          Help build political power to ensure technology serves the common
          good. Join a small team with high ownership, fast iteration, and a
          strong bias toward shipping.
        </p>
        <section aria-labelledby="open-roles">
          <h2 id="open-roles">Open roles</h2>
          <Link
            className="job-listing flex items-center justify-between gap-6 border-t border-b border-solid border-t-rule border-b-rule px-0 py-7"
            href="/careers/builder"
          >
            <div>
              <h3>AI-Native Builder (Contract)</h3>
              <p>Remote · India preferred · 20 or 40 hours/week · 3 months</p>
            </div>
            <span className="job-listing-arrow text-3xl" aria-hidden="true">
              →
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
