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
        </div>
      </Container>
    </footer>
  );
}
