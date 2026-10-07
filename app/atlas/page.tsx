import { cn } from "@/lib/cn";
import { Kicker } from "@/components/ui/Text";
import { pageMetadata } from "@/lib/site";
import { loadAtlasData } from "@/lib/atlas/data";
import AtlasExplorer from "@/components/atlas/AtlasExplorer";

export const metadata = pageMetadata({
  title: "Atlas",
  description:
    "Explore Sapiens First’s domains of work, purpose, roles, and responsibilities.",
  path: "/atlas",
  ogDescription: "A shared map of our work and the people responsible for it.",
});

export default function Page() {
  const data = loadAtlasData();
  return (
    <>
      <main className="[&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-coral-dark [&_a]:underline-offset-2">
        <section
          className="relative z-2 mx-auto w-full max-w-2xl border-b-2 border-ink px-3 pt-20 pb-10 max-sm:pt-12 max-sm:pb-7 sm:px-6"
          aria-labelledby="atlas-title"
        >
          <Kicker className="mb-4">Atlas</Kicker>
          <h1
            id="atlas-title"
            className="mb-3.5 max-w-xl text-4xl tracking-tight normal-case sm:text-5xl lg:text-6xl"
          >
            See how the movement works.
          </h1>
          <p className="max-w-xl text-lg leading-normal text-ink">
            Goals, circles, roles, projects, and the people behind them.
            <span
              id="mission-text"
              className="mt-2.5 block text-sm font-medium text-ink"
            >
              Our mission:{" "}
              {data.domains.find((row) => row.Type === "Mission")?.Purpose}
            </span>
          </p>
          <details className={cn("group", "border-0 pt-5")}>
            <summary className="inline-flex w-max cursor-pointer items-center gap-1.5 border-b border-coral/55 pb-0.5 font-body text-xs font-bold tracking-wide text-coral-dark underline underline-offset-2 group-open:mb-4 hover:border-current">
              How Atlas works
            </summary>
            <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
              <strong>Roles</strong> shows responsibilities and access. Circles
              group roles around a shared purpose. <strong>Domains</strong> maps
              our work. <strong>People</strong> shows who fills each role.
            </p>
            <h3 className="mt-5 font-display text-xl font-bold tracking-normal normal-case">
              From mission to projects
            </h3>
            <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
              Mission → pillars → programs → projects and products. Our planning
              windows range from three years for the mission to three months for
              projects. These guide planning, not deadlines.
            </p>
            <h3 className="mt-5 font-display text-xl font-bold tracking-normal normal-case">
              Reading a role
            </h3>
            <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
              <strong>Purpose</strong> explains why it exists.{" "}
              <strong>Accountabilities</strong> lists its ongoing
              responsibilities. <strong>Privileges</strong> records its access
              rights. Missing access details mean they have not been documented.
            </p>
            <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
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
    </>
  );
}
