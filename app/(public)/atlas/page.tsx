import type { Metadata } from "next";
import { cn } from "@/lib/cn";
import { Kicker } from "@/components/ui/Text";
import { pageMetadata } from "@/lib/site";
import { loadPublicAtlas } from "@/lib/atlas/data";
import AtlasExplorer from "@/components/atlas/AtlasExplorer";
import { AtlasRolesLink, HoldersProvider } from "@/components/atlas/Holders";

export const metadata: Metadata = pageMetadata({
  title: "Atlas",
  description: "Explore Sapiens First's work, roles and responsibilities.",
  path: "/atlas",
  ogDescription: "A map of our work and who is responsible for it.",
});

export const revalidate = 60;

export default async function Page() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    return (
      <main className="mx-auto w-full max-w-2xl px-3 pt-20 pb-16 sm:px-6">
        <Kicker className="mb-4">Atlas</Kicker>
        <h1 className="mb-3.5 max-w-xl text-4xl tracking-tight normal-case sm:text-5xl">
          How the movement works.
        </h1>
        <p className="max-w-xl text-lg leading-normal text-ink">
          Atlas is not available in this environment.
        </p>
      </main>
    );
  }
  const data = await loadPublicAtlas();
  const mission = data.domains.find((row) => row.Type === "Mission")?.Purpose;
  return (
    <>
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-8 **:focus-visible:outline-[3px] **:focus-visible:outline-offset-2 **:focus-visible:outline-coral-dark sm:px-6 [&_#record-title]:focus-visible:outline-none [&_a]:underline-offset-2">
        <HoldersProvider>
          <section
            id="atlas-hero"
            className="pt-10 pb-6"
            aria-labelledby="atlas-title"
          >
            <Kicker className="mb-3.5">Atlas</Kicker>
            <h1
              id="atlas-title"
              className="mb-2.5 text-[40px] leading-[0.95] tracking-tight normal-case sm:text-[56px]"
            >
              How the movement works.
            </h1>
            <p className="max-w-[56ch] text-lg text-ink">
              Our circles and roles, and what each one is for. Signed-in members
              can also see who fills each role.
              {mission ? (
                <span className="mt-1.5 block text-sm text-muted-foreground">
                  Our mission: {mission}
                </span>
              ) : null}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3.5">
              <details className={cn("group", "border-0")}>
                <summary className="group/how inline-flex min-h-11 w-max cursor-pointer items-center font-body text-xs font-bold tracking-wide text-coral-dark group-open:mb-4">
                  <span className="border-b border-coral/55 pb-0.5 underline underline-offset-2 group-hover/how:border-current">
                    How Atlas works
                  </span>
                </summary>
                <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
                  <strong>Roles</strong> lists responsibilities and access.
                  Circles group roles that share a purpose.{" "}
                  <strong>Domains</strong> maps our work.{" "}
                  <strong>People</strong> shows who fills each role.
                </p>
                <h3 className="mt-5 font-display text-xl font-bold tracking-normal normal-case">
                  From mission to projects
                </h3>
                <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
                  Mission leads to pillars, then programs, then projects and
                  products. Planning windows run from three years for the
                  mission to three months for projects. These are planning
                  guides, not deadlines.
                </p>
                <h3 className="mt-5 font-display text-xl font-bold tracking-normal normal-case">
                  Reading a role
                </h3>
                <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
                  <strong>Purpose</strong> says why the role exists.{" "}
                  <strong>Accountabilities</strong> lists its ongoing work.{" "}
                  <strong>Privileges</strong> records what access it has. If
                  access details are missing, they have not been written down
                  yet.
                </p>
                <p className="my-3.5 max-w-3xl text-sm leading-relaxed text-ink">
                  Linked work shows who is responsible. It does not by itself
                  grant formal Holacracy authority or system access.
                </p>
              </details>
              <AtlasRolesLink />
            </div>
          </section>

          <AtlasExplorer
            data={data}
            today={new Date().toISOString().slice(0, 10)}
          />
        </HoldersProvider>
      </main>
    </>
  );
}
