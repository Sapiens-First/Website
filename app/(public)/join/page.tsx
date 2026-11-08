import { pageMetadata } from "@/lib/site";
import { Button } from "@/components/ui/Action";
import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/ui/Text";
import { signInWithGoogle } from "@/app/auth/actions";
import { getPublicAccount, getMembershipState } from "@/lib/members/access";
import { redirect } from "next/navigation";
import { memberReturnPath } from "@/lib/members/interests";
import { TRIAL_DAYS } from "@/lib/members/plans";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Join",
  description:
    "Join Sapiens First from $1 USD per month. Every contribution includes the same membership.",
  path: "/join",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next: requestedNext } = await searchParams;
  const next = memberReturnPath(requestedNext);
  const messages: Record<string, string> = {
    signin: "We couldn’t start Google sign-in. Please try again.",
    callback: "Sign-in wasn’t completed. Please try again.",
    profile: "We couldn’t prepare your profile. Please try signing in again.",
  };
  let message =
    error && Object.hasOwn(messages, error) ? messages[error] : null;
  const { account, unavailable } = message
    ? { account: null, unavailable: false }
    : await getPublicAccount();
  if (unavailable)
    message =
      "We couldn’t check your existing session. Please try signing in again.";
  if (!message && account) {
    // Onboarding returns to `next` immediately when the profile is complete.
    if (next !== "/dashboard" && next !== "/membership")
      redirect(`/onboarding?next=${encodeURIComponent(next)}`);
    const { allowed } = await getMembershipState();
    redirect(allowed ? "/dashboard" : "/membership");
  }
  return (
    <main
      className="grid border-b-2 border-ink md:min-h-[calc(100svh-112px)] md:grid-cols-2"
      aria-labelledby="join-heading"
    >
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 md:px-10 md:py-14 lg:px-16 xl:px-24">
        <Kicker>Join Sapiens First</Kicker>
        <h1
          className="mt-6 font-display text-6xl leading-none font-extrabold tracking-tight uppercase sm:text-7xl md:text-6xl lg:text-7xl xl:text-[5rem]"
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
          Join from $1, $10 or $20 USD per month, with the same benefits at
          every amount. Sign in, complete your profile and choose your
          contribution. New members can start a {TRIAL_DAYS}-day trial with a
          payment card.
        </p>
        <form action={signInWithGoogle} id="signup" className="mt-8">
          <input type="hidden" name="next" value={next} />
          <Button
            type="submit"
            variant="outline"
            className="min-h-14 w-full gap-3 bg-white text-base normal-case hover:bg-white hover:text-ink sm:w-auto sm:px-8"
          >
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
            Continue with Google
          </Button>
        </form>
        {message && (
          <p role="alert" className="mt-4">
            {message}
          </p>
        )}
        <Link
          className="mt-5 w-fit text-sm underline underline-offset-4"
          href="/privacy"
        >
          Privacy policy
        </Link>
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
