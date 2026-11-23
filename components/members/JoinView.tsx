import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/Action";
import { Kicker } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import {
  CONTRIBUTIONS,
  DEFAULT_CONTRIBUTION,
  TRIAL_DAYS,
} from "@/lib/members/plans";
import { EmailSignIn } from "./EmailSignIn";
import { JoinSteps } from "./JoinSteps";

const reasons = [
  "Fund a movement that answers to people, not tech kings.",
  "Take part in gatherings, campaigns and training.",
  "Meet other members as our community space opens.",
];

export function JoinView({
  next,
  message,
  googleAction = signInWithGoogle,
  emailAction,
}: {
  next: string;
  message: string | null;
  googleAction?: (form: FormData) => void | Promise<void>;
  emailAction?: ComponentProps<typeof EmailSignIn>["action"];
}) {
  return (
    <main
      className="grid border-b-2 border-ink md:min-h-[calc(100svh-112px)] md:grid-cols-2"
      aria-labelledby="join-heading"
    >
      <div className="flex flex-col justify-center px-4 py-10 sm:px-10 md:px-10 md:py-14 lg:px-16 xl:px-24">
        <JoinSteps current={1} className="mb-10 max-w-lg" />
        <Kicker>Join Sapiens First</Kicker>
        <h1
          className="font-display text-6xl leading-none font-extrabold tracking-tight uppercase sm:text-7xl md:text-6xl lg:text-7xl xl:text-[5rem]"
          id="join-heading"
        >
          Build power.
          <br />
          Put people{" "}
          <span className="ink-underline ink-underline-brand-yellow">
            first.
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed sm:text-xl">
          Members are the backbone of the pro-human movement. Together we stand
          up to Big Tech and fight for democracy.
        </p>
        <ul className="mt-6 max-w-lg space-y-2.5">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-3 leading-snug">
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-5 shrink-0 place-items-center bg-success text-[0.7rem] font-black text-white"
              >
                ✓
              </span>
              {reason}
            </li>
          ))}
        </ul>

        <section aria-labelledby="join-price" className="mt-8 max-w-lg">
          <h2 id="join-price" className="sr-only">
            Monthly contribution
          </h2>
          <div className="grid grid-cols-3 border-2 border-ink bg-white">
            {CONTRIBUTIONS.map((amount, index) => (
              <div
                key={amount}
                className={cn(
                  "relative px-3 py-4 text-center",
                  index > 0 && "border-l-2 border-ink",
                  amount === DEFAULT_CONTRIBUTION && "bg-soft",
                )}
              >
                {amount === DEFAULT_CONTRIBUTION && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yellow px-2 py-0.5 text-[0.65rem] font-black tracking-widest whitespace-nowrap uppercase">
                    Suggested
                  </span>
                )}
                <span className="font-display text-4xl font-extrabold">
                  ${amount}
                </span>
                <span className="block text-xs font-bold tracking-wider text-muted uppercase">
                  per month
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            <strong>Free for your first {TRIAL_DAYS} days.</strong> Every amount
            includes the same full membership. Cancel anytime.
          </p>
        </section>

        <div className="mt-8 max-w-lg space-y-5" id="signup">
          <form action={googleAction}>
            <input type="hidden" name="next" value={next} />
            <Button
              type="submit"
              variant="outline"
              className="min-h-14 w-full gap-3 bg-white text-base normal-case hover:bg-white hover:text-ink"
            >
              <GoogleMark />
              Continue with Google
            </Button>
          </form>
          <div
            className="flex items-center gap-3 text-xs font-black tracking-widest text-muted uppercase"
            aria-hidden="true"
          >
            <span className="h-0.5 flex-1 bg-rule" />
            or
            <span className="h-0.5 flex-1 bg-rule" />
          </div>
          <EmailSignIn next={next} action={emailAction} />
        </div>
        {message && (
          <p
            role="alert"
            className="mt-4 max-w-lg border-l-4 border-red-700 p-3"
          >
            {message}
          </p>
        )}
        <p className="mt-6 text-sm text-muted">
          Takes about three minutes.{" "}
          <Link
            className="text-ink underline underline-offset-4"
            href="/privacy"
          >
            Privacy policy
          </Link>
        </p>
      </div>
      <div className="relative min-h-72 border-t-2 border-ink sm:min-h-96 md:min-h-0 md:border-t-0 md:border-l-2">
        <Image
          src="/assets/image.png"
          alt="People raising clasped hands together at a demonstration"
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          preload
          className="object-cover object-center"
        />
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24.4v7.42h10.77a9.21 9.21 0 0 1-4 6.05v5.02h6.48c3.79-3.49 5.96-8.64 5.96-14.57Z"
      />
      <path
        fill="#34A853"
        d="M24.4 44c5.4 0 9.93-1.79 13.24-4.97l-6.48-5.02c-1.8 1.21-4.1 1.94-6.76 1.94-5.21 0-9.63-3.52-11.21-8.26H6.5v5.18A20 20 0 0 0 24.4 44Z"
      />
      <path
        fill="#FBBC05"
        d="M13.19 27.69a12 12 0 0 1 0-7.38v-5.18H6.5a20 20 0 0 0 0 17.74l6.69-5.18Z"
      />
      <path
        fill="#EA4335"
        d="M24.4 12.05c2.94 0 5.56 1.01 7.64 3l5.73-5.73C34.31 6.09 29.8 4 24.4 4a20 20 0 0 0-17.9 11.13l6.69 5.18c1.58-4.74 6-8.26 11.21-8.26Z"
      />
    </svg>
  );
}
