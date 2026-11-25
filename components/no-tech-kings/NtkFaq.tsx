import Link from "next/link";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { ntkFaq } from "@/lib/no-tech-kings/copy";
import styles from "./ntk.module.css";

/** FAQ: native <details>, one open at a time (shared `name`). */
export function NtkFaq() {
  return (
    <>
      <h2 className={styles.sectionTitle}>{ntkFaq.title}</h2>
      <p className={styles.involvedLede}>{ntkFaq.lede}</p>
      <div className={styles.faqList}>
        {ntkFaq.items.map((item, i) => (
          <details
            key={item.question}
            name="ntk-faq"
            className={styles.faqItem}
          >
            <summary className={styles.faqQuestion}>
              <span className={styles.faqNumber} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item.question}</span>
              <span className={styles.faqIcon} aria-hidden="true" />
            </summary>
            <div className={styles.faqAnswer}>
              {item.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {"links" in item && item.links ? (
                <p className={styles.faqLinks}>
                  {item.links.map((link) =>
                    "external" in link && link.external ? (
                      <ExternalLink key={link.href} href={link.href}>
                        {link.label} ↗
                      </ExternalLink>
                    ) : link.href.startsWith("#") ? (
                      <a key={link.href} href={link.href}>
                        {link.label} ↑
                      </a>
                    ) : (
                      <Link key={link.href} href={link.href}>
                        {link.label} →
                      </Link>
                    ),
                  )}
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
