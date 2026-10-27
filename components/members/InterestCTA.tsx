import { ActionLink } from "@/components/ui/Action";
import { interestReturnPath, type Interest } from "@/lib/members/interests";
import { getInterestState } from "@/lib/members/access";
import InterestForm from "./InterestForm";

export default async function InterestCTA({
  interest,
  confirm = false,
}: {
  interest: Interest;
  confirm?: boolean;
}) {
  const state = await getInterestState(interest);
  const next = interestReturnPath(interest);
  const href =
    state === "signed-out"
      ? `/join?next=${encodeURIComponent(next)}`
      : state === "incomplete"
        ? `/onboarding?next=${encodeURIComponent(next)}`
        : next;
  const messages = {
    unavailable: "We couldn’t check your account. Please try again shortly.",
    "signed-out":
      "Free membership required. Sign in or create your account to continue.",
    incomplete: "Complete your member profile to register your interest.",
    member: "Use your member profile. No need to enter your details again.",
  };
  return (
    <div id="signup" className="relative z-2 scroll-mt-28">
      {state === "registered" ? (
        <p role="status" className="font-bold">
          Interest registered ✓
          <span className="mt-3 block text-sm leading-relaxed font-normal">
            We’ll contact you about next steps.
          </span>
        </p>
      ) : confirm && state === "member" ? (
        <InterestForm interest={interest} />
      ) : (
        <>
          <ActionLink href={href} variant="primary" className="max-sm:w-full">
            {state === "unavailable" ? "Try again →" : "I’m interested →"}
          </ActionLink>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            {messages[state]}
          </p>
        </>
      )}
    </div>
  );
}
