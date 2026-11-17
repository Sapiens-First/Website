import type { ReactNode } from "react";

export function ExternalLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
