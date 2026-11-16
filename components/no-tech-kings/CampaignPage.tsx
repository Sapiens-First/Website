import Image from "next/image";
import { Fraunces } from "next/font/google";
import {
  explanations,
  joinGroupDetail,
  pageCopy,
} from "@/lib/no-tech-kings/copy";
import { links } from "@/lib/no-tech-kings/links";
import { declaration, gallery } from "@/lib/no-tech-kings/media";
import { cn } from "@/lib/cn";
import { CampaignLink } from "@/components/no-tech-kings/CampaignLink";
import { MassActionSignup } from "@/components/no-tech-kings/MassActionSignup";
import { TeaHarbor } from "@/components/no-tech-kings/TeaHarbor";
import { WaxSeal } from "@/components/no-tech-kings/WaxSeal";
import "./campaign.css";

const colonialFont = Fraunces({
  weight: ["500", "700"],
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const band = "px-5 py-20 sm:px-8 sm:py-28 lg:py-32";
const stack = "mx-auto w-full max-w-6xl";

const frameColors = [
  "border-coral",
  "border-brand-yellow",
  "border-paper",
] as const;

export function CampaignPage() {
  const groups = links.communityGroups;
  const communityDetail =
    groups.length === 1
      ? joinGroupDetail(groups[0].city, groups[0].platform)
      : explanations.joinCommunity;

  return (
    <main
      id="content"
      className={cn(colonialFont.variable, "bg-paper font-body")}
    >
      <header className="relative overflow-hidden px-5 pt-16 pb-20 text-center sm:px-8 sm:pt-24 sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-[center_18%] opacity-40"
          style={{ backgroundImage: `url(${declaration.src})` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/65 via-paper/82 to-paper"
        />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
          <WaxSeal className="h-14 w-14 sm:h-16 sm:w-16" />
          <p className="mt-6 max-w-2xl text-sm leading-snug font-bold tracking-wide text-balance text-ink sm:text-base">
            {pageCopy.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(3.6rem,13vw,8.25rem)] leading-[0.82] font-extrabold tracking-tight text-balance text-ink uppercase">
            No Tech Kings!
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-snug text-pretty text-ink sm:text-2xl">
            {pageCopy.mission}
          </p>
          <MassActionSignup />
          <a
            href="#tea-party"
            className="mt-8 inline-flex min-h-12 items-center justify-center font-bold text-ink underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            See the tea party ↓
          </a>
        </div>
      </header>

      <section
        id="tea-party"
        aria-labelledby="tea-party-title"
        className={cn(band, "scroll-mt-28 bg-navy text-paper")}
      >
        <div className={stack}>
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <p className="font-display text-sm font-bold tracking-[0.16em] text-brand-yellow uppercase">
                December 14, 2026
              </p>
              <h2
                id="tea-party-title"
                className="mt-3 font-display text-5xl leading-[0.9] font-extrabold tracking-tight text-balance normal-case sm:text-7xl"
              >
                Host a tea party.
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-md text-lg leading-snug text-pretty sm:text-xl">
                {explanations.hostTeaParty}
              </p>
              <div className="group mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <CampaignLink
                  href={links.hostTeaParty.href}
                  external={links.hostTeaParty.external}
                  className="inline-flex min-h-14 w-full items-center justify-center bg-paper px-5 py-3 text-center font-display text-2xl leading-none font-bold text-ink normal-case shadow-[4px_4px_0_#ffc928] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[4px] focus-visible:outline-brand-yellow sm:w-auto"
                >
                  Host a tea party →
                </CampaignLink>
                <TeaHarbor />
              </div>
            </div>
          </div>
          <ul className="mt-14 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {gallery.map((image, index) => (
              <li
                key={image.src}
                className={cn(
                  "w-[78%] shrink-0 snap-start overflow-hidden rounded-lg border-4 bg-soft sm:w-auto",
                  frameColors[index] ?? "border-paper",
                )}
              >
                <div className="relative h-44 sm:h-64">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 30vw, 78vw"
                    className={
                      image.fit === "cover"
                        ? "object-cover object-[center_62%]"
                        : "object-contain p-3 sm:p-6"
                    }
                    unoptimized={image.src.endsWith(".svg")}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-paper/80">
            Park photograph by Rob Bye, London Fields, 2016, CC0. Tea party and
            dinosaur illustrations made for No Tech Kings.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="parallel-title"
        className={cn(band, "bg-soft text-ink")}
      >
        <div className={stack}>
          <p className="font-display text-sm font-bold tracking-[0.16em] text-brick uppercase">
            Boston, then San Francisco
          </p>
          <h2
            id="parallel-title"
            className="mt-3 max-w-4xl font-display text-5xl leading-[0.9] font-extrabold tracking-tight text-balance normal-case sm:text-7xl"
          >
            {pageCopy.parallel.pastYear} → {pageCopy.parallel.presentYear}
          </h2>
          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <article>
              <h3 className="font-display text-3xl leading-tight font-bold tracking-normal text-balance normal-case sm:text-4xl">
                {pageCopy.parallel.pastTitle}
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                {pageCopy.parallel.pastBody}
              </p>
            </article>
            <article>
              <h3 className="font-display text-3xl leading-tight font-bold tracking-normal text-balance normal-case sm:text-4xl">
                {pageCopy.parallel.presentTitle}
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed">
                {pageCopy.parallel.presentBody}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="manifesto-title"
        className={cn(band, "bg-ink text-paper")}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-display text-sm font-bold tracking-[0.16em] text-brand-yellow uppercase">
            We are the Human Revolution
          </p>
          <h2
            id="manifesto-title"
            className="mt-5 font-colonial text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.05] font-bold text-balance text-paper normal-case italic"
          >
            {pageCopy.manifestoTitle}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl">
            {pageCopy.manifestoBody}
          </p>
          <p className="mt-8 inline-flex items-center rounded-full bg-coral px-4 py-2 font-display text-lg leading-none font-bold text-ink normal-case">
            Humans, not dinosaurs.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="community-title"
        className={cn(band, "bg-sage text-paper")}
      >
        <div
          className={cn(
            stack,
            "grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16",
          )}
        >
          <div>
            <p className="font-display text-sm font-bold tracking-[0.16em] text-brand-yellow uppercase">
              San Francisco
            </p>
            <h2
              id="community-title"
              className="mt-3 font-display text-5xl leading-[0.9] font-extrabold tracking-tight text-balance normal-case sm:text-7xl"
            >
              Join the community.
            </h2>
          </div>
          <div>
            <p className="max-w-md text-lg leading-snug text-pretty sm:text-xl">
              {communityDetail}
            </p>
            <ul className="mt-6 grid list-none gap-3">
              {groups.map((group) => (
                <li key={group.href}>
                  <CampaignLink
                    href={group.href}
                    external={group.external}
                    className="inline-flex min-h-14 w-full items-center justify-between gap-3 bg-paper px-5 py-3 font-display text-2xl leading-none font-bold text-ink normal-case shadow-[4px_4px_0_var(--color-ink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[4px] focus-visible:outline-brand-yellow sm:w-auto"
                  >
                    <span>
                      {group.city} · {group.platform} →
                    </span>
                  </CampaignLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="brand-stripe bg-paper px-5 py-8 text-center text-ink sm:px-8">
        <p className="text-base leading-relaxed sm:text-lg">
          No Tech Kings is a campaign of{" "}
          <CampaignLink
            href={links.sapiensFirst.href}
            external={links.sapiensFirst.external}
            className="font-bold underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
          >
            Sapiens First
          </CampaignLink>
        </p>
      </footer>
    </main>
  );
}
