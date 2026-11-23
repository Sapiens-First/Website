import type { ComponentProps } from "react";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";
import { AgreementForm } from "./AgreementForm";
import { JoinSteps } from "./JoinSteps";

export function AgreementView({
  next,
  action,
}: {
  next: string;
  action?: ComponentProps<typeof AgreementForm>["action"];
}) {
  return (
    <main className="py-12 sm:py-20">
      <Container width="content">
        <JoinSteps current={3} className="mb-10 max-w-2xl" />
        <Kicker>Member agreement</Kicker>
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          Our shared{" "}
          <span className="ink-underline ink-underline-brand-yellow">
            commitments.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Sapiens First is a peaceful, people-first movement. These commitments
          come from our core values, and every member makes them.
        </p>
        <AgreementForm next={next} action={action} />
      </Container>
    </main>
  );
}
