"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignupForm from "./SignupForm";
import { navigation } from "@/lib/site";

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
        link.matches(".nav-cta.join") ||
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
      <header className="site-header">
        <div className="wrap">
          <nav>
            <Link className="brand" href="/">
              <img
                className="brand-logo"
                src="/favicons/android-chrome-192x192.png"
                alt=""
                width={30}
                height={30}
              />
              <span className="brand-name">Sapiens First</span>
            </Link>
            <div className="nav-actions">
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
                      className="nav-dropdown"
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
                        className={`nav-fellowship${active ? " current" : ""}`}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        className="nav-dropdown-toggle"
                        type="button"
                        aria-label={`${item.label} submenu`}
                        aria-expanded={dropdownOpen}
                        aria-controls="nav-about-children"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <span
                          className="nav-dropdown-chevron"
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        className="nav-dropdown-links"
                        id="nav-about-children"
                        hidden={!dropdownOpen}
                      >
                        {item.children.map((child) => (
                          <Link
                            href={child.href}
                            key={child.href}
                            onClick={() => setDropdownOpen(false)}
                          >
                            <span className="nav-dropdown-label">
                              {child.label}
                            </span>
                            <span
                              className="nav-dropdown-arrow"
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
                    className={`nav-fellowship${active ? " current" : ""}`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                className={`nav-cta donate${path === "/donate" ? " current" : ""}`}
                href="/donate"
              >
                Donate
              </Link>
              <Link
                className={`nav-cta join${path === "/join" || path === "/membership" ? " current" : ""}`}
                href="/join"
              >
                Join
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <dialog
        ref={dialogRef}
        className="join-dialog"
        aria-labelledby="join-dialog-title"
        aria-describedby="join-dialog-description"
        onClose={() => setJoinOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setJoinOpen(false);
        }}
      >
        <button
          className="join-dialog-close"
          type="button"
          aria-label="Close signup"
          onClick={() => setJoinOpen(false)}
        >
          ×
        </button>
        <div className="label">Get involved</div>
        <h2 id="join-dialog-title">Join Sapiens First</h2>
        <p id="join-dialog-description">
          Interested in becoming a member? Leave your email and we&apos;ll be in
          touch.
        </p>
        <SignupForm interest="membership" variant="dialog" />
      </dialog>
    </>
  );
}
