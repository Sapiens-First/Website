import { TextLink } from "@/components/ui/Action";
import { ActionLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";

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
        <Container>
          <h1 className="page-title">
            {"Become a"}
            <br />
            <span className="title-accent">{"Member."}</span>
          </h1>
        </Container>
      </div>
      <main className="route-membership">
        <section className="section">
          <Container>
            <p className="body-large reveal">
              {
                "\n          Membership is how you sustain Sapiens First for the long haul — monthly dues,\n          a stronger voice in the movement, and a direct way to help us stay accountable\n          to the people we organize with.\n        "
              }
            </p>
            <div className="construction-box card reveal mt-7 py-10 px-9 flex flex-col items-center text-center gap-4 max-sm:py-9 max-sm:px-6">
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
              <div className="construction-tag font-body text-sm tracking-widest uppercase text-coral-dark border border-solid border-coral py-1.5 px-3.5">
                {"Membership page is under construction"}
              </div>
              <p className="construction-text card-text max-w-md">
                {
                  "\n            We're still building this page. In the meantime, join our email list to hear\n            the moment it goes live, or support us right now with a donation.\n          "
                }
              </p>
              <div className="construction-actions flex items-center gap-7 mt-2.5 flex-wrap justify-center">
                <ActionLink href="/join" variant="primary">
                  {"Join our email list →"}
                </ActionLink>
                <TextLink href="/donate">
                  {"Make a donation instead →"}
                </TextLink>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
