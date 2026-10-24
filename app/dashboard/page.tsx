import type { Metadata } from "next";
import { signOut } from "@/app/auth/actions";
import { Container } from "@/components/layout/Container";
import { ActionLink, Button } from "@/components/ui/Action";
import { Kicker } from "@/components/ui/Text";
import { requireMember } from "@/lib/members/access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { user, profile } = await requireMember();
  const { error } = await searchParams;
  return (
    <main className="py-16 sm:py-24">
      <Container width="content">
        <Kicker>Your account</Kicker>
        <h1 className="mt-5 font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          {profile.full_name
            ? `Welcome, ${profile.full_name}.`
            : "Welcome to Sapiens First."}
        </h1>
        <dl className="mt-10 grid gap-6 border-2 border-ink bg-white p-6 sm:p-8">
          <div>
            <dt className="text-sm font-bold uppercase">Email</dt>
            <dd className="mt-2 text-lg break-all">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase">Membership</dt>
            <dd className="mt-2 text-lg">Free account</dd>
          </div>
        </dl>
        {error === "signout" && (
          <p role="alert" className="mt-6">
            We couldn&apos;t sign you out. Please try again.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <ActionLink href="/calendar" variant="primary">
            Explore open events
          </ActionLink>
          <form action={signOut}>
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      </Container>
    </main>
  );
}
