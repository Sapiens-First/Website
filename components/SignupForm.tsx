"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Action";
import { cn } from "@/lib/cn";

type Interest = "membership" | "fellowship" | "start-a-circle";

type SignupFormProps = {
  interest: Interest;
  buttonText?: string;
  id?: string;
  inputId?: string;
  describedBy?: string;
  buttonClassName?: string;
  className?: string;
};

export default function SignupForm({
  interest,
  buttonText = "Keep me posted →",
  id,
  inputId,
  describedBy,
  buttonClassName,
  className,
}: SignupFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const doneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "done") doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  useEffect(() => {
    if (id !== "signup") return;
    const focus = () => {
      if (window.location.hash === "#signup") inputRef.current?.focus();
    };
    window.addEventListener("hashchange", focus);
    focus();
    return () => window.removeEventListener("hashchange", focus);
  }, [id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const email = inputRef.current?.value.trim();
    if (!email || !inputRef.current?.reportValidity()) return;
    setStatus("sending");
    try {
      await fetch(site.signupScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ email, interest }),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className="block px-0 py-3.5 font-body text-sm font-black tracking-wider text-coral-dark uppercase"
        role="status"
        tabIndex={-1}
        ref={doneRef}
      >
        Thanks for your interest — we&apos;ll be in touch.
      </div>
    );
  }

  return (
    <>
      <form
        id={id}
        className={cn(
          "flex w-full max-w-xl items-stretch gap-2 max-sm:flex-col",
          id === "signup" && "scroll-mt-28",
          className,
        )}
        action="#"
        method="post"
        onSubmit={submit}
        aria-busy={status === "sending"}
      >
        <input
          className="min-w-0 flex-1 rounded-none border-2 border-ink bg-white px-4 py-3 font-body text-base leading-tight font-medium text-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand-yellow"
          ref={inputRef}
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email address"
          aria-label="Email address"
          aria-describedby={describedBy}
          required
        />
        <Button
          variant="primary"
          type="submit"
          className={cn("cursor-pointer max-sm:w-full", buttonClassName)}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : buttonText}
        </Button>
      </form>
      {status === "error" && (
        <div className="mt-3 text-base" role="status">
          We couldn&apos;t send your email. Please try again.
        </div>
      )}
    </>
  );
}
