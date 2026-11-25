"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { recordGovernorEmail } from "@/app/(public)/no-tech-kings/act/actions";
import { NtkShare } from "@/components/no-tech-kings/NtkShare";
import {
  actCopy,
  assemble,
  composeLink,
  governor,
  maxBody,
  maxStory,
  ownTemplate,
  pickStyle,
  randomStoryExample,
  signature,
  subjectFor,
  writeTemplate,
  type EmailStyle,
  type MailApp,
  type Sender,
} from "@/lib/no-tech-kings/act";
import ntk from "../ntk.module.css";
import styles from "./act.module.css";

type Step = 1 | 2 | 3;
type Mode = "help" | "own";

const saveKey = "ntk-email-newsom-v1";
const saveFor = 6 * 60 * 60 * 1000;

const apps: { value: MailApp; label: string }[] = [
  { value: "gmail", label: "Gmail" },
  { value: "outlook", label: "Outlook" },
  { value: "mailto", label: "Other email app" },
];

type Saved = {
  at: number;
  step: Step;
  sender: Sender | null;
  updates: boolean;
  style: EmailStyle;
  mode: Mode;
  story: string;
  subject: string;
  body: string;
  generated: string;
  template: string;
  sent: boolean;
};

function detectPhone() {
  const nav = navigator as Navigator & { userAgentData?: { mobile?: boolean } };
  if (nav.userAgentData?.mobile) return true;
  const ua = navigator.userAgent || "";
  if (
    /Android|iPhone|iPad|iPod|IEMobile|Windows Phone|Opera Mini|Mobile/i.test(
      ua,
    )
  )
    return true;
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPadOS reports as a Mac
}

const noSubscribe = () => () => {};
let exampleCache = "";
function getExample() {
  if (!exampleCache) exampleCache = randomStoryExample();
  return exampleCache;
}

/**
 * The email flow: your details → your email → send it.
 * Sending opens the visitor's own email app with the message filled in, and
 * records the send (plus their updates choice) in Supabase.
 * Progress is kept in localStorage so a phone that reloads the page after
 * the email app opens doesn't lose the draft.
 */
