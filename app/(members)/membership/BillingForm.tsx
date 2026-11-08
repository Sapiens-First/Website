"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/Action";
import { manageBilling } from "./actions";

export default function BillingForm({
  editable,
  canceling,
  pendingChange,
  currentAmount,
}: {
  editable: boolean;
  canceling: boolean;
  pendingChange: boolean;
  currentAmount: string | null;
}) {
  const [state, action, pending] = useActionState(manageBilling, {
    error: null,
  });
  return (
    <form action={action} className="mt-6 space-y-5">
      <fieldset disabled={pending} className="space-y-5">
        <Button type="submit" name="operation" value="portal">
          Payment methods &amp; invoices
        </Button>
        {editable && (
          <>
            {!canceling && (
              <div className="flex flex-wrap items-end gap-3">
                <label className="grid gap-2 font-bold">
                  Monthly contribution (USD)
                  <select
                    name="amount"
                    defaultValue={currentAmount ?? "1"}
                    className="border-2 border-ink bg-white p-3"
                  >
                    {["1", "10", "20"].map((value) => (
                      <option key={value} value={value}>
                        ${value}/month
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit" name="operation" value="change">
                  Change at next renewal
                </Button>
              </div>
            )}
            {pendingChange && (
              <Button type="submit" name="operation" value="cancel-change">
                Keep current contribution
              </Button>
            )}
            <div>
              <Button
                type="submit"
                name="operation"
                value={canceling ? "resume" : "cancel-renewal"}
              >
                {canceling ? "Resume renewal" : "Cancel renewal"}
              </Button>
            </div>
            <p className="text-sm">
              Contribution changes begin at renewal with no mid-period charges
              or credits. Canceling renewal removes any pending contribution
              change and preserves access through your current trial or paid
              period.
            </p>
          </>
        )}
      </fieldset>
      {pending && <p role="status">Updating billing…</p>}
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
