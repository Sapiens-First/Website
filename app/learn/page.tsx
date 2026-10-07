import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import GuideClient from "@/components/learn/GuideClient";

export const metadata = pageMetadata({
  title: "Guide",
  description:
    "The Sapiens First guide to AI, people power, and how to make change.",
  path: "/learn",
});

export default function Page() {
  return (
    <div className="route-root route-learn">
      <div className="page-hero">
        <Container>
          <div className="kicker">Learn · Organize · Act</div>
          <h1 className="page-title">
            Sapiens&apos; Guide to
            <br />
            <span className="title-accent">Revolution</span>
          </h1>
          <p className="guide-intro mt-7 leading-normal max-sm:mt-6">
            A practical guide to AI, people power, and organizing for change.
          </p>
        </Container>
      </div>
      <main className="route-learn">
        <section className="guide-section">
          <Container>
            <div className="guide-layout">
              <GuideClient />
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
