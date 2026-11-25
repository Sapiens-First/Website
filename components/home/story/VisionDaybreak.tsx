import { InView } from "@/components/story/InView";
import styles from "./vision-daybreak.module.css";

/**
 * Daybreak: after the night of the Crisis band, a sun rises behind the
 * Vision section (and the No Tech Kings card, its horizon) as it scrolls in.
 */
export function VisionDaybreak() {
  return (
    <InView className={styles.daybreak} aria-hidden="true">
      <div className={styles.rays} />
      <div className={styles.sun} />
      <div className={styles.horizon} />
    </InView>
  );
}
