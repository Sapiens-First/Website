import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { ActionLink } from "@/components/ui/Action";
import { Kicker } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

const nextSteps = [
  {
    title: "Come to a gathering",
    body: "Meet organizers and other members at an open event.",
    href: "/calendar",
    cta: "See events",
    tone: "bg-coral-soft",
  },
  {
    title: "Learn the basics",
    body: "Our story, strategy and how we organize.",
    href: "/learn",
    cta: "Start learning",
    tone: "bg-brand-blue-soft",
  },
  {
    title: "Go further",
    body: "Fellows lead a project for 5–10 hours a week.",
    href: "/fellowship",
    cta: "About the Fellowship",
    tone: "bg-soft",
  },
] as const;

export function MemberWelcome({
  name,
  confirmed,
  notice,
}: {
  name: string | null;
  confirmed: boolean;
  notice?: ReactNode;
}) {
  return (
    <main className="py-12 sm:py-20">
      <Container width="content">
        <Kicker>{confirmed ? "You’re a member" : "Your account"}</Kicker>
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          {confirmed ? (
            <>
              Welcome in
              {name ? `, ${name.split(/\s+/)[0]}` : ""}
              <span className="text-coral">.</span>
            </>
          ) : name ? (
            `Welcome, ${name}.`
          ) : (
            "Welcome to Sapiens First."
          )}
        </h1>
        {confirmed && (
          <p
            role="status"
            className="mt-6 max-w-2xl border-2 border-ink bg-brand-yellow p-4 font-bold"
          >
            Your membership is confirmed. Thank you for standing with us.
          </p>
        )}
        {notice}

        <section aria-labelledby="next-steps" className="mt-12">
          <h2
            id="next-steps"
            className="font-display text-3xl font-extrabold uppercase"
          >
            {confirmed ? "Start here" : "Your next steps"}
          </h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {nextSteps.map((step, index) => (
              <li
                key={step.href}
                className={cn(
                  "flex flex-col border-2 border-ink p-5",
                  step.tone,
                )}
              >
                <span className="font-display text-sm font-extrabold tracking-widest text-muted uppercase">
                  Step {index + 1}
                </span>
                <h3 className="mt-1 font-display text-2xl font-extrabold uppercase">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 leading-snug">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-4 w-fit border-b-2 border-ink pb-0.5 text-xs font-black tracking-wider uppercase hover:border-coral-dark hover:text-coral-dark"
                >
                  {step.cta} →
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-3 border-2 border-dashed border-line p-4 text-sm">
            <span className="bg-ink px-2 py-1 text-[0.65rem] font-black tracking-widest text-white uppercase">
              Soon
            </span>
            Our member community on Discord is coming soon.
          </p>
        </section>

        <section
          aria-labelledby="account"
          className="mt-12 border-t-2 border-ink pt-8"
        >
          <h2
            id="account"
            className="font-display text-3xl font-extrabold uppercase"
          >
            Your account
          </h2>
          <div className="mt-5 flex flex-wrap gap-4">
            <ActionLink href="/membership" variant="outline">
              Manage membership
            </ActionLink>
            <ActionLink href="/dashboard/profile" variant="outline">
              Edit your profile
            </ActionLink>
          </div>
        </section>
      </Container>
    </main>
  );
}
