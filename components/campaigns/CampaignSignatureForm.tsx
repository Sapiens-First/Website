"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { campaigns, type CampaignId } from "@/lib/campaigns";
import type { getCampaignSignatureState } from "@/lib/campaign-signatures";
import { Button } from "@/components/ui/Action";

export default function CampaignSignatureForm({
  campaignId,
  access,
}: {
  campaignId: CampaignId;
  access: Awaited<ReturnType<typeof getCampaignSignatureState>>;
}) {
  const router = useRouter();
  const [signature, setSignature] = useState(
    access.state === "member" ? access.signature : null,
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const next = `/campaigns/${campaignId}#sign`;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/campaign-signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          agreed: data.get("agreed") === "on",
          updatesOptIn: data.get("updates") === "on",
        }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Your signature could not be confirmed.",
        );
      if (
        typeof result.signed_at !== "string" ||
        typeof result.email_updates !== "boolean"
      )
        throw new Error("Your signature could not be confirmed.");
      setSignature(result);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "We couldn’t confirm your signature. Please retry; a retry won’t add a duplicate.",
      );
    } finally {
      setSending(false);
    }
  }
  return (
    <div
      id="sign"
      className="scroll-mt-24 border-2 border-ink bg-white p-5 text-ink shadow-[6px_6px_0_0_var(--color-ink)] sm:p-7"
    >
      <h2 className="mb-3 font-display text-3xl font-extrabold uppercase sm:text-4xl">
        {signature ? "You’ve signed this campaign ✓" : "Sign the open letter."}
      </h2>
      <p className="mb-5 leading-relaxed">{campaigns[campaignId].demand}</p>
      {campaignId === "citizens-dividend" && (
        <p className="mb-5 text-sm">
          Campaign proposal. No current payment is offered.
        </p>
      )}
      {signature ? (
        <div role="status">
          <h3 className="text-xl font-bold">Your support is recorded.</h3>
          <p className="mt-3">
            {signature.email_updates
              ? "You chose to receive updates for this campaign."
              : "You have not opted in to emails for this campaign."}
          </p>
          <p className="mt-3 text-sm">
            For contact preferences or deletion requests, email{" "}
            <a className="underline" href="mailto:rohan@sapiensfirst.org">
              rohan@sapiensfirst.org
            </a>
            .
          </p>
        </div>
      ) : access.state === "unavailable" ? (
        <p role="status">
          Signing is temporarily unavailable. Please refresh and try again.
        </p>
      ) : access.state !== "member" ? (
        <>
          <p className="mb-4">
            Sign in as a member to add your support. You’ll return here to
            confirm your signature.
          </p>
          <Link
            className="inline-block border-2 border-ink bg-brand-blue px-5 py-3 font-bold text-white"
            href={`${access.state === "incomplete" ? "/onboarding" : "/join"}?next=${encodeURIComponent(next)}`}
          >
            {access.state === "incomplete"
              ? "Complete your profile to sign →"
              : "Join or sign in to sign →"}
          </Link>
        </>
      ) : (
        <form onSubmit={submit} aria-busy={sending}>
          <p className="mb-4 break-words">
            Signing with <strong>{access.email}</strong>
          </p>
          <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed">
            <input
              className="mt-1 size-5 shrink-0 accent-ink"
              type="checkbox"
              name="agreed"
              required
            />
            <span>
              I support the {campaigns[campaignId].title} call above and agree
              to have my signature recorded by Sapiens First.
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
            Your signature and account email are private supporter records. We
            won’t publish your name or send your details to officials through
            this form.{" "}
            <Link className="underline" href="/privacy">
              How we use your information
            </Link>
            .
          </p>
          {error && (
            <p className="mt-4 font-semibold" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
