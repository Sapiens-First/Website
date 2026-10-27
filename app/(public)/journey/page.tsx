import GrowthJourney from "@/components/journey/GrowthJourney";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Journey",
  description:
    "Explore Sapiens First’s model for building a movement through action, recruitment, and training, toward 100,000 active participants by September 2027.",
  path: "/journey",
});

export default function Page() {
  return <GrowthJourney />;
}
