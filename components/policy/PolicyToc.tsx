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
      if (!card.classList.contains("policy-card")) return;
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
      className={cn(className, activeId === id && "toc-active")}
      onClick={(event) => goTo(event, id)}
    >
      {title}
    </a>
  );

  return (
    <nav className="toc">
      <span className="toc-label eyebrow">Contents</span>
      {groups.map((group) => (
        <Fragment key={group.id}>
          <div className="toc-group-header">{link(group.id, group.title)}</div>
          {group.policies.map((policy) =>
            link(policy.id, policy.title, "toc-item-link"),
          )}
        </Fragment>
      ))}
    </nav>
  );
}
