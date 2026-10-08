import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ActionLink } from "@/components/ui/Action";
import { Deck, Kicker } from "@/components/ui/Text";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="border-b-2 border-ink bg-paper py-32 max-sm:py-20">
      <Container width="content">
        <Kicker>Error 404</Kicker>
        <h1 className="text-6xl lg:text-8xl">Page not found.</h1>
        <Deck className="mt-6 max-w-xl">
          The page you&apos;re looking for has moved or doesn&apos;t exist.
        </Deck>
        <div className="mt-10 flex flex-wrap gap-3">
          <ActionLink href="/" variant="primary">
            Back to home
          </ActionLink>
          <ActionLink href="/join">Join the movement</ActionLink>
        </div>
      </Container>
    </main>
  );
}
