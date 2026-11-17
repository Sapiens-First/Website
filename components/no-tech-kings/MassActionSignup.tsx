"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { saveInterest } from "@/app/(public)/interest-actions";
import { redesignCopy } from "@/lib/no-tech-kings/copy";
import type { Interest } from "@/lib/members/interests";
import { btnCta, textLink } from "@/components/redesign/styles";
import { cn } from "@/lib/cn";

const supporterList = "membership" satisfies Interest;

export function MassActionSignup() {
  const [state, action, pending] = useActionState(saveInterest, {
    message: "",
  });
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.saved) statusRef.current?.focus();
  }, [state.saved]);

  return (
    <div id="signup" className="mt-[1.15rem] max-w-[26rem] max-[699px]:mt-3.5">
      {state.saved ? (
        <p
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="text-xl leading-snug font-bold text-balance text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue"
        >
          {redesignCopy.signupSuccess}
        </p>
      ) : (
        <form action={action} aria-busy={pending}>
          <input type="hidden" name="interest" value={supporterList} />
          <label className="block text-sm font-bold text-ink">
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              className="mt-1.5 block h-13 w-full border-2 border-ink bg-white px-3 text-[1.0625rem] font-medium text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className={cn(
              btnCta,
              "mt-2.5 w-full disabled:cursor-wait disabled:opacity-70",
            )}
          >
            {pending ? "Saving…" : redesignCopy.signupButton}
          </button>
          <p className="mt-2.5 text-sm leading-snug text-muted">
            {redesignCopy.signupPrivacy}{" "}
            <Link href="/privacy" className={textLink}>
              Privacy
            </Link>
          </p>
          {state.message ? (
            <p role="alert" className="mt-2.5 text-sm font-bold text-ink">
              {state.message}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
