import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "Learn how Sapiens First uses your email address for updates, and how to opt out or request deletion.",
  path: "/privacy",
});

export default function Page() {
  return (
    <div className="route-root route-privacy">
      <main className="route-privacy">
        <Container>
          <div className="privacy-wrap mx-auto my-0 flex max-w-2xl flex-col gap-10 pt-24 pr-0 pb-28 pl-0 max-sm:pt-20 max-sm:pr-0 max-sm:pb-20 max-sm:pl-0">
            <h1 className="privacy-heading font-display text-5xl leading-none font-extrabold tracking-tight uppercase sm:text-6xl lg:text-8xl">
              Privacy
            </h1>
            <p className="privacy-text text-lg leading-relaxed">
              We collect your email address when you sign up. We use it to send
              you updates about Sapiens First — actions, calls, and news. We
              don&apos;t sell it, share it, or do anything sketchy with it. To
              opt out or request deletion, email{" "}
              <a href="mailto:rohan@sapiensfirst.org">rohan@sapiensfirst.org</a>
              .
            </p>
            <p className="privacy-cookies border-t border-solid border-t-line pt-4 text-sm leading-relaxed text-ink">
              We do not use cookies or tracking software on this website.
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
