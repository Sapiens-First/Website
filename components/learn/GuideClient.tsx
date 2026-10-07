"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useActiveSection } from "@/lib/useActiveSection";

type TocItem = { id: string; text: string };
type TocSection = { heading: TocItem; children: TocItem[] };
type TocGroup = { header: TocItem | null; sections: TocSection[] };
type FontStyle = { size?: number; weight?: number; italic?: boolean };

const allowedTags = new Set([
  "A",
  "B",
  "BLOCKQUOTE",
  "BR",
  "CAPTION",
  "CODE",
  "DD",
  "DIV",
  "DL",
  "DT",
  "EM",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HR",
  "I",
  "IMG",
  "LI",
  "OL",
  "P",
  "S",
  "SMALL",
  "SPAN",
  "STRONG",
  "SUB",
  "SUP",
  "TABLE",
  "TBODY",
  "TD",
  "TFOOT",
  "TH",
  "THEAD",
  "TR",
  "U",
  "UL",
]);
const blockedTags = new Set([
  "AUDIO",
  "BUTTON",
  "EMBED",
  "FORM",
  "IFRAME",
  "INPUT",
  "MATH",
  "OBJECT",
  "SCRIPT",
  "SOURCE",
  "STYLE",
  "SVG",
  "TEMPLATE",
  "VIDEO",
]);

function fontStyles(css: string): Record<string, FontStyle> {
  const map: Record<string, FontStyle> = {};
  const expression = /\.([\w-]+)\s*\{([^}]*)\}/g;
  for (const match of css.matchAll(expression)) {
    const style: FontStyle = {};
    const size = match[2].match(/font-size:\s*([\d.]+)pt/);
    const weight = match[2].match(/font-weight:\s*(\d+|bold)/);
    if (size) style.size = Number(size[1]);
    if (weight) style.weight = weight[1] === "bold" ? 700 : Number(weight[1]);
    if (/font-style:\s*italic/.test(match[2])) style.italic = true;
    if (Object.keys(style).length) map[match[1]] = style;
  }
  return map;
}

function mergedStyle(
  classes: DOMTokenList,
  map: Record<string, FontStyle>,
): FontStyle {
  return [...classes].reduce<FontStyle>(
    (result, name) => Object.assign(result, map[name]),
    {},
  );
}

