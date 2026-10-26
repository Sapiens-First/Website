"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Action";
import { saveInterest } from "@/app/(members)/actions";
import { interests, type Interest } from "@/lib/members/interests";

export default function InterestForm({ interest }: { interest: Interest }) {
  const [state, action, pending] = useActionState(saveInterest, {
    message: "",
  });
  return (
    <form
      action={action}
      aria-busy={pending}
      className="max-w-xl space-y-4 border-2 border-ink bg-white p-5 text-ink"
    >
      <input type="hidden" name="interest" value={interest} />
      <p className="font-bold">
        Confirm your interest in {interests[interest].label.toLowerCase()}.
      </p>
      <p className="text-sm leading-relaxed">
        We’ll use your member profile to contact you about this opportunity.
        This isn’t a commitment or a newsletter subscription.
      </p>
      <input type="hidden" name="confirmed" value="yes" />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Confirm my interest →"}
        </Button>
        <Link
          href={interests[interest].path}
          className="text-sm underline underline-offset-4"
        >
          Cancel
        </Link>
      </div>
      {state.message && (
        <p role="alert" className="border-l-4 border-coral-dark pl-3 text-sm">
          {state.message}
        </p>
      )}
    </form>
  );
}
