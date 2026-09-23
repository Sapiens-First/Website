"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";

type Interest = "membership" | "fellowship" | "start-a-circle";

type SignupFormProps = {
  interest: Interest;
  buttonText?: string;
  id?: string;
  inputId?: string;
  describedBy?: string;
  variant?: "row" | "dialog";
};

export default function SignupForm({
  interest,
  buttonText = "Keep me posted →",
  id,
  inputId,
  describedBy,
  variant = "row",
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
      <div className="signup-done" role="status" tabIndex={-1} ref={doneRef}>
        Thanks for your interest — we&apos;ll be in touch.
      </div>
    );
  }

  return (
    <>
      <form
        id={id}
        className={variant === "dialog" ? "sf sf--light" : "signup-row"}
        action="#"
        method="post"
        onSubmit={submit}
        aria-busy={status === "sending"}
      >
        <input
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
        <button
          className={variant === "dialog" ? undefined : "btn primary"}
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : buttonText}
        </button>
      </form>
      {status === "error" && (
        <div className="signup-status" role="status">
          We couldn&apos;t send your email. Please try again.
        </div>
      )}
    </>
  );
}
