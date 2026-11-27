"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadHolderNames } from "@/lib/atlas/holders";

const HoldersContext = createContext<Record<string, string[]> | null>(null);

export function HoldersProvider({ children }: { children: ReactNode }) {
  const [holders, setHolders] = useState<Record<string, string[]> | null>(null);
  useEffect(() => {
    let current = true;
    loadHolderNames()
      .then((names) => {
        if (current) setHolders(names);
      })
      .catch(() => {
        if (current) setHolders(null);
      });
    return () => {
      current = false;
    };
  }, []);
  return (
    <HoldersContext.Provider value={holders}>
      {children}
    </HoldersContext.Provider>
  );
}

export function useHolders() {
  return useContext(HoldersContext);
}
