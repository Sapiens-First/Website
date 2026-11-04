"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Action";
import { saveInterest } from "@/app/(public)/interest-actions";
import type { Interest } from "@/lib/members/interests";

export default function InterestForm({ interest }: { interest: Interest }) {
  const [state, action, pending] = useActionState(saveInterest, {
    message: "",
  });

  return (
    <div id="signup" className="relative z-2 scroll-mt-28">
      {state.saved ? (
        <p role="status" className="font-bold">
          Interest registered. We’ll email you about next steps.
        </p>
      ) : (
        <form
          action={action}
          aria-busy={pending}
          className="max-w-xl space-y-3"
        >
          <input type="hidden" name="interest" value={interest} />
          <div className="flex items-end gap-2 sm:gap-3">
            <label className="min-w-0 flex-1">
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className="block h-12 w-full border-2 border-ink bg-white p-2 text-ink"
              />
            </label>
            <Button
              type="submit"
              variant="primary"
              disabled={pending}
              className="h-12 shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
            >
              {pending ? "Saving…" : "Register interest →"}
            </Button>
          </div>
          <p className="text-sm">
            We’ll use your email to follow up about this opportunity.
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
