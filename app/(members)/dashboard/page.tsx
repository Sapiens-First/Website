import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ActionLink } from "@/components/ui/Action";
import { Kicker } from "@/components/ui/Text";
import { getMembershipAccess } from "@/lib/members/access";

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
  const { profile } = await getMembershipAccess();
  const { error, updated } = await searchParams;
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
