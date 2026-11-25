import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { InView } from "./InView";
import styles from "./rise.module.css";

/**
 * A div whose direct children fade up in turn the first time it scrolls into
 * view. Shows everything straight away without JS or with reduced motion.
 */
export function Rise({ className, ...props }: ComponentProps<"div">) {
  return <InView className={cn(styles.rise, className)} {...props} />;
}
