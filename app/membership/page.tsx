import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Membership — Sapiens First",
  description:
    "Sapiens First membership is on its way — monthly dues, member perks, and a direct way to fund the movement.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "Membership — Sapiens First",
    description:
      "Sapiens First membership is on its way — monthly dues, member perks, and a direct way to fund the movement.",
    url: "/membership",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-membership">
      <div className="progress-bar"></div>

      <div className="page-hero">
        <div className="ember-field" aria-hidden="true"></div>
        <div className="container">
          <h1 className="page-title">
            {"Become a"}
            <br />
            <span className="title-accent">{"Member."}</span>
          </h1>
        </div>
      </div>
      <main className="route-membership">
        <section className="section">
          <div className="container">
            <p className="body-large reveal">
              {
                "\n          Membership is how you sustain Sapiens First for the long haul — monthly dues,\n          a stronger voice in the movement, and a direct way to help us stay accountable\n          to the people we organize with.\n        "
              }
            </p>
            <div className="construction-box card reveal">
              <svg
                className="construction-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path>
              </svg>
              <div className="construction-tag">
                {"Membership page is under construction"}
              </div>
              <p className="construction-text card-text">
                {
                  "\n            We're still building this page. In the meantime, join our email list to hear\n            the moment it goes live, or support us right now with a donation.\n          "
                }
              </p>
              <div className="construction-actions">
                <a href="/join" className="btn btn--solid">
                  {"Join our email list →"}
                </a>
                <a href="/donate" className="text-link">
                  {"Make a donation instead →"}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
