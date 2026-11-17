import type { ReactNode } from "react";

type CampaignLinkProps = {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function CampaignLink({
  href,
  external = false,
  className,
  children,
}: CampaignLinkProps) {
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
