"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AtlasLookups } from "@/lib/atlas/model";

const AtlasLookupsContext = createContext<AtlasLookups | null>(null);

export function AtlasLookupsProvider({
  value,
  children,
}: {
  value: AtlasLookups;
  children: ReactNode;
}) {
  return (
    <AtlasLookupsContext.Provider value={value}>
      {children}
    </AtlasLookupsContext.Provider>
  );
}

export function useAtlasLookups() {
  const value = useContext(AtlasLookupsContext);
  if (!value) throw new Error("Atlas lookup context is missing.");
  return value;
}