export function EmailGovernor() {
  const id = useId();
  const [step, setStep] = useState<Step>(1);
  const [reached, setReached] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [updates, setUpdates] = useState(true);
  const [sender, setSender] = useState<Sender | null>(null);
  const [error, setError] = useState<{ field: string; message: string } | null>(
    null,
  );

  const [style, setStyle] = useState<EmailStyle | null>(null);
  const [mode, setMode] = useState<Mode>("help");
  const [story, setStory] = useState("");
  const example = useSyncExternalStore(noSubscribe, getExample, () => "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [generated, setGenerated] = useState("");
  const [template, setTemplate] = useState("");
  const [bodyError, setBodyError] = useState("");

  const [app, setApp] = useState<MailApp>("gmail");
  const isPhone = useSyncExternalStore(noSubscribe, detectPhone, () => false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState("");
  const [restored, setRestored] = useState(false);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const cursorRef = useRef<number | null>(null);
  const recordedRef = useRef<string>("");

  // Restore saved progress (or pick this visitor's wording) once mounted.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let saved: Saved | null = null;
      try {
        saved = JSON.parse(localStorage.getItem(saveKey) || "null");
      } catch {
        saved = null;
      }
      if (saved && saved.sender && Date.now() - saved.at < saveFor) {
        setName(saved.sender.name);
        setEmail(saved.sender.email);
        setZip(saved.sender.zip);
        setSender(saved.sender);
        setUpdates(saved.updates);
        setStyle(saved.style);
        setMode(saved.mode);
        setStory(saved.story);
        setSubject(saved.subject);
        setBody(saved.body);
        setGenerated(saved.generated);
        setTemplate(saved.template);
        setSent(saved.sent);
        setStep(saved.step);
        setReached(saved.sent ? 3 : saved.step);
      } else {
        setStyle(pickStyle());
      }
      setRestored(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!restored || !sender || !style) return;
    try {
      const data: Saved = {
        at: Date.now(),
        step,
        sender,
        updates,
        style,
        mode,
        story,
        subject,
        body,
        generated,
        template,
        sent,
      };
      localStorage.setItem(saveKey, JSON.stringify(data));
    } catch {
      // Private browsing can refuse storage; the page still works.
    }
  }, [
    restored,
    step,
    sender,
    updates,
    style,
    mode,
    story,
    subject,
    body,
    generated,
    template,
    sent,
  ]);

  // Put the cursor where "I'll write it myself" leaves space to write.
  useEffect(() => {
    const at = cursorRef.current;
    if (at === null || !bodyRef.current) return;
    cursorRef.current = null;
    bodyRef.current.focus({ preventScroll: true });
    bodyRef.current.setSelectionRange(at, at);
  }, [body]);

  function goTo(next: Step) {
    setStep(next);
    setReached((r) => (next > r ? next : r));
    requestAnimationFrame(() => {
      const el = stepRefs.current[next - 1];
      if (!el) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      el.querySelector<HTMLElement>("[data-step-title]")?.focus({
        preventScroll: true,
      });
    });
  }

  function submitDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const n = name.trim().replace(/\s+/g, " ");
    const e = email.trim();
    const z = zip.trim().slice(0, 5);
    if (!n) return setError({ field: "name", message: "Enter your name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      return setError({ field: "email", message: "Enter your email address." });
    if (!/^\d{5}$/.test(z))
      return setError({
        field: "zip",
        message: "Enter your 5-digit ZIP code.",
      });
    setError(null);
    const next = { name: n, email: e, zip: z };
    // Keep anything already written; only the signature follows new details.
    if (sender && style) {
      const before = signature(style, sender);
      const after = signature(style, next);
      setBody((b) => b.replace(before, after));
      setGenerated((g) => g.replace(before, after));
      setTemplate((t) => t.replace(before, after));
    }
    setSender(next);
    goTo(2);
  }

  function chooseMode(next: Mode) {
    setMode(next);
    setBodyError("");
    if (!sender || !style) return;
    if (next === "own" && (!body.trim() || body === generated)) {
      const own = ownTemplate(style, sender);
      setTemplate(own.text);
      setSubject((s) => s || subjectFor(style));
      cursorRef.current = own.cursor;
      setBody(own.text);
    } else if (next === "help" && body === template) {
      setBody("");
    }
  }

  function writeForMe() {
    if (!sender || !style) return;
    if (
      body.trim() &&
      body !== generated &&
      body !== template &&
      !window.confirm(
        "This replaces your email, including your edits. Write a new one?",
      )
    )
      return;
    const text = assemble(
      writeTemplate(story.slice(0, maxStory), sender.zip),
      style,
      sender,
    );
    setSubject((s) => s || subjectFor(style));
    setBody(text);
    setGenerated(text);
    setBodyError("");
  }

  function continueToSend() {
    if (!body.trim()) {
      setBodyError(
        mode === "help"
          ? "Write your email first."
          : "Add a few words to your email.",
      );
      return;
    }
    if (body.length > maxBody) {
      setBodyError(
        `Shorten your email to ${maxBody.toLocaleString()} characters or fewer so it fits in your email app (now ${body.length.toLocaleString()}).`,
      );
      return;
    }
    setBodyError("");
    goTo(3);
  }

  const mailApp: MailApp = isPhone ? "mailto" : app;
  const sendHref = composeLink(
    mailApp,
    subject.trim(),
    body.replace(/\r\n/g, "\n"),
  );

  function onSend() {
    setSent(true);
    if (!sender) return;
    const key = `${sender.email}|${updates}`;
    if (recordedRef.current === key) return;
    recordedRef.current = key;
    void recordGovernorEmail({ ...sender, updates }).catch(() => {
      recordedRef.current = "";
    });
  }

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(""), 2400);
    } catch {
      window.prompt("Copy this:", text);
    }
  }

  function startOver() {
    try {
      localStorage.removeItem(saveKey);
    } catch {
      // ignore
    }
    setSent(false);
    setBody("");
    setGenerated("");
    setTemplate("");
    setSubject("");
    setStory("");
    setMode("help");
    setStyle(pickStyle());
    setReached(1);
    recordedRef.current = "";
    goTo(1);
  }

  const showCompose = body.trim() !== "" || mode === "own";
  const fieldProps = (field: string) => ({
    "aria-invalid": error?.field === field ? true : undefined,
    "aria-describedby": error?.field === field ? `${id}-error` : undefined,
  });

  return (
    <div className={styles.flow}>
      {/* ---------- 1. details ---------- */}
      <StepPanel
        n={1}
        title="Your details"
        state={step === 1 ? "open" : "done"}
        summary={
          sender ? `${sender.name} · ${sender.email} · ${sender.zip}` : ""
        }
        onEdit={() => goTo(1)}
        panelRef={(el) => {
          stepRefs.current[0] = el;
        }}
      >
        <form onSubmit={submitDetails} noValidate className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor={`${id}-name`}>Name</label>
            <input
              id={`${id}-name`}
              className={ntk.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={100}
              required
              {...fieldProps("name")}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-email`}>Email</label>
            <input
              id={`${id}-email`}
              className={ntk.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={254}
              required
              {...fieldProps("email")}
            />
          </div>
          <div className={`${styles.field} ${styles.zipField}`}>
            <label htmlFor={`${id}-zip`}>ZIP code</label>
            <input
              id={`${id}-zip`}
              className={ntk.input}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={10}
              required
              {...fieldProps("zip")}
            />
          </div>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={updates}
              onChange={(e) => setUpdates(e.target.checked)}
            />
            <span>Keep me posted about No Tech Kings and Sapiens First.</span>
          </label>
          <p className={styles.privacy}>
            We save your details to count the emails sent to the Governor.{" "}
            <Link href="/privacy">Privacy</Link>
          </p>
          {error ? (
            <p id={`${id}-error`} role="alert" className={styles.error}>
              {error.message}
            </p>
          ) : null}
          <div className={styles.actions}>
            <button type="submit" className={ntk.button}>
              Continue →
            </button>
          </div>
        </form>
      </StepPanel>

      {/* ---------- 2. the email ---------- */}
      <StepPanel
        n={2}
        title="Your email"
        state={step === 2 ? "open" : reached >= 2 ? "done" : "locked"}
        summary={subject ? `“${subject}”` : ""}
        onEdit={() => goTo(2)}
        panelRef={(el) => {
          stepRefs.current[1] = el;
        }}
      >
        <fieldset className={styles.modes}>
          <legend className={ntk.srOnly}>How do you want to write it?</legend>
          {(
            [
              ["help", "Help me write it"],
              ["own", "I’ll write it myself"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={styles.mode}>
              <input
                type="radio"
                name={`${id}-mode`}
                value={value}
                checked={mode === value}
                onChange={() => chooseMode(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        {mode === "help" ? (
          <div className={styles.story}>
            <label htmlFor={`${id}-story`}>
              Why does this matter to you?{" "}
              <span className={styles.optional}>
                Optional, but it makes your email count.
              </span>
            </label>
            <textarea
              id={`${id}-story`}
              className={styles.textarea}
              rows={3}
              maxLength={maxStory}
              value={story}
              placeholder={example}
              onChange={(e) => setStory(e.target.value)}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={body.trim() ? styles.ghost : ntk.button}
                onClick={writeForMe}
              >
                {body.trim() ? "Write a different draft" : "Write my email →"}
              </button>
            </div>
          </div>
        ) : null}

        {showCompose ? (
          <div className={styles.compose}>
            <div className={styles.field}>
              <label htmlFor={`${id}-subject`}>Subject</label>
              <input
                id={`${id}-subject`}
                className={ntk.input}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={150}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor={`${id}-body`}>Message</label>
              <textarea
                id={`${id}-body`}
                ref={bodyRef}
                className={`${styles.textarea} ${styles.letter}`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                aria-describedby={bodyError ? `${id}-body-error` : undefined}
              />
              <p className={styles.hint}>
                {mode === "help"
                  ? "Edit anything. Emails in your own words carry the most weight."
                  : "Write in the space after the greeting. The request and your signature are already in."}
              </p>
            </div>
          </div>
        ) : null}

        {bodyError ? (
          <p id={`${id}-body-error`} role="alert" className={styles.error}>
            {bodyError}
          </p>
        ) : null}
        {showCompose && body.trim() ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={ntk.button}
              onClick={continueToSend}
            >
              Continue →
            </button>
          </div>
        ) : null}
      </StepPanel>

      {/* ---------- 3. send ---------- */}
      <StepPanel
        n={3}
        title="Send it"
        state={step === 3 ? "open" : reached >= 3 ? "done" : "locked"}
        summary={sent ? "Opened in your email app" : ""}
        onEdit={() => goTo(3)}
        panelRef={(el) => {
          stepRefs.current[2] = el;
        }}
      >
        {!isPhone ? (
          <fieldset className={styles.modes}>
            <legend className={styles.legend}>Open in</legend>
            {apps.map((a) => (
              <label key={a.value} className={styles.mode}>
                <input
                  type="radio"
                  name={`${id}-app`}
                  value={a.value}
                  checked={app === a.value}
                  onChange={() => setApp(a.value)}
                />
                <span>{a.label}</span>
              </label>
            ))}
          </fieldset>
        ) : null}

        <a
          href={sendHref}
          onClick={onSend}
          className={`${ntk.cta} ${styles.send}`}
          {...(mailApp === "mailto"
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
        >
          Email Governor {governor.lastName} ↗
          {mailApp === "mailto" ? null : (
            <span className={ntk.srOnly}> (opens in a new tab)</span>
          )}
        </a>
        <p className={styles.hint}>
          Your email opens ready to go, from your own inbox. Just press send.
        </p>

        <details className={styles.manual}>
          <summary>Didn’t open? Copy it instead.</summary>
          <div className={styles.copyRow}>
            <code>{governor.email}</code>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => {
                onSend();
                void copy(governor.email, "address");
              }}
            >
              {copied === "address" ? "Copied" : "Copy address"}
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => void copy(subject, "subject")}
            >
              {copied === "subject" ? "Copied" : "Copy subject"}
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => void copy(body, "message")}
            >
              {copied === "message" ? "Copied" : "Copy message"}
            </button>
          </div>
        </details>
      </StepPanel>

      {/* ---------- done ---------- */}
      {sent ? (
        <section className={styles.done} aria-live="polite">
          <h3 className={ntk.cardTitle}>{actCopy.doneTitle}</h3>
          <p>{actCopy.doneBody}</p>
          <div className={styles.doneLinks}>
            <Link href="/no-tech-kings#involved" className={ntk.cta}>
              Get involved →
            </Link>
            <NtkShare />
          </div>
          <button
            type="button"
            className={styles.textButton}
            onClick={startOver}
          >
            Write another email
          </button>
        </section>
      ) : null}
    </div>
  );
}

function StepPanel({
  n,
  title,
  state,
  summary,
  onEdit,
  panelRef,
  children,
}: {
  n: number;
  title: string;
  state: "open" | "done" | "locked";
  summary?: string;
  onEdit?: () => void;
  panelRef: (el: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <section
      ref={panelRef}
      className={styles.step}
      data-state={state}
      aria-labelledby={`step-${n}-title`}
    >
      <div className={styles.stepHead}>
        <span className={styles.num} aria-hidden="true">
          {state === "done" ? "✓" : n}
        </span>
        <h3
          id={`step-${n}-title`}
          className={styles.stepTitle}
          tabIndex={-1}
          data-step-title
        >
          <span className={ntk.srOnly}>Step {n}: </span>
          {title}
        </h3>
        {state === "done" && onEdit ? (
          <button type="button" className={styles.textButton} onClick={onEdit}>
            Edit<span className={ntk.srOnly}> {title.toLowerCase()}</span>
          </button>
        ) : null}
      </div>
      {state === "done" && summary ? (
        <p className={styles.summary}>{summary}</p>
      ) : null}
      {state === "open" ? (
        <div className={styles.stepBody}>{children}</div>
      ) : null}
    </section>
  );
}
