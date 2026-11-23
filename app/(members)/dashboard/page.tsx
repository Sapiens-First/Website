import type { Metadata } from "next";
import { MemberWelcome } from "@/components/members/MemberWelcome";
import { getMembershipAccess } from "@/lib/members/access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    updated?: string;
    membership?: string;
  }>;
}) {
  const { profile } = await getMembershipAccess();
  const { error, updated, membership } = await searchParams;
  return (
    <MemberWelcome
      name={profile.full_name}
      confirmed={membership === "confirmed"}
      notice={
        <>
          {updated === "profile" && (
            <p role="status" className="mt-6 border-l-4 border-ink p-3">
              Your profile has been saved.
            </p>
          )}
          {error === "signout" && (
            <p role="alert" className="mt-6">
              We couldn&apos;t sign you out. Please try again.
            </p>
          )}
        </>
      }
    />
  );
}
