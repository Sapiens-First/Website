"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveInterest } from "@/app/(public)/interest-actions";
import type { Interest } from "@/lib/members/interests";

export default function InterestForm({
  interest,
  submitLabel,
}: {
  interest: Interest;
  /** Button text; defaults to one that suits the interest. */
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(saveInterest, {
    message: "",
  });
  const membership = interest === "membership";
  const emailId = useId();

  return (
    <div
      id={membership ? "membership-interest" : "signup"}
      className="relative z-2 scroll-mt-28"
    >
      {state.saved ? (
        <p role="status" className="font-bold">
          {membership
            ? "You’re on the list. We’ll email you about ways to get involved."
            : "Interest registered. We’ll email you about next steps."}
        </p>
      ) : (
        <form
          action={action}
          aria-busy={pending}
          className="max-w-xl space-y-3"
        >
          <input type="hidden" name="interest" value={interest} />
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <Label htmlFor={emailId}>Email address</Label>
              <Input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={pending}
              className="h-12 shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
            >
              {pending
                ? "Saving…"
                : (submitLabel ??
                  (membership
                    ? "Join the email list →"
                    : "Register interest →"))}
            </Button>
          </div>
          <p className="text-sm">
            We&apos;ll email you about ways to get involved.
          </p>
          {state.message && (
            <p role="alert" className="text-sm font-semibold">
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
