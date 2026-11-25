"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Site chrome. The No Tech Kings pages bring its own dark header and footer (same
 * links, from lib/site-nav), so the site header and footer are skipped there.
 */
export function CampaignChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const path = usePathname();
  const campaignPage =
    path === "/no-tech-kings" || path.startsWith("/no-tech-kings/");

  return (
    <>
      {campaignPage ? null : header}
      {children}
      {campaignPage ? null : footer}
    </>
  );
}
