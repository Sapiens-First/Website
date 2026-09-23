import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Privacy — Sapiens First",
  description:
    "Learn how Sapiens First uses your email address for updates, and how to opt out or request deletion.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy — Sapiens First",
    description:
      "Learn how Sapiens First uses your email address for updates, and how to opt out or request deletion.",
    url: "/privacy",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-privacy">
      <main className="route-privacy">
        <div className="container">
          <div className="privacy-wrap">
            <h1 className="privacy-heading">{"Privacy"}</h1>
            <p className="privacy-text">
              {
                "\n          We collect your email address when you sign up. We use it to send you updates about Sapiens First — actions, calls, and news. We don't sell it, share it, or do anything sketchy with it. To opt out or request deletion, email "
              }
              <a href="mailto:rohan@sapiensfirst.org">
                {"rohan@sapiensfirst.org"}
              </a>
              {".\n        "}
            </p>
            <p className="privacy-cookies">
              {
                "\n          We do not use cookies or tracking software on this website.\n        "
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
