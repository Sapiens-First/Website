"use client";
import { Container } from "@/components/layout/Container";

import { Label } from "@/components/ui/Text";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignupForm from "./SignupForm";
import { navigation } from "@/lib/site";
import { cn } from "@/lib/cn";

const navLink =
  "relative isolate flex items-center px-2.5 py-3 font-body text-lg font-bold tracking-wider uppercase after:pointer-events-none after:absolute after:inset-x-2 after:bottom-2 after:-z-1 after:h-1.5 after:-rotate-2 after:bg-coral after:opacity-0 after:[clip-path:polygon(0_28%,19%_10%,42%_23%,66%_0,100%_18%,98%_76%,74%_90%,47%_72%,20%_100%,1%_79%)] after:content-[''] hover:after:opacity-75 focus-visible:after:opacity-75 aria-[current=page]:after:opacity-75 max-sm:col-span-2 max-sm:justify-center max-sm:px-1 max-sm:py-2 max-sm:text-center max-sm:text-sm";
const navCta =
  "col-span-3 border-2 border-ink px-4 py-3 text-center font-display text-2xl leading-none font-extrabold uppercase shadow-[4px_4px_0_var(--color-ink)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:rotate-0 hover:shadow-[6px_6px_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--color-ink)] motion-reduce:transition-none motion-reduce:hover:translate-none motion-reduce:active:translate-none max-sm:px-2.5 max-sm:py-2.5 max-sm:text-xl max-sm:whitespace-nowrap";

