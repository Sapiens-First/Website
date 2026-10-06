"use client";

import AtlasErrorView from "@/components/AtlasError";

export default function AtlasError({ reset }: { reset: () => void }) {
  return <AtlasErrorView reset={reset} />;
}
