import type { Metadata } from "next";
import { loadAtlasData } from "@/lib/atlas/data";
import AtlasExplorer from "@/components/AtlasExplorer";

export const metadata: Metadata = {
  title: "Atlas — Sapiens First",
  description:
    "Explore Sapiens First’s domains of work, purpose, roles, and responsibilities.",
  alternates: { canonical: "/atlas" },
  openGraph: {
    title: "Atlas — Sapiens First",
    description: "A shared map of our work and the people responsible for it.",
    url: "/atlas",
    type: "website",
  },
};

export default function Page() {
  const data = loadAtlasData();
  return (
    <div className="route-root route-atlas">
      <main className="atlas">
        <section
          className="atlas-hero site-container relative z-2 mx-auto w-full max-w-2xl px-3 pt-20 pb-10 sm:px-6 max-sm:pt-12 max-sm:pb-7"
          aria-labelledby="atlas-title"
        >
          <div className="kicker">Atlas</div>
          <h1 id="atlas-title">See how the movement works.</h1>
          <p className="atlas-intro leading-normal">
            Goals, circles, roles, projects, and the people behind them.
            <span id="mission-text">
              Our mission:{" "}
              {data.domains.find((row) => row.Type === "Mission")?.Purpose}
            </span>
          </p>
          <details className="atlas-guide">
            <summary>How Atlas works</summary>
            <p>
              <strong>Roles</strong> shows responsibilities and access. Circles
              group roles around a shared purpose. <strong>Domains</strong> maps
              our work. <strong>People</strong> shows who fills each role.
            </p>
            <h3>From mission to projects</h3>
            <p>
              Mission → pillars → programs → projects and products. Our planning
              windows range from three years for the mission to three months for
              projects. These guide planning, not deadlines.
            </p>
            <h3>Reading a role</h3>
            <p>
              <strong>Purpose</strong> explains why it exists.{" "}
              <strong>Accountabilities</strong> lists its ongoing
              responsibilities. <strong>Privileges</strong> records its access
              rights. Missing access details mean they have not been documented.
            </p>
            <p>
              Linked work shows responsibility. It does not by itself grant
              formal Holacracy authority or system access.
            </p>
          </details>
        </section>

        <AtlasExplorer
          data={data}
          today={new Date().toISOString().slice(0, 10)}
        />
      </main>
    </div>
  );
}
