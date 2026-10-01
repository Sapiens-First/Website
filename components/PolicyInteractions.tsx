"use client";

import { useEffect } from "react";

export default function PolicyInteractions() {
  useEffect(() => {
    const content = document.getElementById("policy-content");
    const container = document.getElementById("toc-container");
    if (!content || !container) return;
    const nav = document.createElement("nav");
    nav.className = "toc";
    const label = document.createElement("span");
    label.className = "toc-label eyebrow";
    label.textContent = "Contents";
    nav.appendChild(label);

    content
      .querySelectorAll<HTMLElement>(".policy-pillar")
      .forEach((pillar) => {
        const title =
          pillar.querySelector(".section-label .title")?.textContent?.trim() ??
          "";
        const group = document.createElement("div");
        group.className = "toc-group-header";
        const groupLink = document.createElement("a");
        groupLink.href = `#${pillar.id}`;
        groupLink.textContent = title;
        group.appendChild(groupLink);
        nav.appendChild(group);
        pillar.querySelectorAll<HTMLElement>(".policy-card").forEach((card) => {
          const cardTitle = card
            .querySelector(".policy-card-title")
            ?.textContent?.trim();
          if (!cardTitle) return;
          const link = document.createElement("a");
          link.className = "toc-item-link";
          link.href = `#${card.id}`;
          link.textContent = cardTitle;
          nav.appendChild(link);
        });
      });
    container.replaceChildren(nav);

    const toggles = [
      ...content.querySelectorAll<HTMLButtonElement>(".policy-card-toggle"),
    ];
    let scrollTimer: number | undefined;
    const scrollTo = (element: Element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 100,
        behavior: "smooth",
      });
    const open = (toggle: HTMLButtonElement) => {
      toggles.forEach((other) => {
        const active = other === toggle;
        other.setAttribute("aria-expanded", String(active));
        other.nextElementSibling?.classList.toggle("is-open", active);
      });
      const card = toggle.closest(".policy-card");
      if (card) {
        if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
        scrollTo(card);
        scrollTimer = window.setTimeout(() => {
          scrollTimer = undefined;
          scrollTo(card);
        }, 420);
      }
    };
    const toggleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const toggle = event.target.closest<HTMLButtonElement>(
        ".policy-card-toggle",
      );
      if (!toggle) return;
      if (toggle.getAttribute("aria-expanded") === "true") {
        toggle.setAttribute("aria-expanded", "false");
        toggle.nextElementSibling?.classList.remove("is-open");
      } else open(toggle);
    };
    const tocClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      if (target.classList.contains("policy-card")) {
        const toggle = target.querySelector<HTMLButtonElement>(
          ".policy-card-toggle",
        );
        if (toggle) open(toggle);
      } else scrollTo(target);
    };
    content.addEventListener("click", toggleClick);
    nav.addEventListener("click", tocClick);

    const anchors = [
      ...content.querySelectorAll<HTMLElement>(".policy-pillar, .policy-card"),
    ];
    let frame = 0;
    const update = () => {
      frame = 0;
      let active = anchors[0]?.id;
      for (const anchor of anchors) {
        if (anchor.getBoundingClientRect().top <= 110) active = anchor.id;
        else break;
      }
      nav.querySelector(".toc-active")?.classList.remove("toc-active");
      if (active)
        nav
          .querySelector(`a[href="#${CSS.escape(active)}"]`)
          ?.classList.add("toc-active");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      content.removeEventListener("click", toggleClick);
      nav.removeEventListener("click", tocClick);
      window.removeEventListener("scroll", schedule);
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
      container.replaceChildren();
    };
  }, []);
  return null;
}
