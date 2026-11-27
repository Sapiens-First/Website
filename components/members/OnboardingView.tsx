import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import ProfileForm from "@/app/(members)/onboarding/ProfileForm";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";
import { JoinSteps } from "./JoinSteps";

export function OnboardingView({
  email,
  signOut,
  ...form
}: {
  email: string | undefined;
  signOut: ReactNode;
} & Omit<ComponentProps<typeof ProfileForm>, "children">) {
  return (
    <main className="py-12 sm:py-20">
      <Container width="content" className="max-w-3xl">
        <JoinSteps current={2} className="mb-10" />
        <Kicker>About you</Kicker>
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          Let’s get to know you.
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          Knowing where you live helps us connect you with members nearby. Your
          details stay private.{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            How we use them
          </Link>
          .
        </p>
        <p className="mt-5 text-sm break-all text-muted-foreground">
          Signed in as <strong className="text-ink">{email}</strong>
        </p>
        <ProfileForm {...form} submitLabel="Continue →">
          {signOut}
        </ProfileForm>
      </Container>
    </main>
  );
}
