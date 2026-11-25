import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { TextLink } from "@/components/ui/button";
import { Label } from "@/components/ui/Text";
import { MapPins } from "@/components/groups/story/MapPins";
import { links } from "@/lib/no-tech-kings/links";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Join a Local Group",
  description:
    "Find a local AI safety group near you on the Sapiens First community map.",
  path: "/groups",
});

export default function GroupsPage() {
  return (
    <main>
      <section className="py-14 sm:py-20">
        <Container>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label>Find people near you</Label>
              <h1 className="mt-3 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                Join a local group
              </h1>
            </div>
            <MapPins className="mr-auto ml-4 w-64 max-md:hidden lg:w-80" />
            <TextLink href={links.groupsMap.href}>
              Open map in a new page ↗
            </TextLink>
          </div>
          <div className="border-2 border-ink bg-white">
            <iframe
              src={links.groupsMap.embedUrl}
              title="Map of local AI safety groups"
              allow="camera;microphone;geolocation;display-capture;clipboard-write"
              className="block h-150 w-full border-0 sm:h-200"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Map not loading?{" "}
            <a
              className="underline underline-offset-4"
              href={links.groupsMap.href}
            >
              Open it on Padlet
            </a>
            .
          </p>
        </Container>
      </section>
    </main>
  );
}
