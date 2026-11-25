"use client";

import { useActionState } from "react";
import { acceptAgreement } from "@/app/(members)/agreement/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AGREEMENT_VERSION,
  commitments,
  RED_LINES_URL,
  REPORT_EMAIL,
  VALUES_URL,
} from "@/lib/members/agreement";

type Action = (
  previous: { error: string | null },
  form: FormData,
) => Promise<{ error: string | null }>;

export function AgreementForm({
  next,
  action = acceptAgreement,
}: {
  next: string;
  action?: Action;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  return (
    <form action={formAction} className="mt-10">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="version" value={AGREEMENT_VERSION} />
      <h2 className="font-display text-2xl font-extrabold uppercase">
        As a member of Sapiens First, I agree to:
      </h2>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {commitments.map(({ title, body }, index) => (
          <li
            key={title}
            className="flex gap-4 border-2 border-ink bg-white p-4 sm:p-5"
          >
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-coral font-display text-lg font-extrabold"
            >
              {index + 1}
            </span>
            <p className="leading-snug">
              <strong className="block font-display text-xl font-extrabold uppercase">
                {title}
              </strong>
              <span className="mt-1 block">{body}</span>
            </p>
          </li>
        ))}
      </ol>
      <aside className="mt-5 border-l-4 border-ink bg-soft p-4 text-sm leading-relaxed sm:p-5">
        I understand that if I cross these lines I may be asked to leave an
        event, step down from a role, or stop acting in Sapiens First’s name.
        Concerns can be reported to{" "}
        <a href={`mailto:${REPORT_EMAIL}`} className="font-bold underline">
          {REPORT_EMAIL}
        </a>
        .
      </aside>
      <p className="mt-4 text-sm">
        Read more in our handbook:{" "}
        <a
          href={VALUES_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          core values
        </a>{" "}
        and{" "}
        <a
          href={RED_LINES_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          red lines
        </a>
        .
      </p>
      <label className="mt-8 flex cursor-pointer items-start gap-4 border-2 border-ink bg-white p-4 has-checked:bg-brand-yellow sm:p-5">
        <Checkbox
          name="agree"
          value="yes"
          required
          disabled={pending}
          aria-describedby={state.error ? "agreement-error" : undefined}
          className="mt-0.5 size-6"
        />
        <span className="leading-snug font-bold">
          I agree to the Sapiens First member agreement.
        </span>
      </label>
      {state.error && (
        <p
          id="agreement-error"
          role="alert"
          className="mt-3 font-semibold text-destructive"
        >
          {state.error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={pending}
        className="mt-6 min-h-14 px-8 text-base"
      >
        {pending ? "Saving…" : "Agree and continue →"}
      </Button>
    </form>
  );
}
