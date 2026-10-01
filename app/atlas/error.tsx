"use client";

import AtlasErrorView from "@/components/AtlasError";
import "./page.css";

export default function AtlasError({ reset }: { reset: () => void }) {
  return <AtlasErrorView reset={reset} />;
}
