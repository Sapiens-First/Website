import { Container } from "@/components/layout/Container";
import { ActionLink, TextLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";
import { publicCalendar } from "@/lib/calendar";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Public Calendar",
  description:
    "Join Sapiens First’s organizer call on Tuesdays at 10am Pacific. See upcoming events and subscribe in Google Calendar, Apple Calendar, or Outlook.",
  path: "/calendar",
});

export default function CalendarPage() {
  return (
    <main>
      <section className="border-b-2 border-ink py-14 sm:py-20">
        <Container>
          <Label>Show up. Build human power.</Label>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-none font-extrabold uppercase sm:text-8xl">
            The human revolution starts with us.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
            Meet other organizers, plan actions, and help shape what comes next.
            Find your next way in on the Sapiens First public calendar.
          </p>
          <div className="mt-9 grid gap-6 border-2 border-ink bg-brand-yellow p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-extrabold uppercase sm:text-5xl">
                Organizer call
              </h2>
              <p className="mt-3 text-xl font-bold">Tuesdays at 10am PT</p>
              <p className="mt-2 leading-relaxed">
                Online · 10–11am Pacific. Open the event below for the joining
                link and any schedule changes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ActionLink href="#upcoming-events" variant="primary">
                Find the next call ↓
              </ActionLink>
              <ActionLink href={publicCalendar.googleUrl}>
                Add to Google Calendar ↗
              </ActionLink>
            </div>
          </div>
        </Container>
      </section>

      <section id="upcoming-events" className="scroll-mt-24 py-14 sm:py-20">
        <Container>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label>Make a plan to join us</Label>
              <h2 className="mt-3 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                Upcoming events
              </h2>
            </div>
            <TextLink href={publicCalendar.embedUrl}>
              Open calendar in a new page ↗
            </TextLink>
          </div>
          <p id="calendar-timezone" className="mb-5 leading-relaxed">
            Times below are shown in Pacific Time. Subscribe to see events in
            your own calendar’s time zone.
          </p>
          <div
            className="overflow-x-auto border-2 border-ink bg-white"
            tabIndex={0}
            role="region"
            aria-label="Public calendar; scroll horizontally on smaller screens"
          >
            <iframe
              src={publicCalendar.embedUrl}
              title="Sapiens First public events calendar"
              aria-describedby="calendar-timezone"
              className="block h-[600px] w-full min-w-[500px] border-0 sm:h-[700px]"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            On phones, swipe across the calendar. Calendar not loading?{" "}
            <a
              className="underline underline-offset-4"
              href={publicCalendar.embedUrl}
            >
              Open the public calendar directly
            </a>
            .
          </p>

          <div className="mt-10 border-t-2 border-ink pt-8">
            <h2 className="font-display text-3xl font-extrabold uppercase sm:text-4xl">
              Keep us on your calendar
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed">
              Subscribe for future events and schedule updates. Google Calendar
              will ask you to confirm adding this calendar to your account.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionLink href={publicCalendar.googleUrl} variant="primary">
                Add to Google Calendar ↗
              </ActionLink>
              <ActionLink href={publicCalendar.subscriptionUrl}>
                Subscribe in Apple Calendar / Outlook ↗
              </ActionLink>
            </div>
            <details className="mt-6 max-w-3xl border-2 border-ink p-5">
              <summary className="cursor-pointer font-bold">
                Need a calendar subscription URL?
              </summary>
              <p className="mt-4 leading-relaxed">
                In your calendar app, choose “Subscribe from web” or “Add by
                URL” and paste this public iCal address. Choose a subscription
                rather than a one-time import to receive updates.
              </p>
              <a
                className="mt-3 block text-sm break-all underline underline-offset-4"
                href={publicCalendar.icalUrl}
              >
                {publicCalendar.icalUrl}
              </a>
            </details>
          </div>
        </Container>
      </section>
    </main>
  );
}
