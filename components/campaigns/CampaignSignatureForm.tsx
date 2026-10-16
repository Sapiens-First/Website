"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { campaigns, type CampaignId } from "@/lib/campaigns";
import { Button } from "@/components/ui/Action";

const field =
  "mt-2 block w-full rounded-none border-2 border-ink bg-white px-4 py-3 text-base text-ink focus:outline-2 focus:outline-offset-2 focus:outline-brand-blue";

export default function CampaignSignatureForm({
  campaignId,
}: {
  campaignId: CampaignId;
}) {
  const campaign = campaigns[campaignId];
  const prefix = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<{
    receiptId: string;
    updatesOptIn: boolean;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  useEffect(() => {
    if (status === "done" || status === "error")
      resultRef.current?.focus({ preventScroll: true });
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    sendingRef.current = true;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/campaign-signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          email: data.get("email"),
          name: data.get("name"),
          zip: data.get("zip"),
          phone: data.get("phone"),
          website: data.get("website"),
          agreed: data.get("agreed") === "on",
          updatesOptIn: data.get("updates") === "on",
        }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (
        !response.ok ||
        typeof result.receiptId !== "string" ||
        typeof result.updatesOptIn !== "boolean"
      )
        throw new Error(
          result.error ||
            "We couldn’t confirm your signature. Please try again; a retry won’t add a duplicate signature.",
        );
      setReceipt(result);
      setStatus("done");
    } catch (error) {
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "We couldn’t confirm your signature. Please try again; a retry won’t add a duplicate signature.",
      );
      setStatus("error");
    } finally {
      sendingRef.current = false;
    }
  }

  return (
    <div
      id="sign"
      className="scroll-mt-24 border-2 border-ink bg-paper p-6 text-ink sm:p-10"
    >
      <h2 className="mt-0 mb-4 font-display text-4xl leading-none font-extrabold uppercase sm:text-5xl">
        Sign the call.
      </h2>
      <p className="mb-6 max-w-2xl text-lg leading-relaxed font-medium">
        {campaign.demand}
      </p>
      {status === "done" && receipt ? (
        <div
          ref={resultRef}
          role="status"
          tabIndex={-1}
          className="border-t-2 border-ink pt-6 focus:outline-2 focus:outline-offset-4"
        >
          <h3 className="mb-3 font-display text-3xl font-extrabold uppercase">
            Your support is recorded.
          </h3>
          <p>Your signature and supporter-list entry are confirmed.</p>
          <p className="mt-3">
            {receipt.updatesOptIn
              ? "You chose to receive campaign emails."
              : "You have not opted in to campaign emails through this signature."}{" "}
            Signing again preserves your original choice.
          </p>
          <p className="mt-4 text-sm break-all">Receipt: {receipt.receiptId}</p>
          <p className="mt-4 text-sm">
            To change your contact preferences or request deletion, email{" "}
            <a className="underline" href="mailto:rohan@sapiensfirst.org">
              rohan@sapiensfirst.org
            </a>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={submit} aria-busy={status === "sending"}>
          <p className="mb-5 text-sm">
            Email is required. All other contact fields are optional.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="font-bold" htmlFor={`${prefix}-email`}>
              Email address (required)
              <input
                className={field}
                id={`${prefix}-email`}
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </label>
            <label className="font-bold" htmlFor={`${prefix}-name`}>
              Name (optional)
              <input
                className={field}
                id={`${prefix}-name`}
                name="name"
                autoComplete="name"
                maxLength={120}
              />
            </label>
            <label className="font-bold" htmlFor={`${prefix}-zip`}>
              ZIP code — US (optional)
              <input
                className={field}
                id={`${prefix}-zip`}
                name="zip"
                autoComplete="postal-code"
                inputMode="numeric"
                pattern="[0-9]{5}(-[0-9]{4})?"
                maxLength={10}
                title="A five-digit US ZIP code, optionally followed by a four-digit extension"
              />
            </label>
            <label className="font-bold" htmlFor={`${prefix}-phone`}>
              Phone number (optional)
              <input
                className={field}
                id={`${prefix}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={30}
              />
            </label>
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${prefix}-website`}>
              Leave this empty
              <input
                id={`${prefix}-website`}
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <label className="mt-6 flex items-start gap-3 text-base leading-relaxed">
            <input
              className="mt-1 size-5 shrink-0 accent-ink"
              type="checkbox"
              name="agreed"
              required
            />
            <span>
              I support the {campaign.title} call above and agree to have my
              signature recorded in Sapiens First’s Supporter List.
            </span>
          </label>
          <label className="mt-4 flex items-start gap-3 text-base leading-relaxed">
            <input
              className="mt-1 size-5 shrink-0 accent-ink"
              type="checkbox"
              name="updates"
            />
            <span>
              Email me campaign updates and ways to take action. (Optional)
            </span>
          </label>
          <p className="mt-5 text-sm leading-relaxed">
            Your signature and contact details are kept in our private supporter
            records. We won’t publish your name or send your details to
            officials through this form. Providing a phone number does not opt
            you in to texts or calls.{" "}
            <Link className="underline" href="/privacy">
              How we use your information
            </Link>
            .
          </p>
          <Button
            className="mt-6 w-full cursor-pointer sm:w-auto"
            variant="primary"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "Recording your signature…"
              : "Add my signature →"}
          </Button>
          {status === "error" && (
            <div
              ref={resultRef}
              tabIndex={-1}
              role="alert"
              className="mt-5 border-l-4 border-coral-dark pl-4 text-base font-semibold focus:outline-2 focus:outline-offset-4"
            >
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
