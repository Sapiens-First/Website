import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Action";
import { Kicker } from "@/components/ui/Text";
import { requireAccountProfile } from "@/lib/members/access";
import {
  getProfileCountries,
  initialProfileValues,
  isProfileComplete,
} from "@/lib/members/profile";
import ProfileForm from "./ProfileForm";
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
  const next = memberReturnPath((await searchParams).next);
  const { user, profile } = await requireAccountProfile(next);
  if (isProfileComplete(profile)) redirect(next);
  const countries = getProfileCountries();
  return (
    <main className="py-14 sm:py-20">
      <Container width="content" className="max-w-3xl">
        <Kicker>Your free account</Kicker>
        <h1 className="mt-5 font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          Let’s get to know you.
        </h1>
        <p className="mt-6 text-lg">
          Tell us where you’re based so we can understand our local communities.
        </p>
        <p className="mt-5 break-all">
          Signed in as <strong>{user.email}</strong>
        </p>
        <ProfileForm
          next={next}
          initialValues={initialProfileValues(
            profile,
            user.user_metadata?.full_name ?? user.user_metadata?.name,
          )}
          countries={countries}
        >
          <form action={signOut}>
            <Button type="submit">Sign out</Button>
          </form>
          <Link href="/privacy" className="underline underline-offset-4">
            How we use your details
          </Link>
        </ProfileForm>
      </Container>
    </main>
  );
}
