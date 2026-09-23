import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Careers — Sapiens First",
  description:
    "Explore open roles at Sapiens First. Help build political power to ensure technology serves the common good.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers — Sapiens First",
    description:
      "Explore open roles at Sapiens First. Help build political power to ensure technology serves the common good.",
    url: "/careers",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-careers">
      <main className="careers-page route-careers">
        <h1>{"Careers"}</h1>
        <p className="careers-intro">
          {
            "Help build political power to ensure technology serves the common good. Join a small team with high ownership, fast iteration, and a strong bias toward shipping."
          }
        </p>
        <section aria-labelledby="open-roles">
          <h2 id="open-roles">{"Open roles"}</h2>
          <a className="job-listing" href="/careers/builder">
            <div>
              <h3>{"AI-Native Builder (Contract)"}</h3>
              <p>
                {"Remote · India preferred · 20 or 40 hours/week · 3 months"}
              </p>
            </div>
            <span className="job-listing-arrow" aria-hidden="true">
              {"→"}
            </span>
          </a>
        </section>
      </main>
    </div>
  );
}
