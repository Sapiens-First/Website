import { PageHero, PageTitle } from "@/components/sections/SplitSection";
import { Kicker } from "@/components/ui/Text";
import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import GuideClient from "@/components/learn/GuideClient";

export const metadata = pageMetadata({
  title: "Guide",
  description:
    "The Sapiens First guide to AI, people power, and how to make change.",
  path: "/learn",
});

export default function Page() {
  return (
    <>
      <PageHero className="pt-16 pb-14 max-md:pt-16 max-md:pb-14 max-sm:pt-14 max-sm:pb-12">
        <Container className="max-w-6xl">
          <Kicker>Learn · Organize · Act</Kicker>
          <PageTitle className="max-w-none text-5xl leading-none tracking-tighter lg:text-7xl">
            Sapiens&apos; Guide to
            <br />
            <span className="text-coral-dark">Revolution</span>
          </PageTitle>
          <p className="mt-7 max-w-xl text-lg leading-normal max-sm:mt-6 xl:text-xl">
            A practical guide to AI, people power, and organizing for change.
          </p>
        </Container>
      </PageHero>
      <main>
        <section className="border-b-2 border-ink px-0 pt-14 pb-24 max-sm:scroll-mt-20 max-sm:pt-7 max-sm:pb-16">
          <Container className="max-w-6xl">
            <div className="grid grid-cols-1 items-start gap-16 max-lg:gap-9 lg:grid-cols-12">
              <GuideClient />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
