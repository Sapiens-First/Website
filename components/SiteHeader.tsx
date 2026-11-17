"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import flameLogo from "@/public/favicons/android-chrome-192x192.png";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { focusRing, wrap } from "@/components/redesign/styles";
import { campaignConfig } from "@/lib/no-tech-kings/config";
import { cn } from "@/lib/cn";

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Careers", href: "/careers" },
] as const;

const involvedLinks = [
  {
    label: "Host a Tea Party ↗",
    href: campaignConfig.hostForm,
    external: true,
  },
  { label: "Membership", href: "/join", external: false },
  { label: "Calendar", href: "/calendar", external: false },
] as const;

function isCurrent(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const path = usePathname();
  const [openMenu, setOpenMenu] = useState<"about" | "involved" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(path);
  const aboutRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);
  const aboutTrigger = useRef<HTMLAnchorElement>(null);
  const involvedTrigger = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const aboutSuppressed = useRef(false);
  const involvedSuppressed = useRef(false);
  const aboutMenuId = useId();
  const involvedMenuId = useId();
  const mobileAboutId = useId();
  const mobileInvolvedId = useId();
  const [aboutAccordion, setAboutAccordion] = useState(false);
  const [involvedAccordion, setInvolvedAccordion] = useState(false);

  if (path !== seenPath) {
    setSeenPath(path);
    setOpenMenu(null);
    setMobileOpen(false);
    setAboutAccordion(false);
    setInvolvedAccordion(false);
  }

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!aboutRef.current?.contains(target)) {
        aboutSuppressed.current = false;
        setOpenMenu((current) => (current === "about" ? null : current));
      }
      if (!involvedRef.current?.contains(target)) {
        involvedSuppressed.current = false;
        setOpenMenu((current) => (current === "involved" ? null : current));
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      burgerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!openMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (openMenu === "about") {
        aboutSuppressed.current = true;
        aboutTrigger.current?.focus();
      } else {
        involvedSuppressed.current = true;
        involvedTrigger.current?.focus();
      }
      setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMenu]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const onChange = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className={cn(wrap, "flex min-h-18 items-center gap-3")}>
        <Link
          href="/"
          aria-current={path === "/" ? "page" : undefined}
          className={cn(
            focusRing,
            "inline-flex shrink-0 items-center gap-2 font-display text-[1.15rem] leading-none font-extrabold tracking-wide text-ink no-underline min-[400px]:text-[1.35rem]",
          )}
        >
          <Image
            src={flameLogo}
            alt=""
            width={32}
            height={32}
            priority
            className="size-8"
          />
          Sapiens First
        </Link>
        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-0.5 min-[900px]:flex"
        >
          <div
            ref={aboutRef}
            className="relative"
            onMouseEnter={() => {
              if (!aboutSuppressed.current) setOpenMenu("about");
            }}
            onMouseLeave={() => {
              aboutSuppressed.current = false;
              setOpenMenu((current) => (current === "about" ? null : current));
            }}
            onFocus={() => {
              if (!aboutSuppressed.current) setOpenMenu("about");
            }}
            onBlur={(event) => {
              if (!aboutRef.current?.contains(event.relatedTarget)) {
                aboutSuppressed.current = false;
                setOpenMenu((current) =>
                  current === "about" ? null : current,
                );
              }
            }}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.stopPropagation();
              aboutSuppressed.current = true;
              setOpenMenu((current) => (current === "about" ? null : current));
              aboutTrigger.current?.focus();
            }}
          >
            <Link
              ref={aboutTrigger}
              data-menu-trigger
              href="/about"
              aria-current={isCurrent(path, "/about") ? "page" : undefined}
              aria-expanded={openMenu === "about"}
              aria-haspopup="true"
              aria-controls={aboutMenuId}
              className={cn(
                focusRing,
                "inline-flex items-center gap-1 px-2.5 py-2 text-[0.9375rem] leading-tight font-bold text-ink no-underline",
                isCurrent(path, "/about") &&
                  "shadow-[inset_0_-2px_0_var(--color-coral)]",
              )}
            >
              About
            </Link>
            <MenuList
              id={aboutMenuId}
              open={openMenu === "about"}
              label="About"
            >
              {aboutLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      isCurrent(path, item.href) ? "page" : undefined
                    }
                    className={menuLink}
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </MenuList>
          </div>
          <div
            ref={involvedRef}
            className="relative"
            onMouseEnter={() => {
              if (!involvedSuppressed.current) setOpenMenu("involved");
            }}
            onMouseLeave={() => {
              involvedSuppressed.current = false;
              setOpenMenu((current) =>
                current === "involved" ? null : current,
              );
            }}
            onFocus={() => {
              if (!involvedSuppressed.current) setOpenMenu("involved");
            }}
            onBlur={(event) => {
              if (!involvedRef.current?.contains(event.relatedTarget)) {
                involvedSuppressed.current = false;
                setOpenMenu((current) =>
                  current === "involved" ? null : current,
                );
              }
            }}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.stopPropagation();
              involvedSuppressed.current = true;
              setOpenMenu((current) =>
                current === "involved" ? null : current,
              );
              involvedTrigger.current?.focus();
            }}
          >
            <button
              ref={involvedTrigger}
              data-menu-trigger
              type="button"
              aria-expanded={openMenu === "involved"}
              aria-haspopup="true"
              aria-controls={involvedMenuId}
              className={cn(
                focusRing,
                "inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent px-2.5 py-2 text-[0.9375rem] leading-tight font-bold text-ink",
              )}
              onClick={() => {
                involvedSuppressed.current = false;
                setOpenMenu((current) =>
                  current === "involved" ? null : "involved",
                );
              }}
            >
              Get Involved
              <Caret />
            </button>
            <MenuList
              id={involvedMenuId}
              open={openMenu === "involved"}
              label="Get Involved"
            >
              {involvedLinks.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <ExternalLink href={item.href} className={menuLink}>
                      {item.label}
                    </ExternalLink>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={
                        isCurrent(path, item.href) ? "page" : undefined
                      }
                      className={menuLink}
                      onClick={() => setOpenMenu(null)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </MenuList>
          </div>
          <Link
            href="/no-tech-kings"
            aria-current={
              isCurrent(path, "/no-tech-kings") ? "page" : undefined
            }
            className={cn(
              focusRing,
              "inline-flex items-center px-2.5 py-2 text-[0.9375rem] leading-tight font-bold text-ink no-underline",
              isCurrent(path, "/no-tech-kings") &&
                "shadow-[inset_0_-2px_0_var(--color-coral)]",
            )}
          >
            No Tech Kings
          </Link>
        </nav>
        <Link
          href="/donate"
          aria-current={path === "/donate" ? "page" : undefined}
          className={cn(
            focusRing,
            "ml-auto inline-flex min-h-10 shrink-0 items-center justify-center border-2 border-ink bg-brand-yellow px-3.5 py-2 font-display text-[1.15rem] leading-none font-extrabold text-ink no-underline hover:bg-paper min-[900px]:ml-4",
          )}
        >
          Donate
        </Link>
        <button
          ref={burgerRef}
          type="button"
          className={cn(
            focusRing,
            "ml-1 inline-flex min-h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center border-2 border-ink bg-transparent px-1.5 text-sm font-extrabold tracking-[0.06em] text-ink uppercase min-[900px]:hidden",
          )}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          Menu
        </button>
      </div>
      <div
        id="mobile-nav"
        className={cn(
          "border-t border-rule bg-paper min-[900px]:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col px-[clamp(1rem,4vw,2.5rem)] pt-2 pb-5">
          <Accordion
            id={mobileAboutId}
            label="About"
            open={aboutAccordion}
            onToggle={() => setAboutAccordion((open) => !open)}
          >
            {aboutLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={mobileSubLink}
                  aria-current={isCurrent(path, item.href) ? "page" : undefined}
                  onClick={closeMobile}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </Accordion>
          <Accordion
            id={mobileInvolvedId}
            label="Get Involved"
            open={involvedAccordion}
            onToggle={() => setInvolvedAccordion((open) => !open)}
          >
            {involvedLinks.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <ExternalLink
                    href={item.href}
                    className={mobileSubLink}
                    onClick={closeMobile}
                  >
                    {item.label}
                  </ExternalLink>
                ) : (
                  <Link
                    href={item.href}
                    className={mobileSubLink}
                    aria-current={
                      isCurrent(path, item.href) ? "page" : undefined
                    }
                    onClick={closeMobile}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </Accordion>
          <Link
            href="/no-tech-kings"
            aria-current={
              isCurrent(path, "/no-tech-kings") ? "page" : undefined
            }
            className={cn(mobileTopLink, focusRing)}
            onClick={closeMobile}
          >
            No Tech Kings
          </Link>
        </div>
      </div>
    </header>
  );
}

const menuLink =
  "block px-3.5 py-2 text-[0.9375rem] font-[650] text-ink no-underline hover:bg-soft focus-visible:bg-soft focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-brand-blue";

const mobileTopLink =
  "block border-b border-rule py-3 text-[1.05rem] font-bold text-ink no-underline";

const mobileSubLink =
  "block py-1.5 text-[0.9375rem] font-[650] text-ink no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

function MenuList({
  id,
  open,
  label,
  children,
}: {
  id: string;
  open: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <ul
      id={id}
      aria-label={label}
      className={cn(
        "absolute top-[calc(100%-2px)] left-0 z-50 min-w-[13.5rem] list-none border border-ink bg-paper py-1.5 shadow-[4px_4px_0_var(--color-ink)]",
        open ? "block" : "hidden",
      )}
    >
      {children}
    </ul>
  );
}

function Accordion({
  id,
  label,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        className={cn(
          focusRing,
          "flex w-full cursor-pointer items-center justify-between border-0 border-b border-rule bg-transparent py-3 text-left text-[1.05rem] font-bold text-ink",
        )}
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        {label}
        <Caret open={open} />
      </button>
      <ul
        id={id}
        className={cn("list-none pt-1 pb-2 pl-2", open ? "block" : "hidden")}
      >
        {children}
      </ul>
    </>
  );
}

function Caret({ open = false }: { open?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mr-0.5 inline-block size-2 border-r-2 border-b-2 border-current",
        open
          ? "mt-1 -translate-y-px rotate-[225deg]"
          : "translate-y-[-1px] rotate-45",
      )}
    />
  );
}
