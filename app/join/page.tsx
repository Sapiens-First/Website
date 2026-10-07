import { pageMetadata, site } from "@/lib/site";
import { ActionLink } from "@/components/ui/Action";
import CopyLinkButton from "@/components/join/CopyLinkButton";
import { Container } from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export const metadata = pageMetadata({
  title: "Join",
  description:
    "We’re building our membership program. Leave your email and we’ll be in touch to help you find a local community group.",
  path: "/join",
});

const shareUrl = `${site.url}/join`;
const shareText =
  "Help build political power so technology serves the common good. Get involved with Sapiens First: ";
const shareLinks = {
  x: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
};

export default function Page() {
  return (
    <div className="route-root route-join">
      <main className="route-join">
        <section
          className="join-hero border-b border-solid border-b-rule px-0 py-16 max-sm:px-0 max-sm:py-9"
          aria-labelledby="join-heading"
        >
          <Container className="join-grid grid grid-cols-2 items-center gap-16 max-lg:gap-8 max-sm:grid-cols-1 max-sm:gap-7">
            <div className="join-copy">
              <div className="kicker">Join Sapiens First</div>
              <h1 id="join-heading">
                Build power.
                <br />
                Put people <span className="ink-underline yellow">first.</span>
              </h1>
              <p id="join-note">
                We’ll be in touch to help you find a local community group and
                get involved.
              </p>
              <div className="join-signup">
                <label htmlFor="join-email">Your email</label>
                <SignupForm
                  interest="membership"
                  buttonText="Keep me posted →"
                  id="signup"
                  inputId="join-email"
                  describedBy="join-note"
                />
                <p className="join-note">
                  <Link href="/privacy">Privacy policy</Link>
                </p>
                <noscript>Please enable JavaScript to send this form.</noscript>
              </div>
            </div>
            <figure className="join-photo m-0">
              <Image
                src="/assets/image.png"
                alt="People raising clasped hands together at a demonstration"
                width={1024}
                height={683}
                sizes="(max-width: 600px) calc(100vw - 24px), 50vw"
                preload
              />
            </figure>
          </Container>
        </section>
        <section
          className="join-share pt-10 pr-0 pb-14 pl-0"
          aria-labelledby="share-heading"
        >
          <Container>
            <h2 id="share-heading">Bring a friend.</h2>
            <div className="share-buttons">
              <ActionLink
                variant="outline"
                href={shareLinks.x}
                target="_blank"
                rel="noopener"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                X / Twitter
              </ActionLink>
              <ActionLink
                variant="outline"
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Facebook
              </ActionLink>
              <ActionLink
                variant="outline"
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                </svg>
                WhatsApp
              </ActionLink>
            </div>
            <div className="share-url-row">
              <div className="share-url">
                {shareUrl.replace("https://", "")}
              </div>
              <CopyLinkButton url={shareUrl} />
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
