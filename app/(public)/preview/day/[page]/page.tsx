import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { DayPreview } from "@/components/preview/DayPreview";
import Home from "@/app/(public)/page";
import About from "@/app/(public)/about/page";
import Fellowship from "@/app/(public)/fellowship/page";
import HumanCharter from "@/app/(public)/human-charter/page";
import Policy from "@/app/(public)/policy/page";
import Careers from "@/app/(public)/careers/page";

export const metadata: Metadata = {
  title: "Backdrop preview",
  robots: { index: false, follow: false },
};

/** Real pages shown behind the "day after dawn" backdrop. */
const pages: { id: string; name: string; Page: ComponentType }[] = [
  { id: "home", name: "Home", Page: Home },
  { id: "about", name: "About", Page: About },
  { id: "fellowship", name: "Fellowship", Page: Fellowship },
  { id: "human-charter", name: "Charter", Page: HumanCharter },
  { id: "policy", name: "Policy", Page: Policy },
  { id: "careers", name: "Careers", Page: Careers },
];

export function generateStaticParams() {
  return pages.map((p) => ({ page: p.id }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { page } = await params;
  const query = await searchParams;
  const initial = Object.fromEntries(
    Object.entries(query).flatMap(([k, v]) =>
      typeof v === "string" ? [[k, v]] : [],
    ),
  );
  const current = pages.find((p) => p.id === page);
  if (!current) notFound();
  return (
    <DayPreview
      page={page}
      initial={initial}
      pages={pages.map(({ id, name }) => ({ id, name }))}
    >
      <current.Page />
    </DayPreview>
  );
}
