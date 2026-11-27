"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function OptionDrawer({
  open,
  labelledBy,
  onClose,
  children,
}: {
  open: boolean;
  labelledBy?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const frame = requestAnimationFrame(() => drawer.classList.add("on"));
    const inert = [
      document.querySelector("header"),
      document.querySelector("footer"),
      document.getElementById("atlas-hero"),
      document.getElementById("atlas-toolbar"),
      document.getElementById("atlas-option"),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);
    inert.forEach((node) => node.setAttribute("inert", ""));
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...drawer.querySelectorAll<HTMLElement>("a, button"),
      ].filter((node) => !node.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      inert.forEach((node) => node.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  if (!open || !mounted) return null;
  return createPortal(
    <div className="atlas-opt">
      <button
        type="button"
        className="scrim on"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
