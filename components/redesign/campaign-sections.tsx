import Image from "next/image";
import Link from "next/link";
import { MassActionSignup } from "@/components/no-tech-kings/MassActionSignup";
import { ChassisMark, SealMark } from "@/components/redesign/marks";
import { Countdown } from "@/components/redesign/Countdown";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import {
  btnCta,
  btnOutline,
  displayTitle,
  sectionY,
  textLink,
  wrap,
} from "@/components/redesign/styles";
import { campaignConfig, hostCountLine } from "@/lib/no-tech-kings/config";
import { pageCopy, redesignCopy } from "@/lib/no-tech-kings/copy";
import { links } from "@/lib/no-tech-kings/links";
import {
  bostonTeaParty,
  declaration,
  dinosaurIllustration,
  heroPhoto,
  parkPhoto,
  teaPartyIllustration,
} from "@/lib/no-tech-kings/media";
import { cn } from "@/lib/cn";

const demands = [
  {
    numeral: "I",
    title: redesignCopy.truthTitle,
    body: redesignCopy.truthBody,
  },
  { numeral: "II", title: redesignCopy.actTitle, body: redesignCopy.actBody },
] as const;

export function CampaignHero({
  tagline,
  declarationHref,
  showPhoto = false,
  showCampaignLine = false,
}: {
  tagline: string;
  declarationHref: string;
  showPhoto?: boolean;
  showCampaignLine?: boolean;
}) {
  const group = links.communityGroups[0];
  return (
    <section className="border-b border-rule pt-8 pb-10 max-[699px]:pt-4 max-[699px]:pb-6">
      <div
        className={cn(
          wrap,
          "grid items-start gap-8",
          showPhoto &&
            "min-[900px]:grid-cols-[1fr_minmax(16rem,0.9fr)] min-[900px]:items-stretch min-[900px]:gap-10",
        )}
      >
        <div className={cn(!showPhoto && "max-w-[40rem]")}>
          <ChassisMark className="mb-2.5 block h-[3.25rem] w-[3.25rem] min-[700px]:mb-4 min-[700px]:h-[4.5rem] min-[700px]:w-[4.5rem]" />
          <p className="mb-2.5 font-display text-[1.05rem] font-bold tracking-[0.08em] text-muted uppercase">
            {pageCopy.eyebrow}
          </p>
          <h1 className="mb-3 font-display text-[clamp(2.75rem,7.2vw,5.75rem)] leading-[0.86] font-extrabold tracking-[-0.03em] text-balance uppercase max-[699px]:mb-2">
            {redesignCopy.headline}
          </h1>
          <p className="mb-4 max-w-[28rem] text-lg font-[650] max-[699px]:mb-2.5">
            {tagline}
          </p>
          <p className="max-w-[34rem] text-lg">{redesignCopy.deck}</p>
          <p className="mt-3 font-colonial text-[clamp(1.35rem,2.4vw,1.75rem)] leading-snug font-semibold text-balance italic">
            {redesignCopy.punch}
          </p>
          <Countdown />
          <MassActionSignup />
          <div className="mt-4 flex flex-wrap items-center gap-x-[1.15rem] gap-y-3">
            <ExternalLink href={campaignConfig.hostForm} className={btnOutline}>
              {redesignCopy.hostTitle} ↗
            </ExternalLink>
            <div className="flex flex-col gap-1.5">
              <p className="text-[0.9375rem] font-bold">
                {redesignCopy.joinCommunity}
              </p>
              <ExternalLink href={group.href} className={btnOutline}>
                {group.city} · {group.platform} ↗
              </ExternalLink>
            </div>
          </div>
          {showCampaignLine ? (
            <p className="mt-4 text-sm text-muted">
              {redesignCopy.campaignBefore}
              {redesignCopy.campaignName}.
            </p>
          ) : null}
          <p className="mt-4">
            <Link href={declarationHref} className={textLink}>
              {redesignCopy.readDeclaration}
            </Link>
          </p>
        </div>
        {showPhoto ? (
          <figure className="relative min-h-72 overflow-hidden border-2 border-ink bg-coral min-[900px]:h-full">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              preload
              sizes="(max-width: 900px) 100vw, 46vw"
              className="object-cover object-[55%_68%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-ink/70 px-2.5 py-1.5 text-sm leading-snug text-paper">
              {redesignCopy.heroCredit}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

export function Demands() {
  return (
    <section
      id="demands"
      className={cn(sectionY, "border-b border-rule bg-soft")}
    >
      <div className={wrap}>
        <p className="mb-6 text-lg">{redesignCopy.demandLead}</p>
        <ul className="grid list-none gap-5 min-[700px]:grid-cols-2 min-[700px]:gap-x-8">
          {demands.map((demand) => (
            <li
              key={demand.numeral}
              className="grid grid-cols-[3rem_1fr] gap-3.5"
            >
              <b className="pt-0.5 text-right font-colonial text-[1.65rem] leading-tight font-bold italic">
                {demand.numeral}
              </b>
              <div>
                <h3 className="mb-1.5 font-display text-[clamp(1.6rem,3vw,2.1rem)] leading-none font-extrabold tracking-[-0.02em] text-balance uppercase">
                  {demand.title}
                </h3>
                <p className="text-[1.05rem]">{demand.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EventBand() {
  return (
    <section id="event" className="bg-ink py-7 text-paper">
      <div className={wrap}>
        <p className="max-w-[46rem] font-display text-[clamp(1.45rem,3vw,2.15rem)] leading-[1.15] font-bold text-balance">
          {redesignCopy.event}
        </p>
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section
      aria-labelledby="manifesto-title"
      className={cn(sectionY, "border-b border-rule")}
    >
      <div
        className={cn(
          wrap,
          "grid items-center gap-6 min-[700px]:grid-cols-[1fr_8.5rem] min-[700px]:gap-8",
        )}
      >
        <div>
          <h2
            id="manifesto-title"
            className="font-colonial text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] font-semibold tracking-normal text-balance normal-case italic"
          >
            {pageCopy.manifestoTitle}
          </h2>
          <p className="mt-4 max-w-[38rem] text-lg">{pageCopy.manifestoBody}</p>
        </div>
        <Image
          src={dinosaurIllustration.src}
          alt={dinosaurIllustration.alt}
          width={dinosaurIllustration.width}
          height={dinosaurIllustration.height}
          unoptimized
          className="mx-auto h-auto w-[8.5rem]"
        />
      </div>
    </section>
  );
}

export function HostSection() {
  return (
    <section
      id="tea-party"
      aria-labelledby="tea-party-title"
      className={cn(sectionY, "border-b border-rule")}
    >
      <div
        className={cn(
          wrap,
          "grid items-start gap-8 min-[800px]:grid-cols-2 min-[800px]:items-center min-[800px]:gap-10",
        )}
      >
        <div>
          <h2 id="tea-party-title" className={displayTitle}>
            {redesignCopy.hostTitle}
          </h2>
          <p className="mt-4 max-w-[34rem] text-lg">{redesignCopy.hostBody}</p>
          <p className="mt-4 font-[650]">{hostCountLine()}</p>
          <div className="mt-5">
            <ExternalLink href={campaignConfig.hostForm} className={btnCta}>
              {redesignCopy.hostTitle} ↗
            </ExternalLink>
          </div>
        </div>
        <div className="min-w-0">
          <figure className="overflow-hidden border-2 border-ink">
            <Image
              src={parkPhoto.src}
              alt={parkPhoto.alt}
              width={parkPhoto.width}
              height={parkPhoto.height}
              sizes="(min-width: 800px) 36rem, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <figure className="m-0 w-[5.5rem] shrink-0">
              <Image
                src={teaPartyIllustration.src}
                alt={teaPartyIllustration.alt}
                width={teaPartyIllustration.width}
                height={teaPartyIllustration.height}
                unoptimized
                className="h-auto w-full"
              />
            </figure>
            <p className="m-0 font-colonial text-[1.15rem] font-semibold italic">
              {redesignCopy.humans}
            </p>
            <figure className="m-0 w-[5.5rem] shrink-0">
              <Image
                src={dinosaurIllustration.src}
                alt={dinosaurIllustration.alt}
                width={dinosaurIllustration.width}
                height={dinosaurIllustration.height}
                unoptimized
                className="h-auto w-full"
              />
            </figure>
          </div>
          <p className="mt-3 text-sm leading-snug text-muted">
            {redesignCopy.parkCredit}
          </p>
        </div>
      </div>
    </section>
  );
}

export function CommunityBand() {
  return (
    <section aria-labelledby="community-title" className={sectionY}>
      <div
        className={cn(
          wrap,
          "flex flex-wrap items-center justify-between gap-5",
        )}
      >
        <div>
          <span className="mb-2 block font-display text-[0.95rem] font-bold tracking-[0.1em] text-muted uppercase">
            {redesignCopy.sanFrancisco}
          </span>
          <h2 id="community-title" className={displayTitle}>
            {redesignCopy.joinCommunity}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {links.communityGroups.map((group) => (
            <ExternalLink key={group.href} href={group.href} className={btnCta}>
              {group.city} · {group.platform} ↗
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Declaration() {
  return (
    <section
      id="declaration"
      aria-labelledby="declaration-title"
      className={cn(sectionY, "bg-paper")}
    >
      <div className={wrap}>
        <article className="relative mx-auto max-w-[46rem] overflow-hidden border-2 border-ink bg-paper px-[clamp(1.15rem,4vw,3.25rem)] pt-[clamp(1.5rem,4vw,3rem)] pb-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-[center_18%] opacity-[0.12]"
            style={{ backgroundImage: `url(${declaration.src})` }}
          />
          <div className="relative">
            <div className="mb-4 flex justify-center">
              <SealMark className="h-[6.5rem] w-[6.5rem]" />
            </div>
            <p className="mb-2 text-center font-colonial text-[1.15rem] italic">
              {redesignCopy.declarationDate}
            </p>
            <h2
              id="declaration-title"
              className="mb-5 text-center font-colonial text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.15] font-semibold tracking-normal text-balance normal-case italic"
            >
              {redesignCopy.declarationTitle}
            </h2>
            <div className="mx-auto max-w-[36rem]">
              <p>{redesignCopy.deck}</p>
              <p className="mt-4 font-colonial text-[1.45rem] font-semibold italic">
                {redesignCopy.punch}
              </p>
              <p className="mt-3">{redesignCopy.declarationLaunch}</p>
              <p className="mt-6 font-bold">{redesignCopy.demandLead}</p>
              <ol className="mt-5 list-none">
                {demands.map((demand) => (
                  <li
                    key={demand.numeral}
                    className="mt-5 grid grid-cols-[3.25rem_1fr] gap-x-4 first:mt-0"
                  >
                    <b className="w-[3.25rem] pt-0.5 text-right font-colonial text-[1.7rem] leading-tight font-bold italic">
                      {demand.numeral}
                    </b>
                    <div>
                      <h3 className="mb-1.5 font-display text-[clamp(1.5rem,3vw,2rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance uppercase">
                        {demand.title}
                      </h3>
                      <p>{demand.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-center">
                <Link href="#signup" className={btnCta}>
                  {redesignCopy.signupButton}
                </Link>
              </p>
            </div>
            <p className="relative mt-6 text-center text-sm leading-snug text-muted">
              {redesignCopy.declarationCredit}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Parallel() {
  return (
    <section
      aria-labelledby="parallel-title"
      className={cn(sectionY, "border-b border-rule bg-soft")}
    >
      <div className={wrap}>
        <span className="mb-2 block font-display text-[0.95rem] font-bold tracking-[0.1em] text-muted uppercase">
          {redesignCopy.parallelKicker}
        </span>
        <h2 id="parallel-title" className={displayTitle}>
          {pageCopy.parallel.pastYear} → {pageCopy.parallel.presentYear}
        </h2>
        <div className="mt-8 grid items-start gap-8 min-[800px]:grid-cols-2">
          <figure>
            <Image
              src={bostonTeaParty.src}
              alt={redesignCopy.currierAlt}
              width={bostonTeaParty.width}
              height={bostonTeaParty.height}
              sizes="(min-width: 800px) 36rem, 100vw"
              className="w-full border-2 border-ink"
            />
            <figcaption className="mt-3 text-sm leading-snug text-muted">
              {redesignCopy.currierCredit}
            </figcaption>
          </figure>
          <div>
            <article>
              <h3 className="mb-2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance">
                {pageCopy.parallel.pastTitle}
              </h3>
              <p className="text-[1.0625rem]">{pageCopy.parallel.pastBody}</p>
            </article>
            <article className="mt-6">
              <h3 className="mb-2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance">
                {pageCopy.parallel.presentTitle}
              </h3>
              <p className="text-[1.0625rem]">
                {pageCopy.parallel.presentBody}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CampaignStrip() {
  return (
    <div className="bg-ink px-[clamp(1rem,4vw,2.5rem)] py-4 text-center text-sm text-paper">
      <p>
        {redesignCopy.campaignBefore}
        <Link href="/" className="font-bold text-brand-yellow">
          {redesignCopy.campaignName}
        </Link>
        .
      </p>
    </div>
  );
}
