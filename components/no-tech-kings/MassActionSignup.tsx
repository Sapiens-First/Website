"use client";

import { useActionState } from "react";
import { saveInterest } from "@/app/(public)/interest-actions";
import type { Interest } from "@/lib/members/interests";

const supporterList = "membership" satisfies Interest;

export function MassActionSignup() {
  const [state, action, pending] = useActionState(saveInterest, {
    message: "",
  });

  if (state.saved) {
    return (
      <p
        role="status"
        className="mx-auto mt-10 max-w-xl text-xl leading-snug font-bold text-balance text-ink sm:text-2xl"
      >
        You’re signed up for the mass action. We’ll email you about ways to get
        involved.
      </p>
    );
  }

  return (
    <form
      action={action}
      aria-busy={pending}
      className="mx-auto mt-10 w-full max-w-xl text-left"
    >
      <input type="hidden" name="interest" value={supporterList} />
      <label className="block text-sm font-bold text-ink">
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          className="mt-2 block h-14 w-full border-2 border-ink bg-white px-3 text-lg font-medium text-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 inline-flex min-h-14 w-full items-center justify-center bg-brick px-6 py-3 text-center font-display text-2xl leading-none font-bold text-paper normal-case shadow-[4px_4px_0_var(--color-ink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[4px] focus-visible:outline-ink disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Saving…" : "Sign up for the mass action →"}
      </button>
      <p className="mt-3 text-center text-sm leading-snug text-muted">
        We’ll email you about ways to get involved.
      </p>
      {state.message ? (
        <p
          role="alert"
          className="mt-3 text-center text-sm font-bold text-coral-dark"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
