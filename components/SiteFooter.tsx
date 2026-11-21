import Image from "next/image";
import Link from "next/link";
import flameLogo from "@/public/favicons/android-chrome-192x192.png";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { focusRing, wrap } from "@/components/redesign/styles";
import { footerGroups } from "@/lib/site-nav";
import { cn } from "@/lib/cn";

const footerLink = cn(
  focusRing,
  "text-[0.9375rem] font-[650] text-ink no-underline hover:underline",
);

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-soft pt-10 pb-6 text-ink">
      <div className={wrap}>
        <div className="flex flex-wrap justify-between gap-x-12 gap-y-8">
          <Link
            href="/"
            className={cn(
              focusRing,
              "inline-flex items-center gap-2 font-display text-[1.35rem] leading-none font-extrabold text-ink no-underline",
            )}
          >
            <Image
              src={flameLogo}
              alt=""
              width={40}
              height={40}
              className="size-10"
            />
            <span>Sapiens First</span>
          </Link>
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {footerGroups.map((group) => (
              <div key={group.title} className="flex min-w-36 flex-col gap-1.5">
                <h2 className="mb-1 font-display text-[1.05rem] leading-none font-extrabold tracking-[0.08em] uppercase">
                  {group.title}
                </h2>
                {group.links.map((link) =>
                  link.external ? (
                    <ExternalLink
                      key={link.href}
                      href={link.href}
                      className={footerLink}
                    >
                      {link.label}
                    </ExternalLink>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={footerLink}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-4">
          <span className="text-sm text-muted">
            © {new Date().getFullYear()} Sapiens First. All rights reserved.
          </span>
          <nav aria-label="Social media" className="flex gap-2">
            <a
              href="https://www.instagram.com/sapiensfirst.global/"
              aria-label="Sapiens First on Instagram"
              className="inline-flex size-10 items-center justify-center rounded-full border border-ink text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-[1.15rem]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/sapiens-first/"
              aria-label="Sapiens First on LinkedIn"
              className="inline-flex size-10 items-center justify-center rounded-full border border-ink text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-[1.15rem]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.74H4.98V9.19h2.95v9.55ZM6.45 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85h-2.95v-4.65c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.5V9.19h2.83v1.3h.04c.39-.74 1.36-1.52 2.8-1.52 3 0 3.57 1.97 3.57 4.53v5.24Z" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
