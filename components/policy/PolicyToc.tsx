"use client";

import { Fragment, useEffect, type MouseEvent } from "react";
import { policyPillars } from "@/content/policies";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/cn";

const overview = { id: "overview", title: "Overview", policies: [] };
const groups = [overview, ...policyPillars];
const ids = groups.flatMap((group) => [
  group.id,
  ...group.policies.map((policy) => policy.id),
]);

// Opening a card collapses its sibling, so re-align once the 0.4s panel transition settles.
function scrollToCard(card: Element) {
  card.scrollIntoView({ behavior: "smooth" });
  return window.setTimeout(
    () => card.scrollIntoView({ behavior: "smooth" }),
    420,
  );
}

export default function PolicyToc() {
  const activeId = useActiveSection(ids, 110) ?? ids[0];

  useEffect(() => {
    let timer: number | undefined;
    const toggle = (event: Event) => {
      const card = event.target;
      if (!(card instanceof HTMLDetailsElement) || !card.open) return;
      if (!card.hasAttribute("data-policy-card")) return;
      window.clearTimeout(timer);
      timer = scrollToCard(card);
    };
    // `toggle` doesn't bubble, so listen in the capture phase.
    document.addEventListener("toggle", toggle, true);
    return () => {
      document.removeEventListener("toggle", toggle, true);
      window.clearTimeout(timer);
    };
  }, []);

  function goTo(event: MouseEvent, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target instanceof HTMLDetailsElement && !target.open)
      target.open = true;
    else target?.scrollIntoView({ behavior: "smooth" });
  }

  const link = (id: string, title: string, className?: string) => (
    <a
      key={id}
      href={`#${id}`}
      className={cn(
        className,
        activeId === id && "bg-brand-yellow font-semibold text-ink",
      )}
      onClick={(event) => goTo(event, id)}
    >
      {title}
    </a>
  );

  return (
    <nav className="max-lg:mb-2 max-lg:border max-lg:border-line max-lg:px-5 max-lg:pt-4 max-lg:pb-3.5">
      <span className="mb-1 block border-b border-line pb-2.5 font-body text-sm font-extrabold tracking-widest text-ink uppercase max-lg:mb-2">
        Contents
      </span>
      {groups.map((group) => (
        <Fragment key={group.id}>
          <div className="mt-4 mb-0.5 border-t border-line pt-3.5 first-of-type:mt-1.5 first-of-type:border-t-0 first-of-type:pt-0 [&_a]:block [&_a]:px-2 [&_a]:py-0.5 [&_a]:font-display [&_a]:text-sm [&_a]:font-bold [&_a]:tracking-widest [&_a]:text-ink [&_a]:uppercase [&_a]:transition-colors [&_a:hover]:text-coral-dark">
            {link(group.id, group.title)}
          </div>
          {group.policies.map((policy) =>
            link(
              policy.id,
              policy.title,
              "my-px block px-2 py-1.5 font-body text-sm leading-snug font-medium text-ink transition-colors hover:text-coral-dark max-lg:p-2 max-lg:text-base",
            ),
          )}
        </Fragment>
      ))}
    </nav>
  );
}
