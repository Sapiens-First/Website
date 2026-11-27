import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Kicker } from "@/components/ui/Text";
import type { MyRole } from "@/lib/atlas/me";

function countItems(value: string) {
  return value
    .split(/\n|;\s*/)
    .map((item) => item.trim())
    .filter(Boolean).length;
}

export default function MyRolesView({
  name,
  email,
  roles,
}: {
  name: string;
  email: string;
  roles: (MyRole & { hue: string })[];
}) {
  const first = name.trim().split(/\s+/)[0] || "there";
  const initial = (name.trim()[0] || email.trim()[0] || "?").toUpperCase();
  const groups = new Map<string, (MyRole & { hue: string })[]>();
  for (const role of roles) {
    const key = role.circleId || role.circleName || role.governanceId;
    const list = groups.get(key) ?? [];
    list.push(role);
    groups.set(key, list);
  }
  const ordered = [...groups.values()].sort(
    (a, b) =>
      b.length - a.length ||
      (a[0]?.circleId || "").localeCompare(b[0]?.circleId || ""),
  );
  const single = roles.length === 1;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-10 pb-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Kicker>Atlas</Kicker>
            <p className="m-0 text-[13px] font-semibold text-muted-foreground">
              <Link
                href="/atlas"
                className="underline decoration-ink/22 underline-offset-[3px]"
              >
                All circles
              </Link>
              <span aria-hidden="true"> › </span>
              <span className="text-ink">My roles</span>
            </p>
          </div>
          <h1 className="text-[40px] leading-[0.95] font-normal tracking-tight normal-case sm:text-[56px]">
            Your roles{" "}
            <span className="text-muted-foreground">({roles.length})</span>
          </h1>
          <p className="mt-2 text-lg text-ink">Hi {first}.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-lg font-extrabold text-paper sm:h-11 sm:w-11 sm:text-[22px]">
            {initial}
          </span>
          <div>
            <p className="m-0 font-semibold text-ink">{name || email}</p>
            <p className="m-0 text-sm text-muted-foreground">
              {email} ·{" "}
              <form action={signOut} className="inline">
                <button
                  type="submit"
                  className="cursor-pointer font-semibold underline underline-offset-2"
                >
                  Sign out
                </button>
              </form>
            </p>
          </div>
        </div>
      </div>

      {roles.length === 0 ? (
        <section className="mx-auto mt-8 max-w-[640px] rounded-[20px] border border-ink/14 bg-white px-8 py-11 text-center">
          <div
            className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full"
            style={{ background: "color-mix(in srgb, #ED3B91 15%, white)" }}
            aria-hidden="true"
          >
            <span className="text-3xl font-bold text-coral-dark">+</span>
          </div>
          <h2 className="font-display text-[34px] leading-none font-extrabold uppercase">
            No roles yet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-normal text-ink">
            No roles linked to this account yet. Pick a way to get involved, or
            ask a circle lead what needs doing.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/circle"
              className="border-2 border-ink bg-ink px-4 py-3 text-sm font-black text-paper uppercase no-underline"
            >
              Get involved
            </Link>
            <Link
              href="/atlas"
              className="border-2 border-ink bg-white px-4 py-3 text-sm font-black text-ink uppercase no-underline"
            >
              Explore the map
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            Roles are matched to the email you signed in with.
          </p>
        </section>
      ) : (
        <>
          {!single && (
            <div className="flex min-h-15 items-center gap-3 overflow-x-auto border-y border-ink/14 py-3">
              <div className="flex min-w-0 flex-1 gap-2">
                {ordered.map((group) => {
                  const circle = group[0];
                  return (
                    <a
                      key={circle.circleId || circle.governanceId}
                      href={`#circle-${circle.circleId || circle.governanceId}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/22 bg-white px-3 py-1.5 text-[13px] font-semibold no-underline"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: circle.hue }}
                      />
                      {circle.circleName || "Circle"}
                      <span className="text-muted-foreground">
                        {group.length}
                      </span>
                    </a>
                  );
                })}
              </div>
              <Link
                href="/atlas"
                className="hidden shrink-0 text-sm font-semibold underline underline-offset-2 lg:inline"
              >
                Open the full map →
              </Link>
            </div>
          )}
          <div className="mt-6 grid gap-8">
            {ordered.map((group) => {
              const circle = group[0];
              const groupId = circle.circleId || circle.governanceId;
              return (
                <section key={groupId} id={`circle-${groupId}`}>
                  {!single && (
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <h2 className="m-0 flex items-center gap-2 text-[13px] font-bold tracking-[0.1em] uppercase">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: circle.hue }}
                        />
                        {circle.circleName || "Circle"}
                        {circle.parentName && (
                          <span className="font-semibold tracking-normal text-muted-foreground normal-case">
                            in {circle.parentName}
                          </span>
                        )}
                      </h2>
                      <p className="m-0 text-[13px] text-muted-foreground">
                        {group.length} {group.length === 1 ? "role" : "roles"}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 min-[860px]:grid-cols-2">
                    {group.map((role) => (
                      <article
                        key={role.governanceId}
                        className="relative flex flex-col gap-2.5 rounded-2xl border border-ink/14 bg-white p-[22px] pb-[18px] before:absolute before:top-[18px] before:bottom-[18px] before:left-0 before:w-[3px] hover:border-ink/22 hover:shadow-[0_2px_10px_rgba(24,37,31,0.06)] has-[a:focus-visible]:outline has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-coral-dark"
                        style={{ ["--bar" as string]: role.hue }}
                      >
                        <span
                          className="absolute top-[18px] bottom-[18px] left-0 w-[3px]"
                          style={{ background: role.hue }}
                          aria-hidden="true"
                        />
                        <p className="m-0 flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-muted-foreground uppercase">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: role.hue }}
                          />
                          Role · {role.circleName || "Circle"}
                        </p>
                        <h3 className="m-0 font-display text-[28px] leading-none font-extrabold uppercase">
                          <Link
                            href={`/atlas#governance/circles/${role.governanceId}`}
                            className="text-ink no-underline after:absolute after:inset-0"
                          >
                            {role.name}
                          </Link>
                        </h3>
                        <p className="m-0 text-[15px] leading-normal">
                          {role.purpose || "Purpose not documented."}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-ink/14 pt-3 text-[13px] text-muted-foreground">
                          <p className="m-0">
                            {countItems(role.accountabilities)} accountabilities
                            {" · "}
                            {countItems(role.privileges)} privileges
                          </p>
                          <p className="relative z-1 m-0 flex gap-3 font-semibold">
                            <Link
                              href={`/atlas#governance/circles/${role.governanceId}`}
                              className="text-ink underline underline-offset-2"
                            >
                              Show on map
                            </Link>
                            {role.clickupUrl && (
                              <a
                                href={role.clickupUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink underline underline-offset-2"
                              >
                                Full details in ClickUp ↗
                              </a>
                            )}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
