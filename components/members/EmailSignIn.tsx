"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Action";
import {
  signInWithEmail,
  type EmailSignInState,
} from "@/app/auth/email-actions";

type Action = (
  previous: EmailSignInState,
  form: FormData,
) => Promise<EmailSignInState>;

export function EmailSignIn({
  next,
  action = signInWithEmail,
}: {
  next: string;
  action?: Action;
}) {
  const [state, formAction, pending] = useActionState(action, {
    sent: null,
    error: null,
  });
  if (state.sent)
    return (
      <div role="status" className="border-2 border-ink bg-brand-blue-soft p-5">
        <p className="font-display text-2xl font-extrabold uppercase">
          Check your inbox.
        </p>
        <p className="mt-2 leading-relaxed">
          We sent a sign-in link to <strong>{state.sent}</strong>. Open it in
          this browser to continue. It may take a minute to arrive.
        </p>
      </div>
    );
  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="join-email" className="font-bold">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="join-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={pending}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "join-email-error" : undefined}
          placeholder="you@example.com"
          className="min-h-14 w-full min-w-0 border-2 border-ink bg-white px-4 text-base text-ink focus:outline-2 focus:outline-offset-2 focus:outline-ink aria-invalid:border-red-700"
        />
        <Button
          type="submit"
          disabled={pending}
          className="min-h-14 shrink-0 px-6"
        >
          {pending ? "Sending…" : "Email me a link"}
        </Button>
      </div>
      {state.error && (
        <p
          id="join-email-error"
          role="alert"
          className="mt-2 text-sm text-red-800"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
