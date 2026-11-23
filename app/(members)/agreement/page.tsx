import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AgreementView } from "@/components/members/AgreementView";
import { requireAccountProfile } from "@/lib/members/access";
import { hasAcceptedAgreement } from "@/lib/members/agreement";
import { memberReturnPath } from "@/lib/members/interests";
import { isProfileComplete } from "@/lib/members/profile";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Member agreement",
  robots: { index: false, follow: false },
};

export default async function AgreementPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = memberReturnPath((await searchParams).next ?? "/membership");
  const { profile } = await requireAccountProfile(next);
  if (!isProfileComplete(profile))
    redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  if (hasAcceptedAgreement(profile)) redirect(next);
  return <AgreementView next={next} />;
}
