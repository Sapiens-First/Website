import { pageMetadata } from "@/lib/site";
import { ActionLink } from "@/components/ui/Action";
import Link from "next/link";
import { cn } from "@/lib/cn";
import BuilderToc from "@/components/careers/BuilderToc";

export const metadata = pageMetadata({
  title: "AI-Native Builder (Contract) — Careers",
  description:
    "Sapiens First is hiring an AI-native builder on a paid contract to turn messy organizational problems into useful software, automations, and systems. Remote, India preferred.",
  path: "/careers/builder",
});

/** Long-form job description typography, applied to every paragraph and list in the page. */
const prose =
  "[&_:is(p,li)]:text-lg [&_:is(p,li)]:leading-relaxed [&_:is(ul,ol)]:mx-0 [&_:is(ul,ol)]:mt-0 [&_:is(ul,ol)]:mb-5 [&_:is(ul,ol)]:pl-6 [&_a:hover]:text-coral-dark [&_li]:mb-3 [&_li]:pl-0.5 [&_p]:mx-0 [&_p]:mt-0 [&_p]:mb-4";

export default function Page() {
  return (
    <>
      <main
        className={cn(
          "mx-auto my-0 w-full max-w-6xl px-5 pt-12 pb-20 max-lg:max-w-3xl max-sm:pt-7 max-sm:pb-14 print:w-full print:p-0",
          prose,
        )}
      >
        <Link
          className="mb-8 inline-flex items-center gap-2 text-lg leading-normal print:hidden"
          href="/careers"
        >
          <span aria-hidden="true">←</span>
          <span className="underline underline-offset-4">All careers</span>
        </Link>
        <article>
          <header className="mb-8 ml-72 max-w-3xl border-b border-solid border-b-rule pb-8 max-lg:ml-0 print:ml-0">
            <h1 className="relative z-2 max-w-none font-body text-3xl leading-tight font-bold tracking-tight normal-case max-sm:tracking-tighter lg:text-5xl">
              AI-Native Builder (Contract)
            </h1>
            <p className="mx-0 mt-4 mb-6 text-lg text-ink [&_strong]:font-medium">
              <strong>
                Remote · India preferred · 20 or 40 hours/week · 3 months
              </strong>
            </p>
            <p>
              <strong>₹50–70k/month for full-time</strong>
            </p>
            <ActionLink
              className="print:hidden"
              variant="primary"
              href="#apply"
            >
              Apply for this role →
            </ActionLink>
          </header>
          <div className="grid grid-cols-1 items-start gap-12 max-lg:block lg:grid-cols-12 print:block">
            <aside className="sticky top-28 max-h-180 overflow-y-auto max-lg:static max-lg:mb-8 max-lg:max-h-none max-lg:overflow-visible lg:col-span-3 print:hidden">
              <BuilderToc />
            </aside>
            <div className="max-w-4xl min-w-0 text-lg text-ink lg:col-span-9">
              <div className="print:[&_:is(h2,h3)]:break-after-avoid [&_a]:wrap-anywhere [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mx-0 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:font-body [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-balance [&_h2]:normal-case max-lg:[&_h2]:scroll-mt-44 max-sm:[&_h2]:scroll-mt-20">
                <p className="text-xl! leading-relaxed">
                  Turn messy organizational problems into{" "}
                  <strong>useful software, automations, and systems</strong>.
                  You’ll work directly with the Executive Director to identify
                  priorities, prototype solutions, and ship tools that help a
                  growing political movement scale.
                </p>
                <h2
                  id="about-sapiens-first"
                  className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                >
                  About Sapiens First
                </h2>
                <p>
                  We’re building political power to ensure technology serves the
                  common good. We organize people, train leaders, run campaigns,
                  and build media and movement infrastructure.
                </p>
                <p>
                  We work like a political campaign and a startup: a small team,
                  fast iteration, and direct communication. Our approach draws
                  from <a href="https://www.holacracy.org/">Holacracy</a> and
                  the{" "}
                  <a href="https://jobs.netflix.com/culture">
                    Netflix culture memo
                  </a>
                  : clear roles, distributed authority, freedom with
                  responsibility, candor, and continuous improvement.
                </p>
                <p>
                  You’ll get context and ownership, with the expectation that
                  you make decisions, surface problems early, and learn quickly.
                  This suits people who are self-directed and comfortable with
                  ambiguity.
                </p>
                <h2
                  id="the-role"
                  className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                >
                  About the Role
                </h2>
                <p>
                  You’ll research, build, and improve solutions across
                  organizing, campaigns, fundraising, media, and internal
                  coordination. We take an AI-first approach (see{" "}
                  <a href="https://block.xyz/inside/from-hierarchy-to-intelligence">
                    “From Hierarchy to Intelligence”
                  </a>
                  ) to reduce manual operations.
                </p>
                <ul>
                  <li>
                    <strong>Movement infrastructure:</strong> Volunteer
                    onboarding, training, events, local groups, and organizer
                    workflows.
                  </li>
                  <li>
                    <strong>AI and automation:</strong> Connect documents, CRM
                    data, workflows, and AI agents; automate repetitive work.
                  </li>
                  <li>
                    <strong>Campaigns and fundraising:</strong> Outreach,
                    volunteer coordination, donor research, and follow-up.
                  </li>
                  <li>
                    <strong>Media tools:</strong> Editing, repurposing,
                    publishing, scheduling, and analytics.
                  </li>
                </ul>
                <p>
                  Priorities will evolve. Part of the job is noticing problems
                  and deciding <strong>what’s worth building</strong>.
                </p>
                <h2
                  id="about-you"
                  className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                >
                  About You
                </h2>
                <ul>
                  <li>
                    <strong>Engineering ability:</strong> Build web products and
                    work comfortably with APIs and databases.
                  </li>
                  <li>
                    <strong>AI fluency:</strong> Use AI heavily, research tools
                    independently, and choose when to build custom software or
                    use an existing product.
                  </li>
                  <li>
                    <strong>Product and design judgment:</strong> Clarify vague
                    goals, narrow the scope, and ship useful, well-designed
                    tools quickly.
                  </li>
                  <li>
                    <strong>Initiative and mission alignment:</strong> Notice
                    problems, make sound decisions, and care about the work
                    Sapiens First is doing.
                  </li>
                </ul>
                <p>
                  We value <strong>what you can build</strong> over degrees,
                  credentials, years of experience, or specific frameworks.
                  Students and early-career applicants are welcome.
                </p>
                <h2
                  id="benefits"
                  className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                >
                  Benefits
                </h2>
                <table
                  className="mx-0 mt-0 mb-7 w-full border-collapse text-lg leading-relaxed [&_:is(th,td)]:border-b [&_:is(th,td)]:border-rule [&_:is(th,td)]:px-0 [&_:is(th,td)]:py-3.5 [&_:is(th,td)]:text-left [&_:is(th,td)]:align-top max-sm:[&_td]:pt-0 max-sm:[&_td]:pb-4 [&_td_li]:mx-0 [&_td_li]:mt-0 [&_td_li]:mb-2 [&_td_li]:p-0 [&_td_li:last-child]:mb-0 [&_td_ul]:m-0 [&_td_ul]:list-none [&_td_ul]:p-0 [&_th]:w-40 [&_th]:pr-5 max-sm:[&_th]:border-b-0 max-sm:[&_th]:pt-4 max-sm:[&_th]:pr-0 max-sm:[&_th]:pb-1 print:[&_tr]:break-inside-avoid max-sm:[&,&_:is(tbody,tr,th,td)]:block max-sm:[&,&_:is(tbody,tr,th,td)]:w-full"
                  aria-labelledby="benefits"
                >
                  <tbody>
                    <tr>
                      <th scope="row">Contract</th>
                      <td>
                        Initial <strong>3 months</strong>, at 20 or 40
                        hours/week.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Monthly pay</th>
                      <td>
                        <ul>
                          <li>
                            <strong>20 hours/week:</strong> ₹25,000–₹35,000
                            (approx. $260–$365 USD).
                          </li>
                          <li>
                            <strong>40 hours/week:</strong> ₹50,000–₹70,000
                            (approx. $520–$730 USD).
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Location</th>
                      <td>Remote; India preferred.</td>
                    </tr>
                    <tr>
                      <th scope="row">Schedule</th>
                      <td>
                        Mostly flexible and asynchronous. Regular meetings (up
                        to 3 hours/week) with staff in California.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  This is a young organization with less structure and room to
                  shape how we work. You’ll gain experience across engineering,
                  product, AI, operations, and movement-building.{" "}
                  <strong>
                    A successful contract can lead to a full-time role
                  </strong>{" "}
                  with growing technical and product ownership.
                </p>
                <h2
                  id="apply"
                  className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl xl:text-7xl"
                >
                  Apply
                </h2>
                <p>
                  Email{" "}
                  <a href="mailto:rohan@sapiensfirst.org?subject=AI-Native%20Builder">
                    <strong>rohan@sapiensfirst.org</strong>
                  </a>{" "}
                  with the subject <strong>“AI-Native Builder”</strong> and
                  answers to these four questions:
                </p>
                <ol className="marker:font-bold marker:text-coral-dark">
                  <li>
                    <strong>What are 2–3 things you’ve built?</strong> Include
                    links, demos, GitHub repositories, screenshots, or short
                    explanations, and say what you personally did.
                  </li>
                  <li>
                    <strong>What about our mission appeals to you?</strong>{" "}
                    Under 100 words.
                  </li>
                  <li>
                    <strong>
                      What do you hope to get out of this experience?
                    </strong>{" "}
                    Under 100 words.
                  </li>
                  <li>
                    <strong>Are you applying for 20 or 40 hours/week?</strong>
                  </li>
                </ol>
                <div className="mx-0 mt-6 mb-4 border-l-3 border-coral-dark bg-soft px-5 py-4">
                  <h3 className="mx-0 mt-0 mb-2 font-body text-base leading-snug tracking-normal normal-case">
                    Hiring process
                  </h3>
                  <p className="m-0! font-medium">
                    Application → 15-minute interview → 1-hour practical
                    exercise → offer
                  </p>
                </div>
                <p>We may not be able to reply to every application.</p>
              </div>
              <ActionLink
                className="mt-7 print:hidden"
                variant="primary"
                href="mailto:rohan@sapiensfirst.org?subject=AI-Native%20Builder"
              >
                Email your application →
              </ActionLink>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
