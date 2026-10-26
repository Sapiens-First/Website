import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ActionLink } from "@/components/ui/Action";
import { Kicker } from "@/components/ui/Text";
import { getMembershipAccess } from "@/lib/members/access";
import { getProfileCountries } from "@/lib/members/profile";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; updated?: string }>;
}) {
  const { user, profile, membership } = await getMembershipAccess();
  const { error, updated } = await searchParams;
  const country = getProfileCountries().find(
    ({ code }) => code === profile.country_code,
  )?.name;
  return (
    <main className="py-16 sm:py-24">
      <Container width="content">
        <Kicker>Your account</Kicker>
        <h1 className="mt-5 font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          {profile.full_name
            ? `Welcome, ${profile.full_name}.`
            : "Welcome to Sapiens First."}
        </h1>
        {updated === "profile" && (
          <p role="status" className="mt-6 border-l-4 border-ink p-3">
            Your profile has been saved.
          </p>
        )}
        <dl className="mt-10 grid gap-6 border-2 border-ink bg-white p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <dt className="text-sm font-bold uppercase">Email</dt>
            <dd className="mt-2 text-lg break-all">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase">Membership</dt>
            <dd className="mt-2 text-lg capitalize">
              {membership.tier} member
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase">Location</dt>
            <dd className="mt-2 text-lg break-words">
              {[profile.city, profile.region, country]
                .filter(Boolean)
                .join(", ")}
            </dd>
          </div>
        </dl>
        {error === "signout" && (
          <p role="alert" className="mt-6">
            We couldn&apos;t sign you out. Please try again.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <ActionLink href="/dashboard/profile" variant="outline">
            Edit your profile
          </ActionLink>
          <ActionLink href="/calendar" variant="primary">
            Explore open events
          </ActionLink>
          <ActionLink href="/learn" variant="outline">
            Explore learning resources
          </ActionLink>
        </div>
        <p className="mt-6 text-lg">
          Your free membership includes open events and public learning
          resources.
        </p>
      </Container>
    </main>
  );
}
