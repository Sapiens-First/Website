import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";

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
        <Container>
          <div className="privacy-wrap max-w-2xl my-0 mx-auto pt-24 pr-0 pb-28 pl-0 flex flex-col gap-10 max-sm:pt-20 max-sm:pr-0 max-sm:pb-20 max-sm:pl-0">
            <h1 className="privacy-heading text-5xl sm:text-6xl lg:text-8xl font-display font-extrabold leading-none tracking-tight uppercase">
              {"Privacy"}
            </h1>
            <p className="privacy-text text-lg leading-relaxed">
              {
                "We collect your email address when you sign up. We use it to send you updates about Sapiens First — actions, calls, and news. We don't sell it, share it, or do anything sketchy with it. To opt out or request deletion, email "
              }
              <a href="mailto:rohan@sapiensfirst.org">
                {"rohan@sapiensfirst.org"}
              </a>
              {"."}
            </p>
            <p className="privacy-cookies text-sm leading-relaxed text-ink pt-4 border-t border-solid border-t-line">
              {"We do not use cookies or tracking software on this website."}
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
