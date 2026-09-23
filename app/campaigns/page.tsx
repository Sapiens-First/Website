import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Campaigns for AI Accountability — Sapiens First",
  description:
    "Sapiens First's active campaigns to protect civil liberties in the age of AI.",
  alternates: { canonical: "/campaigns" },
  openGraph: {
    title: "Campaigns for AI Accountability — Sapiens First",
    description:
      "Sapiens First's active campaigns to protect civil liberties in the age of AI.",
    url: "/campaigns",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-campaigns">
      <div className="progress-bar"></div>

      <div className="page-hero">
        <div className="container">
          <span className="label">{"Take action"}</span>
          <h1 className="page-title">
            {"Our "}
            <span className="underline blue">{"Campaigns."}</span>
          </h1>
        </div>
      </div>
      <main className="route-campaigns">
        <section className="section section-compact">
          <div className="container">
            <p className="body-large reveal">
              {
                "\n          Our long-term goal is to build movement power. Having intermediary objectives helps structure activities, allowing us to build leaders and expand movement participation.\n        "
              }
            </p>
            <p className="body-large reveal">
              {"\n          These campaigns are drawn from our "}
              <a
                href="/policy"
                className="text-link"
                style={
                  {
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: "inherit",
                  } as React.CSSProperties
                }
              >
                {"policies"}
              </a>
              {
                ". They are intended to be achievable, so that we have momentum in the movement. Therefore, they are chosen to be either incremental or symbolic.\n        "
              }
            </p>
            <p className="body-large reveal">
              {
                "\n          Campaigns also help us win the support of institutions, like politicians, other advocacy organizations, and the media. This, however, is secondary to the objective of getting lots of people involved in the fight for democracy.\n        "
              }
            </p>
          </div>
        </section>

        <section className="section" id="campaigns">
          <div className="container">
            <div className="section-label reveal">
              <span className="title">{"Current Campaigns"}</span>
            </div>
            <div className="campaign-grid" data-campaign-accordion="">
              <button
                className="campaign-tab accordion-toggle reveal"
                type="button"
                aria-expanded="false"
                aria-controls="campaign-shared-panel"
                data-campaign-trigger=""
                data-campaign-target="campaign-content-stop-1984"
              >
                <span className="campaign-header">
                  <span className="card-title">{"Stop 1984"}</span>
                  <span className="campaign-objective">
                    {"Ban AI-enabled mass surveillance."}
                  </span>
                </span>
                <span
                  className="campaign-chevron accordion-chevron"
                  aria-hidden="true"
                ></span>
              </button>
              <button
                className="campaign-tab accordion-toggle reveal reveal-d1"
                type="button"
                aria-expanded="false"
                aria-controls="campaign-shared-panel"
                data-campaign-trigger=""
                data-campaign-target="campaign-content-no-killer-robots"
              >
                <span className="campaign-header">
                  <span className="card-title">{"No Killer Robots"}</span>
                  <span className="campaign-objective">
                    {"Regulate autonomous weapons in the military."}
                  </span>
                </span>
                <span
                  className="campaign-chevron accordion-chevron"
                  aria-hidden="true"
                ></span>
              </button>
              <button
                className="campaign-tab accordion-toggle reveal reveal-d2"
                type="button"
                aria-expanded="false"
                aria-controls="campaign-shared-panel"
                data-campaign-trigger=""
                data-campaign-target="campaign-content-save-our-future"
              >
                <span className="campaign-header">
                  <span className="card-title">{"AI Freeze"}</span>
                  <span className="campaign-objective">
                    {
                      "Negotiate a coordinated slowdown on the development of artificial intelligence."
                    }
                  </span>
                </span>
                <span
                  className="campaign-chevron accordion-chevron"
                  aria-hidden="true"
                ></span>
              </button>
              <div
                className="campaign-panel accordion-panel"
                id="campaign-shared-panel"
              >
                <div className="campaign-panel-inner accordion-panel-inner">
                  <div
                    className="campaign-body"
                    id="campaign-content-stop-1984"
                    hidden={true}
                  >
                    <p className="campaign-desc card-text">
                      {
                        "\n                  Mass surveillance is a threat to our civil liberties and free speech. AI-enabled surveillance could mean unprecedented concentration of power. We believe that a variety of coalition groups and civil society organizations could support a ban on AI-enabled mass surveillance.\n                "
                      }
                    </p>
                    <span className="eyebrow eyebrow--accent campaign-metrics-label">
                      {"Metrics"}
                    </span>
                    <ul className="campaign-list">
                      <li>
                        {
                          "Get individuals and organizations to sign onto our open letter against AI-enabled mass surveillance (forthcoming)"
                        }
                      </li>
                      <li>
                        {
                          "Get city councils to do resolutions against AI-enabled mass surveillance"
                        }
                      </li>
                    </ul>
                    <p className="campaign-note card-text">
                      {"Resources: forthcoming"}
                    </p>
                  </div>
                  <div
                    className="campaign-body"
                    id="campaign-content-no-killer-robots"
                    hidden={true}
                  >
                    <p className="campaign-desc card-text">
                      {
                        "\n                  Militaries around the world are racing to deploy autonomous weapons that can select and kill targets without human oversight. However, most people are unaware this is already happening, or don't grasp how quickly it's becoming normalized. Increasing awareness of this threat expands the Overton window, and builds political will for regulation.\n                "
                      }
                    </p>
                    <span className="eyebrow eyebrow--accent campaign-metrics-label">
                      {"Metrics"}
                    </span>
                    <ul className="campaign-list">
                      <li>
                        {
                          "Get mainstream media to write positively about activism against autonomous weapons"
                        }
                      </li>
                      <li>{"Increase awareness through social media"}</li>
                    </ul>
                    <p className="campaign-note card-text">
                      {"Resources: forthcoming"}
                    </p>
                  </div>
                  <div
                    className="campaign-body"
                    id="campaign-content-save-our-future"
                    hidden={true}
                  >
                    <p className="campaign-desc card-text">
                      {
                        "\n                  Experts in artificial intelligence, including those at frontier AI labs, have warned for years about the dangers of superintelligence. However, most people are unaware of these risks, or are not acting appropriately given their severity. Increasing awareness of existential risk expands the Overton window, and builds political will for AI safety.\n                "
                      }
                    </p>
                    <span className="eyebrow eyebrow--accent campaign-metrics-label">
                      {"Metrics"}
                    </span>
                    <ul className="campaign-list">
                      <li>
                        {
                          "Get mainstream media to write positively about activism against existential risk posed by AI"
                        }
                      </li>
                      <li>{"Increase awareness through social media"}</li>
                    </ul>
                    <p className="campaign-note card-text">
                      {"Resources: forthcoming"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
