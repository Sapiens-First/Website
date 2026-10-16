import { Container } from "@/components/layout/Container";
import { FaqItem, FaqList } from "@/components/sections/Faq";
import { ActionLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";
import { pageMetadata } from "@/lib/site";
import CampaignActionHero from "@/components/campaigns/CampaignActionHero";

export const metadata = pageMetadata({
  title: "Citizens’ Dividend",
  description:
    "We deserve a share of the AI future. Explore our campaign for a Citizens’ Dividend: a public stake in AI-driven wealth, with a credible, costed plan.",
  path: "/campaigns/citizens-dividend",
});

const heading =
  "mt-5 mb-6 font-display text-4xl leading-none font-extrabold tracking-tight uppercase sm:text-5xl lg:text-6xl";
const body = "mb-6 max-w-2xl text-lg leading-[1.7]";

const questions = [
  {
    title: "Who benefits?",
    text: "How would the public share in AI-driven gains, and how would the payment be financed? A credible plan must make the funding mechanism and costs clear.",
  },
  {
    title: "Who receives it?",
    text: "Make eligibility clear. Explain how a regular, unconditional payment would reach people, and how the public can help shape its design.",
  },
  {
    title: "How does it fit?",
    text: "Show how the dividend would work alongside existing support. Judge the design by whether it expands people’s security and freedom, with honest scrutiny of costs and tradeoffs.",
  },
];

export default function Page() {
  return (
    <main>
      <CampaignActionHero
        campaignId="citizens-dividend"
        headline="We deserve a share of the AI future."
        description="If AI makes the economy richer, that wealth should make ordinary people’s lives better."
      />

      <section className="border-b-2 border-ink bg-white py-16 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Label tone="coral">The gains should reach everyone</Label>
            <h2 className={heading}>Security should be shared.</h2>
          </div>
          <div className="lg:pt-12">
            <p className={body}>
              A Citizens’ Dividend would be a regular, unconditional cash
              payment: a public stake in the wealth this new economy creates.
            </p>
            <p className="mb-6 border-l-4 border-coral pl-4 text-base leading-relaxed">
              This is a campaign proposal. Funding, eligibility and delivery
              need a credible, costed plan. No current benefit or payment is
              offered.
            </p>
            <p className={body}>
              AI could change the work people depend on. We should decide how
              its gains are shared before communities are left carrying the
              risk.
            </p>
            <p className={body}>
              A Citizens’ Dividend would give people a public stake in the AI
              economy. Its purpose is greater security and freedom, whether
              their work is transformed, their hours are cut or their job
              disappears.
            </p>
            <p className="m-0 font-display text-3xl leading-tight font-extrabold uppercase">
              We deserve a say. And we deserve a share.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b-2 border-ink bg-paper py-16 sm:py-24">
        <Container>
          <Label tone="yellow">Our call to lawmakers</Label>
          <h2 className={`${heading} max-w-3xl`}>
            Put a Citizens’ Dividend on the agenda. Publish a costed plan.
          </h2>
          <p className={body}>
            The public deserves clear answers before the costs and risks of
            change are pushed onto workers and communities. A plan needs to
            answer three questions.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {questions.map((question, index) => (
              <article
                className="border-t-8 border-ink pt-6"
                key={question.title}
              >
                <span className="font-display text-3xl font-extrabold text-coral-dark">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 mb-4 font-display text-3xl font-extrabold uppercase">
                  {question.title}
                </h3>
                <p className="m-0 text-lg leading-relaxed font-medium">
                  {question.text}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="the-call"
        className="scroll-mt-24 border-b-2 border-ink bg-soft py-12 sm:py-16"
      >
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Label tone="yellow">The public letter</Label>
            <h2 className={heading}>Our open letter.</h2>
          </div>
          <article className="max-w-[65ch] border-2 border-ink bg-white p-6 sm:p-10">
            <h3 className="mt-0 mb-8 font-display text-4xl leading-none font-extrabold text-coral-dark uppercase sm:text-5xl">
              Give the public a stake in the AI economy.
            </h3>
            <p className={body}>To our elected representatives:</p>
            <p className={body}>
              People should share in the wealth that AI creates.
            </p>
            <p className={body}>
              AI could change the work we depend on, threaten some livelihoods
              and concentrate more economic power. The public deserves a plan
              before the costs are pushed onto workers and communities.
            </p>
            <p className={body}>
              We call on you to develop and publish a costed Citizens’ Dividend
              bill: a regular, unconditional cash payment funded by a fair
              public share of AI-driven gains.
            </p>
            <p className={body}>
              Show how it would be financed. Make eligibility and delivery
              clear. Explain how it would work alongside existing support, and
              how people can help shape it.
            </p>
            <p className={body}>
              A dividend should expand people’s security and freedom. Its design
              should be judged by those results, with honest scrutiny of costs
              and tradeoffs.
            </p>
            <p className={body}>
              We do not want an AI economy in which a few collect the rewards
              and everyone else carries the risk.
            </p>
            <p className="m-0 text-xl leading-relaxed font-bold text-coral-dark">
              Put a Citizens’ Dividend on the agenda. Give the public a stake in
              the future.
            </p>
            <ActionLink href="#sign" variant="primary" className="mt-8">
              Add my signature ↑
            </ActionLink>
          </article>
        </Container>
      </section>

      <section className="border-b-2 border-ink bg-paper py-16 sm:py-24">
        <Container>
          <Label tone="coral">A proposal with questions to answer</Label>
          <h2 className={heading}>Let’s be clear.</h2>
          <FaqList>
            <FaqItem
              number={1}
              question="Is this an existing payment I can claim?"
            >
              <p>
                No. This campaign calls on lawmakers to develop and publish a
                costed plan. No payment, amount or delivery date is promised.
              </p>
            </FaqItem>
            <FaqItem number={2} question="Who would qualify?">
              <p>
                The proposal aims to share the gains broadly. The name
                “Citizens’ Dividend” does not settle citizenship, residency or
                other eligibility rules. The jurisdiction and exact eligibility
                still need to be worked out in a public, costed plan.
              </p>
            </FaqItem>
            <FaqItem number={3} question="How would it be paid for?">
              <p>
                Our call is for a fair public share of AI-driven gains. We have
                not settled a funding instrument or payment amount. Lawmakers
                should publish the costs, funding and tradeoffs, including how
                the dividend would work alongside existing support.
              </p>
            </FaqItem>
            <FaqItem
              number={4}
              question="Does this assume AI will eliminate every job?"
            >
              <p>
                No. Work could be transformed, hours could be cut, or some jobs
                could disappear. This campaign makes no numerical unemployment
                prediction. Its purpose is to share gains and expand security as
                the economy changes.
              </p>
            </FaqItem>
          </FaqList>
        </Container>
      </section>

      <section className="border-b-2 border-ink bg-coral py-16 sm:py-24">
        <Container>
          <Label>Get involved</Label>
          <h2 className={`${heading} max-w-3xl`}>
            An AI future that works for all of us.
          </h2>
          <p className={body}>
            Help build the movement for a public stake in the AI economy. Join
            Sapiens First or start a local Circle to organize with others.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ActionLink href="/join" className="bg-paper">
              Join the movement →
            </ActionLink>
            <ActionLink href="/circle">Start a Circle →</ActionLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
