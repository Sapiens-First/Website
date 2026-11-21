"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { saveInterest } from "@/app/(public)/interest-actions";
import type { Interest } from "@/lib/members/interests";
import { ntkCopy, redesignCopy } from "@/lib/no-tech-kings/copy";
import styles from "./ntk.module.css";

const supporterList = "membership" satisfies Interest;

/** Mass-action signup: writes to member_interests like the rest of the site. */
export function NtkSignup({
  stacked = false,
  className,
}: {
  stacked?: boolean;
  className?: string;
}) {
  const [state, action, pending] = useActionState(saveInterest, {
    message: "",
  });
  const statusRef = useRef<HTMLParagraphElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (state.saved) statusRef.current?.focus();
  }, [state.saved]);

  const classes = [
    styles.signup,
    stacked ? styles.signupStacked : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (state.saved) {
    return (
      <div className={classes}>
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className={styles.success}
        >
          {redesignCopy.signupSuccess}
        </p>
      </div>
    );
  }

  return (
    <div className={classes}>
      <form action={action} aria-busy={pending} className={styles.form}>
        <input type="hidden" name="interest" value={supporterList} />
        <div className={styles.field}>
          <label className={styles.srOnly} htmlFor={inputId}>
            Email address
          </label>
          <input
            id={inputId}
            className={styles.input}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="Email address"
          />
        </div>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Saving…" : ntkCopy.signupButton}
        </button>
      </form>
      {state.message ? (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      ) : null}
      <p className={styles.privacy}>
        {redesignCopy.signupPrivacy} <Link href="/privacy">Privacy</Link>
      </p>
    </div>
  );
}
