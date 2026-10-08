import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-coral text-ink hover:bg-coral-dark hover:text-white",
  outline: "bg-transparent text-ink hover:bg-ink hover:text-paper",
  donation: "bg-brand-yellow text-ink hover:bg-brand-yellow/80",
} as const;

const actionClasses = (variant: keyof typeof variants = "outline") =>
  `inline-flex items-center justify-center gap-2 border-2 border-ink px-4 py-3 font-body text-sm font-black uppercase no-underline transition-colors motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:cursor-wait disabled:opacity-60 ${variants[variant]}`;

type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
};

export function ActionLink({
  variant = "outline",
  className = "",
  ...props
}: ActionLinkProps) {
  return <Link className={cn(actionClasses(variant), className)} {...props} />;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "outline",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(actionClasses(variant), className)}
      {...props}
    />
  );
}

export function TextLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "inline-block border-b-2 border-ink pb-0.5 font-body text-xs font-black tracking-wider text-ink uppercase no-underline transition-colors hover:border-coral-dark hover:text-coral-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className,
      )}
      {...props}
    />
  );
}
