"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Action";
import { cn } from "@/lib/cn";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      className={cn("copy-btn", copied && "copied")}
      title="Copy link"
      onClick={() =>
        navigator.clipboard.writeText(url).then(
          () => setCopied(true),
          () => {
            /* Clipboard access may be unavailable. */
          },
        )
      }
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
    </Button>
  );
}
