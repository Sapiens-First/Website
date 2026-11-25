"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  startCheckout,
  confirmCheckout,
  manageBilling,
  checkMembershipAccess,
} from "./actions";
import {
  CONTRIBUTIONS,
  DEFAULT_CONTRIBUTION,
  TRIAL_DAYS,
  type Contribution,
} from "@/lib/members/plans";

type FormAction = (
  previous: { error: string | null },
  form: FormData,
) => Promise<{ error: string | null }>;

export function BillingManagement() {
  const [state, action, pending] = useActionState(manageBilling, {
    error: null,
  });
  return (
    <form action={action} className="mt-6 space-y-3">
      <Button type="submit" disabled={pending}>
        {pending ? "Opening…" : "Manage payments"}
      </Button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}

const POLL_MS = 3000;
const POLL_ATTEMPTS = 10;

/**
 * Shown after Stripe returns. Confirms once automatically, then polls the
 * cheap access check while the webhook lands. The manual button appears only
 * if confirmation is still pending after about 30 seconds.
 */
export function CheckoutConfirmation({
  confirm = confirmCheckout,
  poll = checkMembershipAccess,
  destination = "/dashboard?membership=confirmed",
}: {
  confirm?: () => Promise<{ error: string | null }>;
  poll?: () => Promise<{ allowed: boolean }>;
  destination?: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"checking" | "slow">("checking");
  const [state, action, pending] = useActionState(() => confirm(), {
    error: null,
  });
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const attempt = async (count: number) => {
      if (cancelled) return;
      const { allowed } = await poll().catch(() => ({ allowed: false }));
      if (cancelled) return;
      if (allowed) return router.replace(destination);
      if (count >= POLL_ATTEMPTS) return setPhase("slow");
      timer = setTimeout(() => attempt(count + 1), POLL_MS);
    };
    // One active reconciliation with Stripe, then lightweight polling. A
    // successful confirmation redirects on its own.
    startTransition(async () => {
      await confirm().catch(() => null);
      timer = setTimeout(() => attempt(1), POLL_MS);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [confirm, poll, router, destination]);

  return (
    <section
      aria-live="polite"
      className="mt-8 border-2 border-ink bg-white p-6 sm:p-8"
    >
      {phase === "checking" ? (
        <div className="flex items-center gap-5">
          <span
            aria-hidden="true"
            className="size-10 shrink-0 animate-spin border-4 border-ink border-t-coral motion-reduce:animate-none"
          />
          <div>
            <p className="font-display text-3xl font-extrabold uppercase">
              Confirming your membership…
            </p>
            <p className="mt-1">
              This usually takes a few seconds. Please keep this page open.
            </p>
          </div>
        </div>
      ) : (
        <form action={action} className="space-y-4">
          <p className="font-display text-3xl font-extrabold uppercase">
            Still confirming.
          </p>
          <p className="max-w-xl leading-relaxed">
            Your payment hasn’t come through yet. This can take a minute. You
            won’t be charged twice.
          </p>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Checking…" : "Check again"}
          </Button>
          {state.error && <p role="status">{state.error}</p>}
          <p className="text-sm">
            Still stuck? Email{" "}
            <a href="mailto:ops@sapiensfirst.org" className="underline">
              ops@sapiensfirst.org
            </a>
            .
          </p>
        </form>
      )}
    </section>
  );
}

export default function CheckoutForm({
  trialUsed,
  action = startCheckout,
}: {
  trialUsed: boolean;
  action?: FormAction;
}) {
  const [state, formAction, pending] = useActionState(action, {
    error: null,
  });
  const [amount, setAmount] = useState<Contribution>(DEFAULT_CONTRIBUTION);
  const [payment, setPayment] = useState<"trial" | "pay">(
    trialUsed ? "pay" : "trial",
  );
  return (
    <form action={formAction} className="mt-10 space-y-8">
      <input type="hidden" name="payment" value={payment} />
      <fieldset disabled={pending}>
        <legend className="font-display text-2xl font-extrabold uppercase">
          Your monthly contribution
        </legend>
        <p className="mt-1 text-muted-foreground">
          Every amount includes the same full membership.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
          {CONTRIBUTIONS.map((value) => (
            <label
              key={value}
              className="relative flex cursor-pointer flex-col items-center border-2 border-ink bg-white px-2 pt-6 pb-5 text-center transition-transform has-checked:bg-coral has-checked:shadow-[4px_4px_0_var(--color-ink)] has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ink motion-safe:hover:-translate-y-0.5"
            >
              {value === DEFAULT_CONTRIBUTION && (
                <span className="absolute -top-3 bg-brand-yellow px-2 py-0.5 text-[0.65rem] font-black tracking-widest whitespace-nowrap uppercase">
                  Suggested
                </span>
              )}
              <input
                type="radio"
                name="contribution"
                value={value}
                checked={amount === value}
                onChange={() => setAmount(value)}
                required
                className="sr-only"
              />
              <span className="font-display text-5xl font-extrabold sm:text-6xl">
                ${value}
              </span>
              <span className="text-xs font-bold tracking-wider uppercase">
                per month
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <section
        aria-label="Summary"
        className="border-2 border-ink bg-soft p-5 sm:p-6"
      >
        {payment === "trial" ? (
          <>
            <p className="font-display text-3xl font-extrabold uppercase">
              Free for {TRIAL_DAYS} days.
            </p>
            <p className="mt-2 leading-relaxed">
              Then ${amount} USD a month. You’ll add a card on the next page,
              where you’ll see the date of your first payment. Cancel before
              then and you won’t pay anything.
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-3xl font-extrabold uppercase">
              ${amount} today.
            </p>
            <p className="mt-2 leading-relaxed">
              Then ${amount} USD each month. Cancel anytime and you’ll keep your
              membership until the end of the month you paid for.
            </p>
          </>
        )}
        {!trialUsed && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setPayment(payment === "trial" ? "pay" : "trial")}
            className="mt-4 text-sm font-bold underline underline-offset-4"
          >
            {payment === "trial"
              ? "Skip the trial and start paying today"
              : `Start with the free ${TRIAL_DAYS}-day trial instead`}
          </button>
        )}
      </section>

      <div className="space-y-3">
        <Button
          type="submit"
          variant="primary"
          disabled={pending}
          className="min-h-14 px-8 text-base"
        >
          {pending
            ? "Opening payment page…"
            : payment === "trial"
              ? "Start my free trial →"
              : "Continue to payment →"}
        </Button>
        {state.error && <p role="alert">{state.error}</p>}
        <p className="max-w-xl text-sm text-muted-foreground">
          Payments are processed securely by Stripe. We don’t refund part-months
          unless the law requires it. Questions about billing? Email{" "}
          <a href="mailto:ops@sapiensfirst.org" className="text-ink underline">
            ops@sapiensfirst.org
          </a>
          .
        </p>
      </div>
    </form>
  );
}
