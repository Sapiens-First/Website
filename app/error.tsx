"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { ActionLink, Button } from "@/components/ui/Action";
import { Deck, Kicker } from "@/components/ui/Text";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="border-b-2 border-ink bg-paper py-32 max-sm:py-20">
      <Container width="content">
        <Kicker>Error</Kicker>
        <h1 className="text-6xl lg:text-8xl">Something went wrong.</h1>
        <Deck className="mt-6 max-w-xl">
          This page couldn&apos;t load. Try again, or head back home.
        </Deck>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="primary" onClick={retry}>
            Try again
          </Button>
          <ActionLink href="/">Back to home</ActionLink>
        </div>
      </Container>
    </main>
  );
}
