"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Cleanup = () => void;

function revealAndProgress(): Cleanup {
  const progress = document.querySelector<HTMLElement>(".progress-bar");
  const update = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", update, { passive: true });
  update();

  const reveal = document.querySelectorAll<HTMLElement>(".reveal");
  let observer: IntersectionObserver | undefined;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    reveal.forEach((element) => observer?.observe(element));
  } else {
    reveal.forEach((element) => element.classList.add("visible"));
  }
  return () => {
    window.removeEventListener("scroll", update);
    observer?.disconnect();
  };
}

function embers(): Cleanup {
  const field = document.querySelector<HTMLElement>(".ember-field");
  if (!field) return () => {};
  const colors = [
    "#ff5252",
    "#ff8080",
    "#ffbe0b",
    "#c80000",
    "#ff6b6b",
    "#ffd60a",
  ];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 174; i++) {
    const ember = document.createElement("div");
    ember.className = "ember";
    const size = 1.5 + Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = (2.2 + Math.random() * 3.52).toFixed(2);
    const delay = (-Math.random() * 7).toFixed(2);
    const peak = (0.35 + Math.random() * 0.55).toFixed(2);
    const glow = (size * 1.8).toFixed(1);
    const x = Math.random() * 100;
    const u = Math.random();
    const y = ((-0.8 + Math.sqrt(0.64 + 0.8 * u)) / 0.4) * 100;
    ember.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:${color};--ec:${color};--ed:${duration}s;--ey:${delay}s;--ep:${peak};--eg:${glow}px`;
    fragment.appendChild(ember);
  }
  field.appendChild(fragment);
  return () => field.replaceChildren();
}

function faq(): Cleanup {
  const cleanups: Cleanup[] = [];
  document.querySelectorAll<HTMLElement>(".faq-acc").forEach((group) => {
    const items = [
      ...group.querySelectorAll<HTMLDetailsElement>("details.faq-item"),
    ];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<HTMLDetailsElement, Animation>();

    function setExpanded(item: HTMLDetailsElement, next: boolean) {
      if (item.open === next) return;
      const startHeight = item.getBoundingClientRect().height;
      const previous = animations.get(item);
      if (previous) {
        previous.onfinish = null;
        previous.cancel();
        animations.delete(item);
      }
      item.open = next;
      item
        .querySelector("summary")
        ?.setAttribute("aria-expanded", String(next));
      const body = item.querySelector<HTMLElement>(".faq-body");
      if (body) body.inert = !next;
      const endHeight = item.getBoundingClientRect().height;
      if (reducedMotion.matches || !item.animate) return;
      item.open = true;
      const animation = item.animate(
        [
          {
            height: `${startHeight}px`,
            overflow: "hidden",
            boxSizing: "border-box",
          },
          {
            height: `${endHeight}px`,
            overflow: "hidden",
            boxSizing: "border-box",
          },
        ],
        { duration: 280, easing: "cubic-bezier(.2, 0, 0, 1)" },
      );
      animations.set(item, animation);
      animation.onfinish = () => {
        item.open = next;
        animations.delete(item);
      };
    }

    items.forEach((item) => {
      const summary = item.querySelector<HTMLElement>("summary");
      const body = item.querySelector<HTMLElement>(".faq-body");
      if (!summary) return;
      summary.setAttribute("aria-expanded", String(item.open));
      if (body) body.inert = !item.open;
      const click = (event: MouseEvent) => {
        if (
          event.target instanceof Element &&
          event.target.closest("a, button, input, select, textarea")
        )
          return;
        event.preventDefault();
        const next = !item.open;
        items.forEach((other) => setExpanded(other, next && other === item));
      };
      summary.addEventListener("click", click);
      cleanups.push(() => summary.removeEventListener("click", click));
    });
    const firstOpen = items.find((item) => item.open);
    items.forEach((item) => {
      if (item !== firstOpen) item.open = false;
    });
    cleanups.push(() => animations.forEach((animation) => animation.cancel()));
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function homeCarousel(): Cleanup {
  const viewport = document.querySelector<HTMLElement>(".campaign-viewport");
  const track = viewport?.querySelector<HTMLElement>(".campaign-track");
  const prev = document.querySelector<HTMLButtonElement>(".campaign-prev");
  const next = document.querySelector<HTMLButtonElement>(".campaign-next");
  if (!viewport || !track || !prev || !next) return () => {};
  const originals = [...track.querySelectorAll<HTMLElement>(".campaign-card")];
  const count = originals.length;
  if (!count) return () => {};
  originals.forEach((card) => {
    const clone = card.cloneNode(true) as HTMLElement;
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
  originals
    .slice()
    .reverse()
    .forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      track.insertBefore(clone, track.firstChild);
    });
  const cards = [...track.querySelectorAll<HTMLElement>(".campaign-card")];
  let current = count;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const center = (instant = false) => {
    const card = cards[current];
    viewport.scrollTo({
      left: card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2,
      behavior: instant ? "instant" : "smooth",
    });
  };
  const show = (direction: number) => {
    current += direction;
    if (current >= cards.length) current -= count;
    if (current < 0) current += count;
    center();
    clearTimeout(timer);
    timer = setTimeout(() => {
      while (current >= count * 2) current -= count;
      while (current < count) current += count;
      center(true);
    }, 600);
  };
  const goPrev = () => show(-1);
  const goNext = () => show(1);
  const recenter = () => center(true);
  prev.addEventListener("click", goPrev);
  next.addEventListener("click", goNext);
  window.addEventListener("resize", recenter);
  requestAnimationFrame(recenter);
  return () => {
    prev.removeEventListener("click", goPrev);
    next.removeEventListener("click", goNext);
    window.removeEventListener("resize", recenter);
    clearTimeout(timer);
    cards
      .filter((card) => !originals.includes(card))
      .forEach((card) => card.remove());
  };
}

function aboutCycle(): Cleanup {
  const nodes = [
    ...document.querySelectorAll<HTMLButtonElement>(".cycle-node"),
  ];
  const activate = (step: string | null) =>
    nodes.forEach((node) => {
      const active = node.dataset.step === step;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
    });
  const cleanups = nodes.map((node) => {
    const enter = () => activate(node.dataset.step ?? null);
    const leave = () => activate(null);
    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);
    node.addEventListener("focus", enter);
    node.addEventListener("click", enter);
    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
      node.removeEventListener("focus", enter);
      node.removeEventListener("click", enter);
    };
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function campaigns(): Cleanup {
  const root = document.querySelector<HTMLElement>("[data-campaign-accordion]");
  const panel = root?.querySelector<HTMLElement>(".campaign-panel");
  const inner = panel?.querySelector<HTMLElement>(".campaign-panel-inner");
  if (!root || !panel || !inner) return () => {};
  const tabs = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-campaign-trigger]"),
  ];
  const contents = [...panel.querySelectorAll<HTMLElement>(".campaign-body")];
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cleanups = tabs.map((tab) => {
    const click = () => {
      clearTimeout(timer);
      const shouldActivate = !tab.classList.contains("is-active");
      tabs.forEach((item) => {
        const active = item === tab && shouldActivate;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-expanded", String(active));
      });
      const show = () => {
        tab.insertAdjacentElement("afterend", panel);
        contents.forEach((content) => {
          content.hidden = content.id !== tab.dataset.campaignTarget;
        });
        panel.classList.add("is-open");
        requestAnimationFrame(() => inner.classList.remove("is-fading"));
      };
      if (!shouldActivate) panel.classList.remove("is-open");
      else if (panel.classList.contains("is-open")) {
        inner.classList.add("is-fading");
        timer = setTimeout(show, 150);
      } else show();
    };
    tab.addEventListener("click", click);
    return () => tab.removeEventListener("click", click);
  });
  return () => {
    clearTimeout(timer);
    cleanups.forEach((cleanup) => cleanup());
  };
}

function share(): Cleanup {
  const url = `${window.location.origin}/join`;
  const text =
    "Help build political power so technology serves the common good. Get involved with Sapiens First: ";
  const display = document.getElementById("share-url-display");
  const x = document.querySelector<HTMLAnchorElement>("#share-x");
  const fb = document.querySelector<HTMLAnchorElement>("#share-fb");
  const wa = document.querySelector<HTMLAnchorElement>("#share-wa");
  const copy = document.querySelector<HTMLButtonElement>("#copy-link");
  if (display) display.textContent = url.replace(/^https?:\/\//, "");
  if (x)
    x.href = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  if (fb)
    fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if (wa)
    wa.href = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const click = async () => {
    try {
      await navigator.clipboard.writeText(url);
      copy?.classList.add("copied");
      timer = setTimeout(() => copy?.classList.remove("copied"), 2000);
    } catch {
      /* Clipboard access may be unavailable. */
    }
  };
  copy?.addEventListener("click", click);
  return () => {
    copy?.removeEventListener("click", click);
    clearTimeout(timer);
  };
}

function builderToc(): Cleanup {
  const toc = document.querySelector<HTMLDetailsElement>(".job-toc");
  const headings = [
    ...document.querySelectorAll<HTMLElement>(".job-description h2"),
  ];
  if (!toc || !headings.length) return () => {};
  const desktop = window.matchMedia("(min-width: 1101px)");
  const links = [...toc.querySelectorAll<HTMLAnchorElement>("li a")];
  const sync = () => {
    toc.open = desktop.matches;
  };
  const update = () => {
    const offset =
      parseFloat(getComputedStyle(headings[0]).scrollMarginTop) + 2;
    let current: HTMLElement | undefined;
    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= offset) current = heading;
    });
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2
    )
      current = headings.at(-1);
    links.forEach((link) => {
      if (current && link.hash === `#${current.id}`)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const click = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    if (!desktop.matches) {
      toc.classList.add("is-navigating");
      toc.open = false;
      requestAnimationFrame(() => toc.classList.remove("is-navigating"));
    }
    const target = document.getElementById(link.hash.slice(1));
    target?.setAttribute("tabindex", "-1");
    target?.focus({ preventScroll: true });
  };
  sync();
  update();
  desktop.addEventListener("change", sync);
  toc.addEventListener("click", click);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    desktop.removeEventListener("change", sync);
    toc.removeEventListener("click", click);
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

export default function PageInteractions() {
  const path = usePathname();
  useEffect(() => {
    document.body.classList.toggle("print-job", path === "/careers/builder");
    const cleanups: Cleanup[] = [revealAndProgress(), faq(), embers()];
    if (path === "/") cleanups.push(homeCarousel());
    if (path === "/about") cleanups.push(aboutCycle());
    if (path === "/campaigns") cleanups.push(campaigns());
    if (path === "/join") cleanups.push(share());
    if (path === "/careers/builder") cleanups.push(builderToc());
    return () => {
      document.body.classList.remove("print-job");
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [path]);
  return null;
}
