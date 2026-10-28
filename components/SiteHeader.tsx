"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";
import { site, siteHref } from "@/lib/site";

const navigation = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Atlas", href: "/atlas" },
    ],
  },
  { label: "Calendar", href: "/calendar" },
  {
    label: "Campaigns",
    href: "/campaigns",
    children: [
      { label: "Freeze AI", href: "/campaigns/freeze-ai" },
      { label: "Stop 1984", href: "/campaigns/stop-1984" },
      { label: "No Killer Robots", href: "/campaigns/no-killer-robots" },
      { label: "Citizens’ Dividend", href: "/campaigns/citizens-dividend" },
    ],
  },
] as const;

const navLink =
  "relative inline-flex min-h-12 items-center justify-center border-b-[3px] border-transparent px-2 py-2 font-body text-[17px] font-bold tracking-normal uppercase transition-colors hover:border-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[current=page]:border-coral motion-reduce:transition-none max-sm:px-1 max-sm:text-sm";
const navCta =
  "inline-flex min-h-12 min-w-22 items-center justify-center border-2 border-ink px-4 py-2.5 font-display text-xl leading-none font-extrabold uppercase shadow-[2px_2px_0_var(--color-ink)] transition-[background-color,color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[3px_4px_0_var(--color-ink)] active:translate-y-px active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:hover:translate-none motion-reduce:active:translate-none max-sm:min-w-0 max-sm:px-1.5 max-sm:text-[17px] max-sm:whitespace-nowrap";

export default function SiteHeader() {
  const path = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    const close = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !navigationRef.current?.contains(event.target)
      )
        setOpenMenu(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenu]);

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b-2 border-ink bg-paper/96 backdrop-blur-[8px] max-sm:relative"
    >
      <Container>
        <nav
          aria-label="Main navigation"
          className="grid min-h-22 grid-cols-[auto_1fr_auto] items-center gap-8 py-3 max-lg:grid-cols-[1fr_auto] max-lg:gap-x-3 max-lg:gap-y-1 max-sm:gap-x-2 max-sm:py-2.5"
        >
          <Link
            className="inline-flex w-max items-center gap-3 font-display text-[1.8rem] leading-none font-extrabold tracking-[0.02em] whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink max-sm:gap-2.5 max-sm:text-2xl"
            href={site.url}
            aria-label="Sapiens First home"
          >
            <Image
              className="block size-[42px] shrink-0 object-contain max-sm:size-[36px]"
              src="/assets/brand/dinosaur-purple.png"
              alt=""
              width={42}
              height={42}
              priority
            />
            <span className="inline-block -rotate-[1.5deg] border border-ink bg-brand-yellow px-[0.22em] py-[0.12em] leading-none shadow-[2px_2px_0_var(--color-ink)]">
              Sapiens First
            </span>
          </Link>
          <div
            className="flex items-center gap-5 justify-self-end max-lg:col-span-2 max-lg:row-start-2 max-lg:w-full max-lg:justify-between max-sm:gap-2"
            ref={navigationRef}
          >
            {navigation.map((item) => {
              const active =
                path === item.href ||
                path.startsWith(`${item.href}/`) ||
                ("children" in item &&
                  item.children.some(
                    (child) =>
                      path === child.href || path.startsWith(`${child.href}/`),
                  ));
              if (!("children" in item))
                return (
                  <Link
                    className={navLink}
                    aria-current={active ? "page" : undefined}
                    href={siteHref(item.href)}
                    key={item.href}
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                );
              const expanded = openMenu === item.href;
              const menuId = `nav-${item.label.toLowerCase()}-children`;
              return (
                <div
                  className="relative flex items-center"
                  key={item.href}
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && expanded) {
                      setOpenMenu(null);
                      event.currentTarget.querySelector("button")?.focus();
                    }
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                      setOpenMenu(null);
                  }}
                >
                  <Link
                    className={navLink}
                    aria-current={active ? "page" : undefined}
                    href={siteHref(item.href)}
                    onClick={() => setOpenMenu(null)}
                  >
                    {item.label}
                  </Link>
                  <button
                    className="group grid min-h-12 min-w-8 cursor-pointer place-items-center border-0 bg-transparent text-ink hover:bg-brand-blue-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink max-sm:min-w-7"
                    type="button"
                    aria-label={`${item.label} menu`}
                    aria-expanded={expanded}
                    aria-controls={menuId}
                    onClick={() => setOpenMenu(expanded ? null : item.href)}
                  >
                    <span
                      className="size-1.5 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-current group-aria-expanded:translate-y-0.5 group-aria-expanded:rotate-225"
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={cn(
                      "absolute top-[calc(100%+9px)] z-5 w-72 border-2 border-ink bg-paper p-2 shadow-[4px_5px_0_var(--color-ink)] max-sm:w-64",
                      item.href === "/campaigns" ? "right-0" : "left-0",
                    )}
                    id={menuId}
                    hidden={!expanded}
                  >
                    {item.children.map((child) => (
                      <Link
                        className="flex min-h-11 items-center justify-between gap-4 px-3 py-3 font-body text-sm leading-snug font-bold uppercase hover:bg-brand-blue-soft focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ink aria-[current=page]:bg-brand-blue-soft"
                        href={siteHref(child.href)}
                        key={child.href}
                        aria-current={path === child.href ? "page" : undefined}
                        onClick={() => setOpenMenu(null)}
                      >
                        <span>{child.label}</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 max-lg:col-start-2 max-lg:row-start-1 max-sm:gap-1.5">
            <Link
              className={cn(navCta, "bg-brand-yellow hover:bg-soft")}
              href={siteHref("/donate")}
              aria-current={path === "/donate" ? "page" : undefined}
            >
              Donate
            </Link>
            <Link
              className={cn(
                navCta,
                "bg-brand-blue text-white hover:bg-brand-blue-dark",
              )}
              href={siteHref("/join")}
              aria-current={path === "/join" ? "page" : undefined}
            >
              Join
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
