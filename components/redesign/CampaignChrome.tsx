"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { campaignConfig, meterHelp } from "@/lib/no-tech-kings/config";
import { redesignCopy } from "@/lib/no-tech-kings/copy";
import { ExternalLink } from "@/components/redesign/ExternalLink";
import { ProgressMeter } from "@/components/redesign/ProgressMeter";
import { btnCta, wrap } from "@/components/redesign/styles";
import { cn } from "@/lib/cn";

function readDismissedUntil() {
  try {
    const raw = localStorage.getItem(campaignConfig.popup.storageKey);
    if (!raw) return 0;
    const data = JSON.parse(raw) as { until?: unknown };
    return typeof data.until === "number" ? data.until : 0;
  } catch {
    return 0;
  }
}

function persistDismissal() {
  const until =
    Date.now() + campaignConfig.popup.expireDays * 24 * 60 * 60 * 1000;
  try {
    localStorage.setItem(
      campaignConfig.popup.storageKey,
      JSON.stringify({ until }),
    );
  } catch {
    // Private mode should still let the dialog close.
  }
}

function isCampaignPath(pathname: string) {
  return pathname === "/" || pathname === "/no-tech-kings";
}

export function CampaignChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const campaignPage = isCampaignPath(pathname);
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(pathname);
  if (pathname !== path) {
    setPath(pathname);
    if (!isCampaignPath(pathname)) setOpen(false);
  }

  useEffect(() => {
    if (pathname !== "/") return;
    const wide = window.matchMedia(
      `(min-width: ${campaignConfig.popup.autoOpenMinWidth}px)`,
    );
    if (!wide.matches || Date.now() < readDismissedUntil()) return;
    const id = window.setTimeout(() => {
      if (!wide.matches || Date.now() < readDismissedUntil()) return;
      setOpen(true);
    }, campaignConfig.popup.autoOpenDelayMs);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <>
      {campaignPage ? <AnnouncementBar onOpen={() => setOpen(true)} /> : null}
      {children}
      {campaignPage && open ? (
        <TeaPartyDialog
          onDismiss={() => {
            persistDismissal();
            setOpen(false);
          }}
          onFollow={persistDismissal}
        />
      ) : null}
    </>
  );
}

function AnnouncementBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="bg-ink text-paper">
      <div
        className={cn(
          wrap,
          "flex min-h-11 flex-wrap items-center gap-x-5 gap-y-2 py-2",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
          <ProgressMeter appearance="announce" />
          <span className="hidden text-sm leading-snug font-medium text-paper/90 min-[700px]:inline">
            {meterHelp()}
          </span>
        </div>
        <button
          type="button"
          className="ml-auto inline-flex min-h-9 shrink-0 cursor-pointer items-center border-2 border-ink bg-brand-yellow px-3.5 py-1.5 font-display text-[1.05rem] leading-none font-bold text-ink hover:bg-paper focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-yellow"
          onClick={onOpen}
        >
          {redesignCopy.hostTitle}
        </button>
      </div>
    </div>
  );
}

function TeaPartyDialog({
  onDismiss,
  onFollow,
}: {
  onDismiss: () => void;
  onFollow: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      ).filter((element) => element.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5 max-[699px]:items-end max-[699px]:p-0">
      <div
        className="absolute inset-0 bg-ink/55"
        onClick={onDismiss}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] max-h-[min(36rem,calc(100dvh-2.5rem))] w-full max-w-[28rem] overflow-auto border-2 border-ink bg-paper p-6 text-ink shadow-[8px_8px_0_var(--color-ink)] max-[699px]:max-h-[min(36rem,calc(100dvh-1.25rem))] max-[699px]:rounded-t-2xl max-[699px]:px-[1.1rem] max-[699px]:pt-[1.15rem] max-[699px]:pb-[calc(1.15rem+env(safe-area-inset-bottom,0px))] max-[699px]:shadow-[0_-6px_0_var(--color-ink)]"
      >
        <button
          ref={closeRef}
          type="button"
          className="absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center border-0 bg-transparent text-2xl leading-none text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
          aria-label="Close"
          onClick={onDismiss}
        >
          ×
        </button>
        <h2
          id={titleId}
          className="pr-8 font-display text-[2rem] leading-none font-extrabold tracking-[-0.02em] text-balance normal-case max-[699px]:text-[1.65rem]"
        >
          {redesignCopy.hostTitle}
        </h2>
        <div className="mt-3.5 mb-4">
          <ProgressMeter appearance="popup" />
        </div>
        <p className="mb-[1.15rem] text-base leading-normal max-[699px]:text-[0.9375rem]">
          {redesignCopy.hostBody}
        </p>
        <ExternalLink
          href={campaignConfig.hostForm}
          className={cn(btnCta, "w-full focus-visible:outline-ink")}
          onClick={onFollow}
        >
          {redesignCopy.hostTitle} ↗
        </ExternalLink>
      </div>
    </div>
  );
}
