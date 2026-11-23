import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/Action";
import { OnboardingView } from "@/components/members/OnboardingView";
import { requireAccountProfile } from "@/lib/members/access";
import {
  getProfileCountries,
  initialProfileValues,
  isProfileComplete,
} from "@/lib/members/profile";
import { memberReturnPath } from "@/lib/members/interests";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Complete your profile",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = memberReturnPath((await searchParams).next ?? "/membership");
  const { user, profile } = await requireAccountProfile(next);
  if (isProfileComplete(profile)) redirect(next);
  const countries = getProfileCountries();
  return (
    <OnboardingView
      email={user.email}
      joining={next === "/membership" || next === "/dashboard"}
      next={next}
      initialValues={initialProfileValues(
        profile,
        user.user_metadata?.full_name ?? user.user_metadata?.name,
      )}
      countries={countries}
      signOut={
        <form action={signOut}>
          <Button type="submit">Sign out</Button>
        </form>
      }
    />
  );
}
