import { Archivo_Black, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import crown from "@/public/no-tech-kings/three-point-crown.svg";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { NtkCountdown } from "@/components/no-tech-kings/NtkCountdown";
import { NtkShare } from "@/components/no-tech-kings/NtkShare";
import { NtkSignup } from "@/components/no-tech-kings/NtkSignup";
import { NtkSky } from "@/components/no-tech-kings/NtkSky";
import { NtkStage } from "@/components/no-tech-kings/NtkStage";
import { campaignConfig } from "@/lib/no-tech-kings/config";
import { ntkCopy, redesignCopy } from "@/lib/no-tech-kings/copy";
import { links } from "@/lib/no-tech-kings/links";
import { footerGroups, socialLinks } from "@/lib/site-nav";
import styles from "./ntk.module.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--ntk-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--ntk-sans",
  display: "swap",
});

const crownAlt =
  "No Tech Kings: a three-point crown with circuit traces, crossed out";
const [firstGroup] = links.communityGroups;

export function CampaignPage() {
  return (
    <NtkStage className={`${display.variable} ${sans.variable}`}>
      <NtkSky />
      <Header />

      <main>
        <section className={styles.scene} id="top" aria-label="No Tech Kings">
          <div className={styles.inner}>
            <Image
              src={crown}
              alt={crownAlt}
              className={`${styles.emblem} ${styles.rise}`}
              style={{ "--d": ".05s" } as React.CSSProperties}
              priority
            />
            <p
              className={`${styles.date} ${styles.heroDate} ${styles.rise}`}
              style={{ "--d": ".1s" } as React.CSSProperties}
            >
              {ntkCopy.heroDate}
            </p>
            <h1
              className={`${styles.display} ${styles.hero} ${styles.rise}`}
              style={{ "--d": ".16s" } as React.CSSProperties}
            >
              No Tech
              <br className={styles.brMobile} /> Kings.
              <br />
              <span className={styles.nowrap}>Freeze AI.</span>
            </h1>
            <p
              className={`${styles.lede} ${styles.rise}`}
              style={{ "--d": ".28s" } as React.CSSProperties}
            >
              {ntkCopy.lede}
            </p>
            <div
              className={styles.rise}
              style={{ "--d": ".4s" } as React.CSSProperties}
            >
              <NtkCountdown className={styles.heroCountdown} caption={false} />
              <ExternalLink href={firstGroup.href} className={styles.cta}>
                {ntkCopy.heroCta} ↗
              </ExternalLink>
              <p className={styles.heroNote}>{ntkCopy.heroNote}</p>
            </div>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.sceneLeft}`} id="demand">
          <div className={styles.inner} data-inview>
            <p className={styles.kicker}>{ntkCopy.demandKicker}</p>
            <h2 className={styles.sectionTitle}>{ntkCopy.demandTitle}</h2>
            <div className={styles.split}>
              {ntkCopy.demands.map((demand) => (
                <article key={demand.title}>
                  <h3 className={styles.demandTitle}>{demand.title}</h3>
                  <p>{demand.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${styles.scene} ${styles.sceneLeft} ${styles.involved}`}
          id="involved"
        >
          <div className={styles.inner} data-inview>
            <h2 className={styles.sectionTitle}>{ntkCopy.involvedTitle}</h2>
            <div className={styles.cards}>
              <LinkCard
                title={ntkCopy.community.title}
                teaser={`${firstGroup.city} organizers on ${firstGroup.platform}.`}
                href={firstGroup.href}
                external
              />
              <LinkCard
                title={ntkCopy.calendar.title}
                teaser={ntkCopy.calendar.teaser}
                href="/calendar"
              />
              <LinkCard
                title={redesignCopy.hostTitle}
                teaser={ntkCopy.hostTeaser}
                href={campaignConfig.hostForm}
                external
              />
              <LinkCard
                title={ntkCopy.membership.title}
                teaser={ntkCopy.membership.teaser}
                href="/join"
              />
            </div>
          </div>
          <div
            className={`${styles.inner} ${styles.closer}`}
            id="signup"
            data-inview
          >
            <figure className={styles.quote}>
              <blockquote>
                <p>“{ntkCopy.quote}”</p>
              </blockquote>
              <figcaption>{ntkCopy.quoteBy}</figcaption>
            </figure>
            <NtkSignup />
            <NtkShare />
          </div>
        </section>
      </main>

      <Footer />
    </NtkStage>
  );
}

function LinkCard({
  title,
  teaser,
  href,
  external = false,
}: {
  title: string;
  teaser: string;
  href: string;
  external?: boolean;
}) {
  const body = (
    <div className={styles.cardHead}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <span className={styles.arrow} aria-hidden="true">
        {external ? "↗" : "→"}
      </span>
      <p className={styles.teaser}>{teaser}</p>
    </div>
  );
  const className = `${styles.card} ${styles.linkCard}`;
  return external ? (
    <ExternalLink href={href} className={className}>
      {body}
    </ExternalLink>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

function Header() {
  return (
    <header className={styles.bar}>
      <a href="#top" className={styles.logo}>
        <Image src={crown} alt="" className={styles.logoMark} />
        No Tech Kings
      </a>
      <nav className={styles.barNav} aria-label="On this page">
        <a href="#demand">Demand</a>
      </nav>
      <a href="#involved" className={styles.barDonate}>
        Get Involved
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <div>
          <a href="#top" className={styles.logo}>
            <Image src={crown} alt="" className={styles.logoMark} />
            No Tech Kings
          </a>
          <p className={styles.tagline}>
            {redesignCopy.campaignBefore}
            <Link href="/">{redesignCopy.campaignName}</Link>.
          </p>
        </div>
        <div className={styles.footGroups}>
          {footerGroups.map((group) => (
            <div key={group.title} className={styles.footGroup}>
              <h2>{group.title}</h2>
              {group.links.map((link) =>
                link.external ? (
                  <ExternalLink key={link.href} href={link.href}>
                    {link.label}
                  </ExternalLink>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footBottom}>
        <span>
          © {new Date().getFullYear()} Sapiens First. All rights reserved.
        </span>
        <nav aria-label="Social media">
          {socialLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <ExternalLink href={firstGroup.href}>
            {firstGroup.city} · {firstGroup.platform}
          </ExternalLink>
        </nav>
      </div>
    </footer>
  );
}
