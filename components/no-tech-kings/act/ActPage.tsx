import Image from "next/image";
import crown from "@/public/no-tech-kings/three-point-crown.svg";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { EmailGovernor } from "@/components/no-tech-kings/act/EmailGovernor";
import { NtkFooter, NtkHeader } from "@/components/no-tech-kings/NtkChrome";
import { NtkSky } from "@/components/no-tech-kings/NtkSky";
import { NtkStage } from "@/components/no-tech-kings/NtkStage";
import { actCopy, governor, reportUrl } from "@/lib/no-tech-kings/act";
import { ntkFontVars } from "@/lib/no-tech-kings/fonts";
import ntk from "../ntk.module.css";
import styles from "./act.module.css";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

/** /no-tech-kings/act: email Governor Newsom, on the No Tech Kings sunrise. */
export function ActPage() {
  return (
    <NtkStage className={ntkFontVars} firstLightId="why" sunUpId="write">
      <NtkSky />
      <NtkHeader
        logoHref="/no-tech-kings"
        nav={[
          { label: "Why", href: "#why" },
          { label: "No Tech Kings", href: "/no-tech-kings" },
        ]}
        cta={{ label: "Email Newsom", href: "#write" }}
      />

      <main>
        <section
          className={ntk.scene}
          id="top"
          aria-label="Email Governor Newsom"
        >
          <div className={ntk.inner}>
            <Image
              src={crown}
              alt=""
              className={`${ntk.emblem} ${ntk.rise}`}
              style={d(".05s")}
              priority
            />
            <p
              className={`${ntk.date} ${ntk.heroDate} ${ntk.rise}`}
              style={d(".1s")}
            >
              {actCopy.heroDate}
            </p>
            <h1
              className={`${ntk.display} ${styles.heroTitle} ${ntk.rise}`}
              style={d(".16s")}
            >
              Email
              <span>Governor {governor.lastName}.</span>
            </h1>
            <p className={`${ntk.lede} ${ntk.rise}`} style={d(".28s")}>
              {actCopy.heroLede}
            </p>
            <div className={ntk.rise} style={d(".4s")}>
              <a href="#write" className={ntk.cta}>
                {actCopy.heroCta} ↓
              </a>
              <p className={ntk.heroNote}>{actCopy.heroNote}</p>
            </div>
          </div>
        </section>

        <section
          className={`${ntk.scene} ${ntk.sceneLeft} ${ntk.demand}`}
          id="why"
        >
          <div className={ntk.inner} data-inview>
            <p className={ntk.kicker}>The November 18th recommendations</p>
            <h2 className={ntk.sectionTitle}>{actCopy.whyTitle}</h2>
            <p className={styles.whyLede}>{actCopy.whyLede}</p>
            <ol className={styles.points}>
              {actCopy.points.map((point) => (
                <li key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </li>
              ))}
            </ol>
            <ExternalLink href={reportUrl} className={styles.report}>
              {actCopy.reportLink} ↗
            </ExternalLink>
          </div>
        </section>

        <section
          className={`${ntk.scene} ${ntk.involved} ${styles.write}`}
          id="write"
        >
          <div className={styles.writeInner} data-inview>
            <h2 className={ntk.sectionTitle}>{actCopy.writeTitle}</h2>
            <p className={styles.writeLede}>
              Three steps. Your email goes from your own inbox to{" "}
              {governor.email}.
            </p>
            <EmailGovernor />
          </div>
        </section>
      </main>

      <NtkFooter logoHref="/no-tech-kings" />
    </NtkStage>
  );
}
