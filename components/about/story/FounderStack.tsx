import type { ReactNode } from "react";
import { InView } from "@/components/story/InView";
import { cn } from "@/lib/cn";
import styles from "./founder-stack.module.css";

/**
 * One person to start: the founder's photo is dealt onto a small stack of
 * coloured cards, which fan out behind it as it scrolls in, like the first
 * of many. Wraps the photo frame.
 */
export function FounderStack({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <InView className={cn(styles.stack, className)}>
      <span className={styles.card} data-card="0" aria-hidden="true" />
      <span className={styles.card} data-card="1" aria-hidden="true" />
      <div className={styles.photo}>{children}</div>
    </InView>
  );
}
