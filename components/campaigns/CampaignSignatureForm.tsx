"use client";
import { useActionState } from "react";
import { saveCampaignSignature } from "@/app/(public)/campaigns/actions";
import Link from "next/link";
import type { CampaignId } from "@/lib/campaigns";
import { Button } from "@/components/ui/Action";

export default function CampaignSignatureForm({
  campaignId,
  title,
  demand,
}: {
  campaignId: CampaignId;
  title: string;
  demand: string;
}) {
  const [state, action, sending] = useActionState(saveCampaignSignature, {
    message: "",
  });
  const signature = state.signed;
  return (
    <div
      id="sign"
      className="scroll-mt-24 border-2 border-ink bg-white p-5 text-ink shadow-[6px_6px_0_0_var(--color-ink)] sm:p-7"
    >
      <h2 className="mb-3 font-display text-3xl font-extrabold uppercase sm:text-4xl">
        {signature ? "You’ve signed this campaign ✓" : "Sign the open letter."}
      </h2>
      <p className="mb-5 leading-relaxed">{demand}</p>
      {campaignId === "citizens-dividend" && (
        <p className="mb-5 text-sm">
          Campaign proposal. No current payment is offered.
        </p>
      )}
      {signature ? (
        <div role="status">
          <h3 className="text-xl font-bold">Your support is recorded.</h3>
          <p className="mt-3 text-sm">
            For contact preferences or deletion requests, email{" "}
            <a className="underline" href="mailto:rohan@sapiensfirst.org">
              rohan@sapiensfirst.org
            </a>
            .
          </p>
        </div>
      ) : (
        <form action={action} aria-busy={sending}>
          <input type="hidden" name="campaignId" value={campaignId} />
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              Email address *
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className="block w-full border-2 border-ink p-2"
              />
            </label>
            {(
              [
                ["name", "Name", 120],
                ["zip", "ZIP / postal code", 20],
                ["phone", "Phone", 30],
              ] as const
            ).map(([field, label, maxLength]) => (
              <label key={field} className="block">
                {label}
                <input
                  name={field}
                  type={field === "phone" ? "tel" : "text"}
                  maxLength={maxLength}
                  className="block w-full border-2 border-ink p-2"
                />
              </label>
            ))}
          </div>
          <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed">
            <input
              className="mt-1 size-5 shrink-0 accent-ink"
              type="checkbox"
              name="agreed"
              required
            />
            <span>
              I support the {title} call above and agree to have my signature
              recorded by Sapiens First. *
            </span>
          </label>
          <label className="mt-3 flex min-h-11 items-start gap-3 text-sm leading-relaxed">
            <input
              className="mt-1 size-5 shrink-0 accent-ink"
              type="checkbox"
              name="updates"
            />
            <span>
              Email me updates and ways to take action for this campaign.
              (Optional)
            </span>
          </label>
          <Button
            className="mt-4 min-h-12 w-full"
            variant="primary"
            type="submit"
            disabled={sending}
          >
            {sending ? "Recording your signature…" : "Add my signature →"}
          </Button>
          <p className="mt-4 text-sm">
            Your signature and contact details are private supporter records. We
            won’t publish your name or send your details to officials through
            this form.{" "}
            <Link className="underline" href="/privacy">
              How we use your information
            </Link>
            .
          </p>
          {state.message && (
            <p className="mt-4 font-semibold" role="alert">
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
