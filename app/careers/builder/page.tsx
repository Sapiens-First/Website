import { ActionLink } from "@/components/ui/Action";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI-Native Builder (Contract) — Careers — Sapiens First",
  description:
    "Sapiens First is hiring an AI-native builder on a paid contract to turn messy organizational problems into useful software, automations, and systems. Remote, India preferred.",
  alternates: { canonical: "/careers/builder" },
  openGraph: {
    title: "AI-Native Builder (Contract) — Careers — Sapiens First",
    description:
      "Sapiens First is hiring an AI-native builder on a paid contract to turn messy organizational problems into useful software, automations, and systems. Remote, India preferred.",
    url: "/careers/builder",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-builder">
      <main className="job-page route-builder mx-auto w-full max-w-6xl px-5 pt-12 pb-20 max-sm:pt-7 max-sm:pb-14">
        <Link
          className="job-back items-center gap-2 mb-8 text-lg leading-normal"
          href="/careers"
        >
          <span aria-hidden="true">{"←"}</span>
          <span className="job-back-label underline underline-offset-4">
            {"All careers"}
          </span>
        </Link>
        <article>
          <header className="job-header pb-8 mb-8 border-b border-solid border-b-rule max-w-3xl ml-72 max-lg:ml-0">
            <h1>{"AI-Native Builder (Contract)"}</h1>
            <p className="job-meta">
              <strong>
                {"Remote · India preferred · 20 or 40 hours/week · 3 months"}
              </strong>
            </p>
            <p>
              <strong>{"₹50–70k/month for full-time"}</strong>
            </p>
            <ActionLink variant="primary" href="#apply">
              {"Apply for this role →"}
            </ActionLink>
          </header>
          <div className="job-layout grid gap-12 items-start max-lg:block">
            <aside className="job-sidebar sticky top-28 overflow-y-auto max-lg:max-h-none max-lg:overflow-visible max-lg:mb-8">
              <details
                className="job-toc max-lg:border-t max-lg:border-solid max-lg:border-t-rule max-lg:border-b max-lg:border-b-rule"
                open={true}
              >
                <summary>{"On this page"}</summary>
                <nav aria-label="Job description sections">
                  <ul>
                    <li>
                      <a href="#about-sapiens-first">{"About Sapiens First"}</a>
                    </li>
                    <li>
                      <a href="#the-role">{"About the Role"}</a>
                    </li>
                    <li>
                      <a href="#about-you">{"About You"}</a>
                    </li>
                    <li>
                      <a href="#benefits">{"Benefits"}</a>
                    </li>
                    <li>
                      <a href="#apply">{"Apply"}</a>
                    </li>
                  </ul>
                </nav>
              </details>
            </aside>
            <div className="job-content min-w-0 text-lg text-ink">
              <div className="job-description">
                <p className="job-lead">
                  {"Turn messy organizational problems into "}
                  <strong>{"useful software, automations, and systems"}</strong>
                  {
                    ". You’ll work directly with the Executive Director to identify priorities, prototype solutions, and ship tools that help a growing political movement scale."
                  }
                </p>
                <h2 id="about-sapiens-first">{"About Sapiens First"}</h2>
                <p>
                  {
                    "We’re building political power to ensure technology serves the common good. We organize people, train leaders, run campaigns, and build media and movement infrastructure."
                  }
                </p>
                <p>
                  {
                    "We work like a political campaign and a startup: a small team, fast iteration, and direct communication. Our approach draws from "
                  }
                  <a href="https://www.holacracy.org/">{"Holacracy"}</a>
                  {" and the "}
                  <a href="https://jobs.netflix.com/culture">
                    {"Netflix culture memo"}
                  </a>
                  {
                    ": clear roles, distributed authority, freedom with responsibility, candor, and continuous improvement."
                  }
                </p>
                <p>
                  {
                    "You’ll get context and ownership, with the expectation that you make decisions, surface problems early, and learn quickly. This suits people who are self-directed and comfortable with ambiguity."
                  }
                </p>
                <h2 id="the-role">{"About the Role"}</h2>
                <p>
                  {
                    "You’ll research, build, and improve solutions across organizing, campaigns, fundraising, media, and internal coordination. We take an AI-first approach (see "
                  }
                  <a href="https://block.xyz/inside/from-hierarchy-to-intelligence">
                    {"“From Hierarchy to Intelligence”"}
                  </a>
                  {") to reduce manual operations."}
                </p>
                <ul>
                  <li>
                    <strong>{"Movement infrastructure:"}</strong>
                    {
                      " Volunteer onboarding, training, events, local groups, and organizer workflows."
                    }
                  </li>
                  <li>
                    <strong>{"AI and automation:"}</strong>
                    {
                      " Connect documents, CRM data, workflows, and AI agents; automate repetitive work."
                    }
                  </li>
                  <li>
                    <strong>{"Campaigns and fundraising:"}</strong>
                    {
                      " Outreach, volunteer coordination, donor research, and follow-up."
                    }
                  </li>
                  <li>
                    <strong>{"Media tools:"}</strong>
                    {
                      " Editing, repurposing, publishing, scheduling, and analytics."
                    }
                  </li>
                </ul>
                <p>
                  {
                    "Priorities will evolve. Part of the job is noticing problems and deciding "
                  }
                  <strong>{"what’s worth building"}</strong>
                  {"."}
                </p>
                <h2 id="about-you">{"About You"}</h2>
                <ul>
                  <li>
                    <strong>{"Engineering ability:"}</strong>
                    {
                      " Build web products and work comfortably with APIs and databases."
                    }
                  </li>
                  <li>
                    <strong>{"AI fluency:"}</strong>
                    {
                      " Use AI heavily, research tools independently, and choose when to build custom software or use an existing product."
                    }
                  </li>
                  <li>
                    <strong>{"Product and design judgment:"}</strong>
                    {
                      " Clarify vague goals, narrow the scope, and ship useful, well-designed tools quickly."
                    }
                  </li>
                  <li>
                    <strong>{"Initiative and mission alignment:"}</strong>
                    {
                      " Notice problems, make sound decisions, and care about the work Sapiens First is doing."
                    }
                  </li>
                </ul>
                <p>
                  {"We value "}
                  <strong>{"what you can build"}</strong>
                  {
                    " over degrees, credentials, years of experience, or specific frameworks. Students and early-career applicants are welcome."
                  }
                </p>
                <h2 id="benefits">{"Benefits"}</h2>
                <table
                  className="job-facts text-lg leading-relaxed"
                  aria-labelledby="benefits"
                >
                  <tbody>
                    <tr>
                      <th scope="row">{"Contract"}</th>
                      <td>
                        {"Initial "}
                        <strong>{"3 months"}</strong>
                        {", at 20 or 40 hours/week."}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">{"Monthly pay"}</th>
                      <td>
                        <ul>
                          <li>
                            <strong>{"20 hours/week:"}</strong>
                            {" ₹25,000–₹35,000 (approx. $260–$365 USD)."}
                          </li>
                          <li>
                            <strong>{"40 hours/week:"}</strong>
                            {" ₹50,000–₹70,000 (approx. $520–$730 USD)."}
                          </li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">{"Location"}</th>
                      <td>{"Remote; India preferred."}</td>
                    </tr>
                    <tr>
                      <th scope="row">{"Schedule"}</th>
                      <td>
                        {
                          "Mostly flexible and asynchronous. Regular meetings (up to 3 hours/week) with staff in California."
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  {
                    "This is a young organization with less structure and room to shape how we work. You’ll gain experience across engineering, product, AI, operations, and movement-building. "
                  }
                  <strong>
                    {"A successful contract can lead to a full-time role"}
                  </strong>
                  {" with growing technical and product ownership."}
                </p>
                <h2 id="apply">{"Apply"}</h2>
                <p>
                  {"Email "}
                  <a href="mailto:rohan@sapiensfirst.org?subject=AI-Native%20Builder">
                    <strong>{"rohan@sapiensfirst.org"}</strong>
                  </a>
                  {" with the subject "}
                  <strong>{"“AI-Native Builder”"}</strong>
                  {" and answers to these four questions:"}
                </p>
                <ol className="job-questions">
                  <li>
                    <strong>{"What are 2–3 things you’ve built?"}</strong>
                    {
                      " Include links, demos, GitHub repositories, screenshots, or short explanations, and say what you personally did."
                    }
                  </li>
                  <li>
                    <strong>{"What about our mission appeals to you?"}</strong>
                    {" Under 100 words."}
                  </li>
                  <li>
                    <strong>
                      {"What do you hope to get out of this experience?"}
                    </strong>
                    {" Under 100 words."}
                  </li>
                  <li>
                    <strong>
                      {"Are you applying for 20 or 40 hours/week?"}
                    </strong>
                  </li>
                </ol>
                <div className="job-process py-4 px-5 bg-soft">
                  <h3>{"Hiring process"}</h3>
                  <p>
                    {
                      "Application → 15-minute interview → 1-hour practical exercise → offer"
                    }
                  </p>
                </div>
                <p>{"We may not be able to reply to every application."}</p>
              </div>
              <ActionLink
                className="job-bottom mt-7"
                variant="primary"
                href="mailto:rohan@sapiensfirst.org?subject=AI-Native%20Builder"
              >
                {"Email your application →"}
              </ActionLink>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
