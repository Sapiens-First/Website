"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/Action";
import { saveProfile } from "@/app/(members)/actions";
import {
  profileFields,
  requiredProfileFields,
  type ProfileField,
  type ProfileFormState,
  type ProfileValues,
} from "@/lib/members/profile";

export default function ProfileForm({
  initialValues,
  countries,
  submitLabel = "Save and continue",
  next = "/dashboard",
  children,
}: {
  initialValues: ProfileValues;
  countries: { code: string; name: string }[];
  submitLabel?: string;
  next?: string;
  children?: ReactNode;
}) {
  const formId = useId();
  const initialState: ProfileFormState = {
    values: initialValues,
    errors: {},
    message: "",
  };
  const [state, formAction, pending] = useActionState(
    saveProfile,
    initialState,
  );
  const [country, setCountry] = useState(initialValues.country_code || "");
  const summary = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.message) summary.current?.focus();
  }, [state]);
  const inputClass =
    "mt-2 block w-full min-w-0 border-2 border-ink bg-white px-3 py-3 text-base text-ink focus:outline-2 focus:outline-offset-2 focus:outline-ink aria-invalid:border-red-700";
  return (
    <>
      <form
        id={formId}
        action={formAction}
        aria-busy={pending}
        className="mt-8"
      >
        <input type="hidden" name="next" value={next} />
        {state.message && (
          <p
            ref={summary}
            tabIndex={-1}
            role="alert"
            className="mt-5 border-l-4 border-red-700 p-3"
          >
            {state.message}
          </p>
        )}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {(Object.keys(profileFields) as ProfileField[]).map((field) => {
            const definition = profileFields[field];
            const error = state.errors[field];
            const required = requiredProfileFields.includes(field);
            const help = field === "phone" ? "phone-help" : undefined;
            const props = {
              id: field,
              name: field,
              autoComplete: definition.autoComplete,
              required,
              "aria-invalid": error ? (true as const) : undefined,
              "aria-describedby":
                [error && `${field}-error`, help].filter(Boolean).join(" ") ||
                undefined,
              className: inputClass,
            };
            return (
              <div
                key={field}
                className={field === "address" ? "sm:col-span-2" : undefined}
              >
                <label htmlFor={field} className="font-bold">
                  {definition.label}
                  {!required && (
                    <span className="ml-2 text-sm font-normal">(optional)</span>
                  )}
                </label>
                {field === "country_code" ? (
                  <select
                    {...props}
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <option key="placeholder" value="" disabled>
                      Choose your country
                    </option>
                    {countries.map(({ code, name }) => (
                      <option value={code} key={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...props}
                    defaultValue={state.values[field]}
                    type={field === "phone" ? "tel" : "text"}
                    maxLength={definition.limit}
                  />
                )}
                {field === "phone" && (
                  <p id="phone-help" className="mt-2 text-sm">
                    Include your country code.
                  </p>
                )}
                {error && (
                  <p
                    id={`${field}-error`}
                    className="mt-2 text-sm text-red-800"
                  >
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </form>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <Button
          form={formId}
          type="submit"
          variant="primary"
          disabled={pending}
        >
          {pending ? "Saving…" : submitLabel}
        </Button>
        {children}
      </div>
    </>
  );
}
