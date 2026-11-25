import Image from "next/image";
import crown from "@/public/no-tech-kings/three-point-crown.svg";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { NtkFooter, NtkHeader } from "@/components/no-tech-kings/NtkChrome";
import { NtkInvolved } from "@/components/no-tech-kings/NtkInvolved";
import { NtkCountdown } from "@/components/no-tech-kings/NtkCountdown";
import { NtkShare } from "@/components/no-tech-kings/NtkShare";
import { NtkSignup } from "@/components/no-tech-kings/NtkSignup";
import { NtkSky } from "@/components/no-tech-kings/NtkSky";
import { NtkStage } from "@/components/no-tech-kings/NtkStage";
import { ntkFontVars } from "@/lib/no-tech-kings/fonts";
import { ntkCopy } from "@/lib/no-tech-kings/copy";
import { links } from "@/lib/no-tech-kings/links";
import styles from "./ntk.module.css";

const crownAlt =
  "No Tech Kings: a three-point crown with circuit traces, crossed out";
export function CampaignPage() {
  return (
    <NtkStage className={ntkFontVars}>
      <NtkSky />
      <NtkHeader
        logoHref="#top"
        nav={[
          { label: "Demand", href: "#demand" },
          { label: "Email Newsom", href: "/no-tech-kings/act" },
        ]}
        cta={{ label: "Get Involved", href: "#involved" }}
      />

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
              <ExternalLink href={links.groupsMap.href} className={styles.cta}>
                {ntkCopy.heroCta} ↗
              </ExternalLink>
              <p className={styles.heroNote}>{ntkCopy.heroNote}</p>
            </div>
          </div>
        </section>

        <section
          className={`${styles.scene} ${styles.sceneLeft} ${styles.demand}`}
          id="demand"
        >
          <div className={styles.inner} data-inview>
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
            <NtkInvolved />
          </div>
          <div
            className={`${styles.inner} ${styles.closer}`}
            id="signup"
            data-inview
          >
            <NtkSignup />
            <figure className={styles.quote}>
              <blockquote>
                <p>“{ntkCopy.quote}”</p>
              </blockquote>
              <figcaption>{ntkCopy.quoteBy}</figcaption>
            </figure>
            <NtkShare />
          </div>
        </section>
      </main>

      <NtkFooter logoHref="#top" />
    </NtkStage>
  );
}
