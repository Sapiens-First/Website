import { ActionLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";

export default function DividendFeature() {
  return (
    <article
      id="citizens-dividend"
      className="mt-12 grid scroll-mt-24 grid-cols-1 overflow-hidden border-2 border-ink bg-brand-yellow lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="p-6 sm:p-10">
        <Label tone="coral">Campaign · Common prosperity</Label>
        <h3 className="mt-5 mb-5 font-display text-5xl leading-none font-extrabold tracking-tight uppercase sm:text-6xl">
          Citizens’ Dividend.
        </h3>
        <p className="mb-6 max-w-xl text-lg leading-relaxed font-medium">
          We deserve a share of the AI future. A regular, unconditional cash
          payment would give people a public stake in the wealth AI creates.
        </p>
        <ActionLink href="/campaigns/citizens-dividend" variant="primary">
          Explore the campaign →
        </ActionLink>
      </div>
      <div className="flex flex-col justify-center border-t-2 border-ink bg-ink p-6 text-paper sm:p-10 lg:border-t-0 lg:border-l-2">
        <p className="mb-4 text-xs font-black tracking-widest text-brand-yellow uppercase">
          Our call to lawmakers
        </p>
        <p className="m-0 font-display text-4xl leading-tight font-extrabold uppercase sm:text-5xl">
          Put a Citizens’ Dividend on the agenda.
          <span className="block text-brand-yellow">
            Publish a costed plan.
          </span>
        </p>
      </div>
    </article>
  );
}
