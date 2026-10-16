import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Doodle, FunLayer, Moon, Star } from "@/components/ui/Doodles";
import { footerGroups } from "@/lib/site";
import { cn } from "@/lib/cn";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-ink bg-ink pt-16 pb-7 text-xs text-white max-sm:pt-11 max-sm:pb-6">
      <FunLayer>
        <Doodle className="bottom-[14%] left-[38%] w-[34px] text-paper">
          <Moon size={34} cutY={13} />
        </Doodle>
        <Doodle className="bottom-[36%] left-[45%] w-[9px] rotate-10 text-brand-yellow">
          <Star size={9} />
        </Doodle>
        <Doodle className="bottom-[32%] left-[33%] w-[7px] -rotate-14 text-brand-yellow">
          <Star size={7} />
        </Doodle>
      </FunLayer>
      <Container>
        <div className="flex flex-wrap justify-between gap-x-14 gap-y-10 border-b border-white/22 pb-10 max-sm:flex-col max-sm:gap-7 max-sm:pb-7">
          <Link className="flex items-center gap-2.5" href="/">
            <Image
              className="block size-8"
              src="/favicons/android-chrome-192x192.png"
              alt=""
              width={32}
              height={32}
            />
            <span className="font-display text-xl font-extrabold tracking-normal text-white uppercase">
              Sapiens First
            </span>
          </Link>
          <div className="flex flex-wrap gap-14 max-sm:gap-8">
            {footerGroups.map((group) => (
              <div className="flex flex-col gap-2.5" key={group.title}>
                <span className="mb-0.5 block font-body text-sm font-black tracking-widest text-brand-yellow uppercase">
                  {group.title}
                </span>
                <div
                  className={cn(
                    "flex flex-col gap-2.5",
                    group.title === "About" &&
                      "grid grid-flow-col grid-rows-[repeat(3,auto)] gap-x-6 gap-y-2.5 max-sm:grid-flow-row max-sm:grid-rows-none",
                  )}
                >
                  {group.links.map((link) => (
                    <Link
                      className="font-body text-sm leading-normal font-bold text-white hover:text-coral"
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 text-sm max-sm:flex-col max-sm:items-start max-sm:gap-2">
          <span className="before:mr-2 before:inline-block before:size-2 before:rounded-full before:bg-coral before:content-['']">
            © {new Date().getFullYear()} Sapiens First. All rights reserved.
          </span>
          <nav aria-label="Social media" className="flex items-center gap-3">
            <Link
              href="https://www.instagram.com/sapiensfirst.global/"
              aria-label="Sapiens First on Instagram"
              className="inline-flex size-11 items-center justify-center border border-white/30 text-white transition-colors hover:border-coral hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/company/sapiens-first/"
              aria-label="Sapiens First on LinkedIn"
              className="inline-flex size-11 items-center justify-center border border-white/30 text-white transition-colors hover:border-coral hover:text-coral focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.74H4.98V9.19h2.95v9.55ZM6.45 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85h-2.95v-4.65c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.5V9.19h2.83v1.3h.04c.39-.74 1.36-1.52 2.8-1.52 3 0 3.57 1.97 3.57 4.53v5.24Z" />
              </svg>
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
