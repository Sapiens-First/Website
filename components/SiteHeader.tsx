"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import flameLogo from "@/public/favicons/android-chrome-192x192.png";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { footerGroups } from "@/lib/site-nav";
import styles from "./site-header.module.css";

function isCurrent(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

/**
 * Site header: logo, Donate, and a hamburger at every width that opens a
 * panel with all site links (the same groups as the footer). The bar frosts
 * once the page scrolls.
 */
export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(path);
  const [scrolled, setScrolled] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  if (path !== seenPath) {
    setSeenPath(path);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      burger.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled || open ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      <div className={styles.bar}>
        <Link
          href="/"
          className={styles.logo}
          aria-current={path === "/" ? "page" : undefined}
        >
          <Image src={flameLogo} alt="" width={32} height={32} priority />
          Sapiens First
        </Link>
        <Link
          href="/donate"
          className={styles.donate}
          aria-current={path === "/donate" ? "page" : undefined}
        >
          Donate
        </Link>
        <button
          ref={burger}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="site-menu" className={styles.panel} inert={!open}>
        <div className={styles.panelInner}>
          <nav className={styles.groups} aria-label="Primary">
            {footerGroups.map((group, g) => (
              <div
                className={styles.group}
                key={group.title}
                style={{ "--i": g } as React.CSSProperties}
              >
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <ExternalLink href={link.href} onClick={close}>
                          {link.label}
                        </ExternalLink>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={
                            isCurrent(path, link.href) ? "page" : undefined
                          }
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <Link href="/join" className={styles.join} onClick={close}>
            Join as a Member →
          </Link>
        </div>
      </div>
      <button
        type="button"
        className={styles.scrim}
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
      />
    </header>
  );
}
