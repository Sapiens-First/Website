"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Action";
import { startCheckout, confirmCheckout, manageBilling } from "./actions";
import { CONTRIBUTIONS, TRIAL_DAYS } from "@/lib/members/plans";

export function BillingManagement() {
  const [state, action, pending] = useActionState(manageBilling, {
    error: null,
  });
  return (
    <form action={action} className="mt-6 space-y-3">
      <Button type="submit" disabled={pending}>
        {pending ? "Opening billing…" : "Manage billing"}
      </Button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}

export function CheckoutConfirmation() {
  const [state, action, pending] = useActionState(confirmCheckout, {
    error: null,
  });
  return (
    <form action={action} className="mt-5 space-y-3">
      <p>
        Payment or trial confirmation is pending. Dashboard access opens only
        after confirmation.
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Checking…" : "Check confirmation"}
      </Button>
      {state.error && <p role="status">{state.error}</p>}
    </form>
  );
}

export default function CheckoutForm({ trialUsed }: { trialUsed: boolean }) {
  const [state, action, pending] = useActionState(startCheckout, {
    error: null,
  });
  const [amount, setAmount] = useState("1");
  const [payment, setPayment] = useState(trialUsed ? "pay" : "trial");
  return (
    <form action={action} className="mt-8 space-y-6">
      <fieldset disabled={pending}>
        <legend className="font-bold">
          Choose your monthly contribution (USD)
        </legend>
        <div className="mt-3 flex flex-wrap gap-4">
          {CONTRIBUTIONS.map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 border-2 border-ink bg-white px-5 py-4"
            >
              <input
                type="radio"
                name="contribution"
                value={value}
                checked={amount === value}
                onChange={() => setAmount(value)}
                required
              />
              ${value}/month
            </label>
          ))}
        </div>
        <p className="mt-3">Every amount includes the same full membership.</p>
      </fieldset>
      <fieldset disabled={pending} className="space-y-3">
        <legend className="mb-3 font-bold">When to start paying</legend>
        {!trialUsed && (
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="trial"
              checked={payment === "trial"}
              onChange={() => setPayment("trial")}
              required
            />
            Start my eligible {TRIAL_DAYS}-day trial
          </label>
        )}
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
            value="pay"
            checked={payment === "pay"}
            onChange={() => setPayment("pay")}
            required
          />
          Pay monthly now
        </label>
      </fieldset>
      <p className="max-w-xl leading-relaxed">
        {payment === "trial"
          ? `A payment method is required. Your ${TRIAL_DAYS}-day trial starts when you complete Checkout, followed by $${amount} USD per month automatically. Stripe shows the exact first charge date before you confirm.`
          : `You’ll pay $${amount} USD now, then automatically each month.`}{" "}
        Cancel renewal anytime in billing management. Access continues through
        your trial or paid period.
      </p>
      <p className="max-w-xl text-sm">
        We don’t offer routine partial-month refunds, except where required by
        law. Billing support:{" "}
        <a href="mailto:rohan@sapiensfirst.org" className="underline">
          rohan@sapiensfirst.org
        </a>
        .
      </p>
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Opening checkout…" : "Continue to Stripe →"}
      </Button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
