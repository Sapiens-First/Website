"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerGroups } from "@/lib/site";

export default function SiteFooter() {
  const pathname = usePathname();
  return (
    <footer className={`site-footer${pathname === "/" ? " footer-home" : ""}`}>
      <div className="fun-layer" aria-hidden="true">
        <i
          style={{
            left: "38%",
            bottom: "14%",
            width: "34px",
            color: "var(--paper)",
          }}
        >
          <svg className="moon" viewBox="0 0 40 40" width="34" height="34">
            <mask id="foot-moon-mask">
              <rect width="40" height="40" fill="#fff" />
              <circle cx="27" cy="13" r="14" fill="#000" />
            </mask>
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="currentColor"
              mask="url(#foot-moon-mask)"
            />
          </svg>
        </i>
        <i
          style={{
            left: "45%",
            bottom: "36%",
            width: "9px",
            color: "var(--yellow)",
            transform: "rotate(10deg)",
          }}
        >
          <svg className="star" viewBox="0 0 24 24" width="9" height="9">
            <rect width="24" height="24" fill="currentColor" />
          </svg>
        </i>
        <i
          style={{
            left: "33%",
            bottom: "32%",
            width: "7px",
            color: "var(--yellow)",
            transform: "rotate(-14deg)",
          }}
        >
          <svg className="star" viewBox="0 0 24 24" width="7" height="7">
            <rect width="24" height="24" fill="currentColor" />
          </svg>
        </i>
      </div>
      <div className="wrap">
        <div className="foot-top">
          <Link className="foot-brand" href="/">
            <Image
              src="/favicons/android-chrome-192x192.png"
              alt=""
              width={32}
              height={32}
            />
            <span>Sapiens First</span>
          </Link>
          <div className="foot-cols">
            {footerGroups.map((group) => (
              <div
                className={`foot-col${group.title === "About" ? " foot-col-split" : ""}`}
                key={group.title}
              >
                <span className="foot-col-title">{group.title}</span>
                <div className="foot-col-links">
                  {group.links.map((link) => (
                    <Link href={link.href} key={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} Sapiens First. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
