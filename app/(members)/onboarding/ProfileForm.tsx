"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
  action = saveProfile,
  children,
}: {
  initialValues: ProfileValues;
  countries: { code: string; name: string }[];
  submitLabel?: string;
  next?: string;
  action?: (
    previous: ProfileFormState,
    form: FormData,
  ) => Promise<ProfileFormState>;
  children?: ReactNode;
}) {
  const formId = useId();
  const initialState: ProfileFormState = {
    values: initialValues,
    errors: {},
    message: "",
  };
  const [state, formAction, pending] = useActionState(action, initialState);
  const [country, setCountry] = useState(initialValues.country_code || "");
  const summary = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.message) summary.current?.focus();
  }, [state]);
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
            className="mt-5 border-l-4 border-destructive p-3"
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
            };
            return (
              <div
                key={field}
                className={field === "address" ? "sm:col-span-2" : undefined}
              >
                <Label htmlFor={field}>
                  {definition.label}
                  {!required && (
                    <span className="ml-2 text-sm font-normal">(optional)</span>
                  )}
                </Label>
                {field === "country_code" ? (
                  <NativeSelect
                    {...props}
                    wrapperClassName="mt-2"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <NativeSelectOption key="placeholder" value="" disabled>
                      Choose your country
                    </NativeSelectOption>
                    {countries.map(({ code, name }) => (
                      <NativeSelectOption value={code} key={code}>
                        {name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                ) : (
                  <Input
                    {...props}
                    className="mt-2"
                    defaultValue={state.values[field]}
                    type={field === "phone" ? "tel" : "text"}
                    maxLength={definition.limit}
                  />
                )}
                {field === "phone" && (
                  <p
                    id="phone-help"
                    className="mt-2 text-sm text-muted-foreground"
                  >
                    Include your country code, for example +1 555 123 4567.
                  </p>
                )}
                {error && (
                  <p
                    id={`${field}-error`}
                    className="mt-2 text-sm font-semibold text-destructive"
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
