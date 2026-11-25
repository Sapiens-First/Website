import Image from "next/image";
import Link from "next/link";
import crown from "@/public/no-tech-kings/three-point-crown.svg";
import { DiscordMark } from "@/components/DiscordMark";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { NtkMenu } from "@/components/no-tech-kings/NtkMenu";
import { redesignCopy } from "@/lib/no-tech-kings/copy";
import { footerGroups, socialLinks } from "@/lib/site-nav";
import styles from "./ntk.module.css";

type BarLink = { label: string; href: string };
type BarCta = BarLink & { external?: boolean };

/** Sticky No Tech Kings bar: crown logo, page links, one yellow button. */
export function NtkHeader({
  logoHref,
  nav,
  cta,
}: {
  logoHref: string;
  nav: readonly BarLink[];
  cta: BarCta;
}) {
  return (
    <header className={styles.bar}>
      <a href={logoHref} className={styles.logo}>
        <Image src={crown} alt="" className={styles.logoMark} />
        No Tech Kings
      </a>
      <nav className={styles.barNav} aria-label="On this page">
        {nav.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      {cta.external ? (
        <ExternalLink href={cta.href} className={styles.barCta}>
          <DiscordMark className={styles.barCtaMark} />
          <span className={styles.barCtaLong}>{cta.label}</span>
          <span className={styles.barCtaShort} aria-hidden="true">
            Join
          </span>
        </ExternalLink>
      ) : (
        <a href={cta.href} className={styles.barCta}>
          {cta.label}
        </a>
      )}
      <NtkMenu nav={nav} />
    </header>
  );
}

export function NtkFooter({ logoHref }: { logoHref: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <div>
          <a href={logoHref} className={styles.logo}>
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
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
