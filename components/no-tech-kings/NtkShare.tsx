"use client";

import { useState } from "react";
import { campaignMeta, ntkCopy } from "@/lib/no-tech-kings/copy";
import styles from "./ntk.module.css";

/** Native share sheet where available, otherwise copies the link. */
export function NtkShare() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: campaignMeta.title, url });
      } catch {
        // Closing the share sheet is not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" className={styles.share} onClick={share}>
      <span aria-live="polite">
        {copied ? ntkCopy.shareCopied : ntkCopy.share}
      </span>
    </button>
  );
}