function sanitizeNode(node: Node): void {
  for (const child of [...node.childNodes]) {
    if (!(child instanceof Element)) continue;
    if (blockedTags.has(child.tagName)) {
      child.remove();
      continue;
    }
    sanitizeNode(child);
    if (!allowedTags.has(child.tagName)) {
      child.replaceWith(...child.childNodes);
      continue;
    }

    for (const attribute of [...child.attributes]) {
      const name = attribute.name.toLowerCase();
      const allowed =
        (child.tagName === "A" && name === "href") ||
        (child.tagName === "IMG" && ["src", "alt", "title"].includes(name)) ||
        (["TD", "TH"].includes(child.tagName) &&
          ["colspan", "rowspan"].includes(name)) ||
        (["TD", "TH"].includes(child.tagName) &&
          name === "scope" &&
          ["row", "col", "rowgroup", "colgroup"].includes(attribute.value));
      if (!allowed) child.removeAttribute(attribute.name);
    }

    if (child.tagName === "A") {
      const href = child.getAttribute("href") ?? "";
      if (!/^(https?:|mailto:|#)/i.test(href)) child.removeAttribute("href");
      else if (!href.startsWith("#")) {
        child.setAttribute("target", "_blank");
        child.setAttribute("rel", "noopener noreferrer");
      }
    } else if (child.tagName === "IMG") {
      const src = child.getAttribute("src") ?? "";
      if (!/^https?:\/\//i.test(src)) child.remove();
      else child.setAttribute("loading", "lazy");
    }
  }
}

function processGoogleDoc(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  const map = fontStyles(doc.querySelector("style")?.textContent ?? "");

  const lists = [...body.querySelectorAll("ul, ol")];
  for (let i = lists.length - 1; i >= 0; i--) {
    const match = lists[i].className.match(/lst-kix_(\w+)-(\d+)/);
    if (!match || Number(match[2]) === 0) continue;
    for (let j = i - 1; j >= 0; j--) {
      const parent = lists[j].className.match(/lst-kix_(\w+)-(\d+)/);
      if (
        parent?.[1] === match[1] &&
        Number(parent[2]) === Number(match[2]) - 1
      ) {
        const last = lists[j].lastElementChild;
        if (last?.tagName === "LI") last.appendChild(lists[i]);
        break;
      }
    }
  }

  body.querySelectorAll("p").forEach((paragraph) => {
    if (paragraph.classList.contains("title")) {
      const heading = doc.createElement("h1");
      heading.innerHTML = paragraph.innerHTML;
      paragraph.replaceWith(heading);
      return;
    }
    let maxSize = 0;
    let allBold = true;
    let hasSpans = false;
    paragraph.querySelectorAll("span").forEach((span) => {
      if (!span.textContent?.trim()) return;
      hasSpans = true;
      const style = mergedStyle(span.classList, map);
      if (style.size && style.size > maxSize) maxSize = style.size;
      if (!style.weight || style.weight < 600) allBold = false;
    });
    const tag =
      maxSize >= 20 ? "h2" : maxSize >= 13 && hasSpans && allBold ? "h3" : null;
    if (tag) {
      const heading = doc.createElement(tag);
      heading.innerHTML = paragraph.innerHTML;
      paragraph.replaceWith(heading);
    }
  });

  body.querySelectorAll("p span, li span").forEach((span) => {
    if (!span.textContent?.trim()) return;
    const style = mergedStyle(span.classList, map);
    if (!style.italic && (style.weight ?? 0) < 600) return;
    let inner = span.innerHTML;
    if (style.italic) inner = `<em>${inner}</em>`;
    if ((style.weight ?? 0) >= 600) inner = `<strong>${inner}</strong>`;
    const replacement = doc.createElement("span");
    replacement.innerHTML = inner;
    span.replaceWith(...replacement.childNodes);
  });

  sanitizeNode(body);
  let previousBlank = false;
  body.querySelectorAll("p").forEach((paragraph) => {
    const blank = !paragraph.textContent?.trim();
    if (blank && previousBlank) paragraph.remove();
    previousBlank = blank;
  });
  return body.innerHTML;
}

function buildGroups(body: HTMLElement): TocGroup[] {
  const seen = new Set<string>();
  const groups: TocGroup[] = [];
  let currentGroup: TocGroup | null = null;
  let currentSection: TocSection | null = null;
  body.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((heading, index) => {
    const text = heading.textContent?.trim() ?? "";
    const base =
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `s${index}`;
    heading.id = seen.has(base) ? `${base}-${index}` : base;
    seen.add(base);
    const item = { id: heading.id, text };
    if (heading.tagName === "H1") {
      currentGroup = { header: item, sections: [] };
      currentSection = null;
      groups.push(currentGroup);
    } else if (heading.tagName === "H2") {
      if (!currentGroup) {
        currentGroup = { header: null, sections: [] };
        groups.push(currentGroup);
      }
      currentSection = { heading: item, children: [] };
      currentGroup.sections.push(currentSection);
    } else if (currentSection) currentSection.children.push(item);
  });
  return groups;
}

const tocLink =
  "border-0 text-ink no-underline wrap-anywhere hover:bg-brand-yellow focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue";
const tocActive = "bg-brand-yellow font-bold";
const statusBox =
  "border-2 border-ink p-8 text-left text-lg leading-relaxed tracking-normal text-ink normal-case";

export default function GuideClient() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [groups, setGroups] = useState<TocGroup[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(
          `https://docs.google.com/document/d/${site.guideDocId}/export?format=html`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Guide returned ${response.status}`);
        setHtml(processGoogleDoc(await response.text()));
      } catch (reason) {
        if (controller.signal.aborted) return;
        console.error("Guide load error:", reason);
        setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const contents = contentsRef.current;
    if (!contents) return;
    const query = window.matchMedia("(min-width: 64rem)");
    const sync = () => {
      contents.open = query.matches;
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!html || !body) return;
    setGroups(buildGroups(body));
  }, [html]);

  const ids = useMemo(
    () =>
      groups.flatMap((group) => [
        ...(group.header ? [group.header.id] : []),
        ...group.sections.flatMap((section) => [
          section.heading.id,
          ...section.children.map((child) => child.id),
        ]),
      ]),
    [groups],
  );
  const activeId = useActiveSection(ids, 110) ?? ids[0];

  function goTo(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    if (!window.matchMedia("(min-width: 64rem)").matches && contentsRef.current)
      contentsRef.current.open = false;
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const offset =
      header && getComputedStyle(header).position === "sticky"
        ? header.getBoundingClientRect().height + 24
        : 24;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  const toc = (
    <nav
      className="px-0 py-1 max-lg:mt-3 max-lg:max-h-[55dvh] max-lg:overflow-y-auto"
      aria-label="Guide contents"
    >
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.header && (
            <div className="mx-0 mt-3 mb-1.5">
              <a
                href={`#${group.header.id}`}
                className={cn(
                  tocLink,
                  "block p-2 font-display text-xl leading-tight font-extrabold uppercase",
                  activeId === group.header.id && tocActive,
                )}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(group.header!.id);
                }}
              >
                {group.header.text}
              </a>
            </div>
          )}
          {group.sections.map((section, sectionIndex) => {
            const key = `toc-${groupIndex}-${sectionIndex}`;
            const open =
              expanded[key] ||
              section.children.some((child) => child.id === activeId);
            return (
              <div key={key}>
                <div className="flex items-center">
                  {section.children.length > 0 && (
                    <button
                      className={cn(
                        "grid h-11 w-8 shrink-0 cursor-pointer place-items-center border-0 bg-none text-2xl text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue",
                        open && "rotate-90",
                      )}
                      aria-label="Toggle subsections"
                      aria-expanded={Boolean(open)}
                      aria-controls={key}
                      onClick={() =>
                        setExpanded((current) => ({ ...current, [key]: !open }))
                      }
                    >
                      ›
                    </button>
                  )}
                  <a
                    className={cn(
                      tocLink,
                      "min-w-0 flex-1 py-2.5 pr-2 text-base leading-snug",
                      section.children.length > 0 ? "pl-0" : "pl-8",
                      activeId === section.heading.id && tocActive,
                    )}
                    href={`#${section.heading.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(section.heading.id);
                    }}
                  >
                    {section.heading.text}
                  </a>
                </div>
                {section.children.length > 0 && (
                  <ul
                    className={cn(
                      "m-0 list-none pt-0 pr-0 pb-2 pl-8",
                      open ? "block" : "hidden",
                    )}
                    id={key}
                  >
                    {section.children.map((child) => (
                      <li key={child.id}>
                        <a
                          className={cn(
                            tocLink,
                            "block p-2 text-sm leading-normal",
                            activeId === child.id && tocActive,
                          )}
                          href={`#${child.id}`}
                          onClick={(event) => {
                            event.preventDefault();
                            goTo(child.id);
                          }}
                        >
                          {child.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-28 max-h-180 [scrollbar-width:thin] [scrollbar-color:var(--color-line)_transparent] overflow-y-auto pr-4 max-lg:static max-lg:max-h-none max-lg:overflow-visible max-lg:p-0 lg:col-span-3">
        <details
          className={cn(
            "group",
            "max-lg:border-2 max-lg:border-ink max-lg:bg-white max-lg:px-5 max-lg:py-4",
          )}
          open
          ref={contentsRef}
        >
          <summary className="cursor-pointer border-b-2 border-ink pb-4 font-display text-2xl leading-tight font-extrabold uppercase focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-blue max-lg:border-0 max-lg:p-0 max-lg:text-xl max-lg:group-open:border-b max-lg:group-open:border-line max-lg:group-open:pb-4">
            Contents
          </summary>
          <div id="toc-container">{toc}</div>
        </details>
      </aside>
      <div className="min-w-0 lg:col-span-9">
        <div id="doc-content">
          {error ? (
            <p className={statusBox}>
              Could not load the guide right now.{" "}
              <a
                className="text-coral-dark"
                href={`https://docs.google.com/document/d/${site.guideDocId}/edit`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Docs
              </a>
            </p>
          ) : html === null ? (
            <div className={cn(statusBox, "font-body")}>Loading guide...</div>
          ) : (
            <div
              className="doc-body"
              ref={bodyRef}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </>
  );
}
