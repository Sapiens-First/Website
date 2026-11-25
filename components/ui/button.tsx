import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";

/*
 * shadcn/ui Button, restyled for Sapiens First: square, ink-bordered,
 * uppercase. Variant names keep the site's existing vocabulary.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-body font-black uppercase no-underline transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border-2 border-ink bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground motion-safe:hover:-translate-y-0.5",
        outline:
          "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper motion-safe:hover:-translate-y-0.5",
        donation:
          "border-2 border-ink bg-secondary text-secondary-foreground hover:bg-secondary/80 motion-safe:hover:-translate-y-0.5",
        link: "border-b-2 border-ink pb-0.5 text-xs tracking-wider text-ink hover:border-coral-dark hover:text-coral-dark",
      },
      size: {
        default: "px-4 py-3 text-sm",
        inline: "",
      },
    },
    compoundVariants: [{ variant: "link", className: "inline-block" }],
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "outline"}
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ActionLinkProps = React.ComponentProps<typeof Link> &
  Pick<VariantProps<typeof buttonVariants>, "variant">;

/** A Next.js link that looks like a button. */
function ActionLink({ className, variant, ...props }: ActionLinkProps) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Small uppercase underlined link, for secondary navigation. */
function TextLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "link", size: "inline" }),
        className,
      )}
      {...props}
    />
  );
}

export { ActionLink, Button, buttonVariants, TextLink };
