import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  SubtleHome,
  previewOptions,
  type PreviewOption,
} from "@/components/preview/SubtleHome";

export const metadata: Metadata = {
  title: "Homepage preview",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return previewOptions.map((o) => ({ option: o.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ option: string }>;
}) {
  const { option } = await params;
  if (!previewOptions.some((o) => o.id === option)) notFound();
  return <SubtleHome option={option as PreviewOption} />;
}
