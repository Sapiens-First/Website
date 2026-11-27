import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { JoinView } from "@/components/members/JoinView";
import { getPublicAccount, getMembershipAccess } from "@/lib/members/access";
import { redirect } from "next/navigation";
import { memberReturnPath } from "@/lib/members/interests";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Join",
  description:
    "Join the pro-human movement. Create your free Sapiens First membership and connect with people nearby.",
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
    profile: "We couldn’t set up your account. Please try signing in again.",
  };
  let message =
    error && Object.hasOwn(messages, error) ? messages[error] : null;
  const { account, unavailable } = message
    ? { account: null, unavailable: false }
    : await getPublicAccount();
  if (unavailable)
    message =
      "Something went wrong checking if you’re signed in. Please try again.";
  if (!message && account) {
    await getMembershipAccess(next);
    redirect(next);
  }
  return <JoinView next={next} message={message} />;
}
