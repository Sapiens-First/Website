import { pageMetadata } from "@/lib/site";
import { Label } from "@/components/ui/Label";
import { Container } from "@/components/layout/Container";
import PolicyToc from "@/components/policy/PolicyToc";
import ScrollProgress from "@/components/ScrollProgress";
import { policyPillars } from "@/content/policies";

export const metadata = pageMetadata({
  title: "Policy",
  description:
    "A People's Agenda for the Age of AI — Sapiens First's policy recommendations for democratic renewal, common prosperity, and a secure future.",
  path: "/policy",
});

export default function Page() {
  return (
    <div className="route-root route-policy">
      <ScrollProgress />

      <div className="page-hero">
        <Container>
          <Label tone="coral">Policy Brief — Sapiens First</Label>
          <h1 className="page-title">
            A People&apos;s Agenda
            <br />
            for the <span className="ink-underline blue">Age of AI.</span>
          </h1>
          <p className="policy-meta mt-7 mr-0 mb-0 ml-0 text-xs font-bold tracking-wider uppercase">
            3 Pillars · 12 Policies · Updated July 2026
          </p>
        </Container>
      </div>
      <main className="route-policy">
        <section className="guide-section">
          <Container>
            <div className="guide-layout">
              <aside className="guide-sidebar">
                <PolicyToc />
              </aside>
              <div className="guide-main">
                <div id="policy-content">
                  <section
                    className="policy-pillar scroll-mt-[100px]"
                    id="overview"
                  >
                    <div className="section-label reveal">
                      <span className="title">Overview</span>
                    </div>
                    <p className="body-large reveal">
                      Broadly, Sapiens First advocates for democracy,
                      prosperity, and a secure future in the age of AI.
                    </p>
                    <p className="body-large reveal">
                      Our approach to policy advocacy is:
                    </p>
                    <ul className="overview-list reveal">
                      <li>
                        Run campaigns that are politically feasible and allow us
                        to mobilize a broad coalition.
                      </li>
                      <li>
                        Concurrently, do activism that expands the Overton
                        window and raises social awareness about AI-related
                        issues.
                      </li>
                    </ul>
                    <p className="body-large reveal">
                      This page represents an early draft of policies, which we
                      share in the spirit of transparency and collaboration.
                      We&apos;d like to develop policies in collaboration with
                      experts in social, economic, and tech policy. If
                      you&apos;d like to contribute, please reach out to
                      rohan@sapiensfirst.org.
                    </p>
                    <p className="policy-colophon-meta reveal mt-1 text-left font-body text-sm tracking-wider text-ink">
                      This page is a living document, last updated in July 2026.
                    </p>
                  </section>
                  {policyPillars.map((pillar) => (
                    <section
                      className="policy-pillar scroll-mt-[100px]"
                      id={pillar.id}
                      key={pillar.id}
                    >
                      <div className="section-label reveal">
                        <span className="title">{pillar.title}</span>
                      </div>
                      <p className="pillar-lead body-large reveal">
                        {pillar.lead}
                      </p>
                      {pillar.policies.map((policy) => (
                        <details
                          className="policy-card accordion accordion--rule mt-0 scroll-mt-[100px] border-t-2 border-solid border-t-ink"
                          id={policy.id}
                          key={policy.id}
                          name="policy"
                        >
                          <summary className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4">
                            <span className="policy-card-title font-display leading-tight uppercase">
                              {policy.title}
                            </span>
                            <span
                              className="policy-chevron accordion-chevron"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="policy-card-body accordion-body" />
                        </details>
                      ))}
                    </section>
                  ))}
                  <p className="policy-colophon-meta reveal mt-1 text-left font-body text-sm tracking-wider text-ink">
                    Sapiens First — A People&apos;s Agenda for the Age of AI ·
                    Updated July 2026
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