export default function SiteHeader() {
  const path = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.hasAttribute("data-nav-join") ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      )
        return;
      const url = new URL(link.getAttribute("href") || "", document.baseURI);
      if (
        url.origin !== location.origin ||
        !/^\/(join|join\.html)\/?$/.test(url.pathname)
      )
        return;
      event.preventDefault();
      setJoinOpen(true);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (joinOpen && !dialog.open) dialog.showModal();
    if (!joinOpen && dialog.open) dialog.close();
  }, [joinOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      )
        setDropdownOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);
  return (
    <>
      <header
        data-site-header
        className="sticky top-0 z-50 border-b-2 border-ink bg-[rgba(246,240,231,0.96)] backdrop-blur-[8px] max-sm:relative"
      >
        <Container>
          <nav className="grid min-h-20 grid-cols-[auto_1fr] items-center gap-7 max-lg:min-h-16 max-lg:grid-cols-1 max-lg:gap-2 max-lg:py-2.5">
            <Link
              className="inline-flex w-max -rotate-1 items-center gap-2.5 border-2 border-ink bg-[color-mix(in_srgb,var(--color-coral)_75%,var(--color-paper))] px-3.5 py-2.5 font-body text-2xl leading-none font-black tracking-tighter whitespace-nowrap uppercase shadow-[3px_3px_0_var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink max-sm:gap-2 max-sm:px-2.5 max-sm:py-2 max-sm:text-xl"
              href="/"
            >
              <Image
                className="block size-[0.82em] shrink-0 -translate-y-[0.035em] brightness-0"
                src="/favicons/android-chrome-192x192.png"
                alt=""
                width={30}
                height={30}
              />
              <span className="block">Sapiens First</span>
            </Link>
            <div className="flex items-center gap-4 justify-self-end max-lg:w-full max-lg:justify-between max-lg:gap-1 max-sm:relative max-sm:grid max-sm:grid-cols-6 max-sm:gap-x-2 max-sm:gap-y-2.5 max-sm:p-1 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ink">
              {navigation.map((item) => {
                const active =
                  path === item.href ||
                  (item.href === "/about" &&
                    (path.startsWith("/about/") ||
                      path.startsWith("/careers") ||
                      path === "/atlas"));
                if ("children" in item)
                  return (
                    <div
                      className="relative flex items-center max-sm:static max-sm:col-span-2 max-sm:justify-center"
                      ref={dropdownRef}
                      key={item.href}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") setDropdownOpen(false);
                      }}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget))
                          setDropdownOpen(false);
                      }}
                    >
                      <Link
                        className={navLink}
                        aria-current={active ? "page" : undefined}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        className={cn(
                          "group",
                          "grid min-h-11 min-w-8 cursor-pointer place-items-center border-0 bg-transparent text-ink hover:text-coral-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                        )}
                        type="button"
                        aria-label={`${item.label} submenu`}
                        aria-expanded={dropdownOpen}
                        aria-controls="nav-about-children"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span
                          className="size-2 -translate-y-0.5 rotate-45 border-r-2 border-b-2 border-current group-aria-expanded:translate-y-0.5 group-aria-expanded:rotate-225"
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        className="absolute top-[calc(100%+10px)] left-0 z-5 w-56 -rotate-1 border-2 border-ink bg-paper p-3 shadow-[4px_5px_0_var(--color-ink)] before:absolute before:inset-x-3 before:-top-0.5 before:h-1.5 before:bg-[color-mix(in_srgb,var(--color-coral)_75%,var(--color-paper))] before:content-[''] before:[clip-path:polygon(0_20%,28%_0,54%_24%,100%_5%,98%_85%,66%_100%,32%_76%,1%_100%)] max-sm:top-[calc(100%+14px)] max-sm:left-1 max-sm:w-60 max-sm:max-w-full"
                        id="nav-about-children"
                        hidden={!dropdownOpen}
                      >
                        {item.children.map((child) => (
                          <Link
                            className={cn(
                              "group",
                              "flex items-center justify-between gap-6 px-2.5 py-3.5 font-body text-lg leading-snug font-bold tracking-wider uppercase focus-visible:outline-offset-0!",
                            )}
                            href={child.href}
                            key={child.href}
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className="relative isolate after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:-z-1 after:h-1.5 after:-rotate-2 after:bg-coral after:opacity-0 after:content-[''] after:[clip-path:polygon(0_28%,19%_10%,42%_23%,66%_0,100%_18%,98%_76%,74%_90%,47%_72%,20%_100%,1%_79%)] group-hover:after:opacity-75 group-focus-visible:after:opacity-75">
                              {child.label}
                            </span>
                            <span
                              className="font-body text-xl font-medium"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                return (
                  <Link
                    className={navLink}
                    aria-current={active ? "page" : undefined}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                className={cn(navCta, "-rotate-2 bg-brand-yellow")}
                href="/donate"
                aria-current={path === "/donate" ? "page" : undefined}
              >
                Donate
              </Link>
              <Link
                className={cn(navCta, "rotate-2 bg-[#bcd8ff]")}
                href="/join"
                data-nav-join
                aria-current={path === "/join" ? "page" : undefined}
              >
                Join
              </Link>
            </div>
          </nav>
        </Container>
      </header>
      <dialog
        ref={dialogRef}
        className="mx-4 my-auto max-h-dvh w-auto max-w-xl overflow-auto border-2 border-ink bg-paper px-7 py-10 text-ink shadow-[8px_8px_0_var(--color-ink)] backdrop:bg-black/60 sm:mx-auto"
        aria-labelledby="join-dialog-title"
        aria-describedby="join-dialog-description"
        onClose={() => setJoinOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setJoinOpen(false);
        }}
      >
        <button
          className="absolute top-2 right-2 size-10 cursor-pointer border-0 bg-transparent text-3xl text-ink"
          type="button"
          aria-label="Close signup"
          onClick={() => setJoinOpen(false)}
        >
          ×
        </button>
        <Label tone="coral">Get involved</Label>
        <h2 className="mt-5 mb-4 text-3xl sm:text-5xl" id="join-dialog-title">
          Join Sapiens First
        </h2>
        <p className="mb-6 text-lg leading-normal" id="join-dialog-description">
          Interested in becoming a member? Leave your email and we&apos;ll be in
          touch.
        </p>
        <SignupForm interest="membership" variant="dialog" />
      </dialog>
    </>
  );
}
