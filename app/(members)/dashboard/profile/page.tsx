import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";
import ProfileForm from "@/app/(members)/onboarding/ProfileForm";
import { getMembershipAccess } from "@/lib/members/access";
import {
  getProfileCountries,
  initialProfileValues,
} from "@/lib/members/profile";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Edit your profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { user, profile } = await getMembershipAccess();
  return (
    <main className="py-14 sm:py-20">
      <Container width="content" className="max-w-3xl">
        <Kicker>Your account</Kicker>
        <h1 className="mt-5 font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          Edit your profile.
        </h1>
        <p className="mt-6 text-lg">
          Keep your details up to date. Your profile stays private.
        </p>
        <p className="mt-5 break-all">
          Google account: <strong>{user.email}</strong>
        </p>
        <ProfileForm
          initialValues={initialProfileValues(profile)}
          countries={getProfileCountries()}
          submitLabel="Save changes"
        />
      </Container>
    </main>
  );
}
