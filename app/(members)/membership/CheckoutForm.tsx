"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Action";
import { startCheckout } from "./actions";

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
          {["1", "10", "20"].map((value) => (
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
            Start my eligible 14-day trial
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
          ? `A payment method is required. Your 14-day trial starts when you complete Checkout, followed by $${amount} USD per month automatically. Stripe shows the exact first charge date before you confirm.`
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
