import { Label } from "@/components/ui/Label";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import PolicyInteractions from "@/components/PolicyInteractions";

export const metadata: Metadata = {
  title: "Policy — Sapiens First",
  description:
    "A People's Agenda for the Age of AI — Sapiens First's policy recommendations for democratic renewal, common prosperity, and a secure future.",
  alternates: { canonical: "/policy" },
  openGraph: {
    title: "Policy — Sapiens First",
    description:
      "A People's Agenda for the Age of AI — Sapiens First's policy recommendations for democratic renewal, common prosperity, and a secure future.",
    url: "/policy",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-policy">
      <PolicyInteractions />
      <div className="progress-bar"></div>

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
                <div id="toc-container"></div>
              </aside>
              <div className="guide-main">
                <div id="policy-content">
                  <section className="policy-pillar" id="overview">
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
                  <section className="policy-pillar" id="democratic-renewal">
                    <div className="section-label reveal">
                      <span className="title">Democratic Renewal</span>
                    </div>
                    <p className="pillar-lead body-large reveal">
                      AI could give governments and corporations unprecedented
                      power to watch people, manipulate public debate, and shape
                      policy behind closed doors. We should use this moment to
                      strengthen democracy instead: defending civil liberties,
                      breaking corporate control over policymaking, and giving
                      ordinary people a direct role in decisions about our
                      future.
                    </p>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="ban-ai-enabled-mass-surveillance"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="ban-ai-enabled-mass-surveillance-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Ban AI-Enabled Mass Surveillance
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="ban-ai-enabled-mass-surveillance-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="end-big-tech-s-influence-on-elections"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="end-big-tech-s-influence-on-elections-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          End Big Tech&apos;s Influence on Elections
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="end-big-tech-s-influence-on-elections-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="citizens-assemblies-for-ai-policy"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="citizens-assemblies-for-ai-policy-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Citizens&apos; Assemblies for AI Policy
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="citizens-assemblies-for-ai-policy-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="upgrade-our-democratic-process"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="upgrade-our-democratic-process-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Upgrade Our Democratic Process
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="upgrade-our-democratic-process-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="policy-pillar" id="common-prosperity">
                    <div className="section-label reveal">
                      <span className="title">Common Prosperity</span>
                    </div>
                    <p className="pillar-lead body-large reveal">
                      AI could create immense wealth while eliminating jobs,
                      weakening workers&apos; bargaining power, and
                      concentrating ownership in a small number of companies.
                      The gains should instead be shared broadly through
                      dividends, public ownership, creator compensation, worker
                      protections, and renewed investment in public
                      institutions.
                    </p>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="benefits-for-communities-affected-by-data-centers"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="benefits-for-communities-affected-by-data-centers-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Benefits for Communities Affected by Data Centers
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="benefits-for-communities-affected-by-data-centers-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="enhance-our-government-institutions"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="enhance-our-government-institutions-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Enhance Our Government Institutions
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="enhance-our-government-institutions-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="build-a-sovereign-wealth-fund-for-ai"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="build-a-sovereign-wealth-fund-for-ai-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Build a Sovereign Wealth Fund for AI
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="build-a-sovereign-wealth-fund-for-ai-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="citizens-dividend"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="citizens-dividend-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Citizen&apos;s Dividend
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="citizens-dividend-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="policy-pillar" id="a-secure-future">
                    <div className="section-label reveal">
                      <span className="title">A Secure Future</span>
                    </div>
                    <p className="pillar-lead body-large reveal">
                      Cutting-edge AI systems could create catastrophic risks if
                      developed through an uncontrolled race among companies and
                      nations. Governments need independent scientific capacity,
                      enforceable transparency, and international agreements
                      that keep advanced AI under meaningful human control.
                    </p>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="lead-a-treaty-with-china-to-stop-the-ai-arms-race"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="lead-a-treaty-with-china-to-stop-the-ai-arms-race-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Lead a Treaty with China to Stop the AI Arms Race
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="lead-a-treaty-with-china-to-stop-the-ai-arms-race-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="mandate-that-all-frontier-ai-development-be-done-in-the-open"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="mandate-that-all-frontier-ai-development-be-done-in-the-open-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Mandate That All Frontier AI Development Be Done in
                          the Open
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="mandate-that-all-frontier-ai-development-be-done-in-the-open-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="institute-strict-liability-and-punitive-damages-for-ai-harms"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="institute-strict-liability-and-punitive-damages-for-ai-harms-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Institute Strict Liability and Punitive Damages for AI
                          Harms
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="institute-strict-liability-and-punitive-damages-for-ai-harms-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="policy-card accordion--rule mt-0 border-t-2 border-solid border-t-ink"
                      id="build-a-powerful-and-independent-ai-safety-institute"
                    >
                      <button
                        className="policy-card-toggle accordion-toggle max-sm:px-4 max-sm:py-4"
                        type="button"
                        aria-expanded="false"
                        aria-controls="build-a-powerful-and-independent-ai-safety-institute-body"
                      >
                        <span className="policy-card-title font-display leading-tight uppercase">
                          Build a Powerful and Independent AI Safety Institute
                        </span>
                        <span
                          className="policy-chevron accordion-chevron"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <div className="policy-card-panel accordion-panel">
                        <div className="policy-card-panel-inner accordion-panel-inner">
                          <div
                            className="policy-card-body accordion-body"
                            id="build-a-powerful-and-independent-ai-safety-institute-body"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </section>
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
