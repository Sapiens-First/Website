import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";

export default function Loading() {
  return (
    <main aria-busy="true" className="min-h-[50svh] py-16 sm:py-24">
      <Container width="content">
        <div role="status" aria-live="polite">
          <Kicker>Please wait</Kicker>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase sm:text-7xl">
            Loading…
          </h1>
          <p className="mt-6 text-lg">Your page will be ready in a moment.</p>
        </div>
      </Container>
    </main>
  );
}
