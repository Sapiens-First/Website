"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadHolderNames } from "@/lib/atlas/holders";

type HolderSession = {
  signedIn: boolean;
  names: Record<string, string[]> | null;
};

const empty: HolderSession = { signedIn: false, names: null };
const HoldersContext = createContext<HolderSession>(empty);

export function HoldersProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<HolderSession>(empty);
  useEffect(() => {
    let current = true;
    loadHolderNames()
      .then((next) => {
        if (current) setSession(next);
      })
      .catch(() => {
        if (current) setSession(empty);
      });
    return () => {
      current = false;
    };
  }, []);
  return (
    <HoldersContext.Provider value={session}>{children}</HoldersContext.Provider>
  );
}

export function useHolderSession() {
  return useContext(HoldersContext);
}

export function useHolders() {
  return useContext(HoldersContext).names;
}

export function AtlasRolesLink() {
  const { signedIn } = useHolderSession();
  return (
    <a
      href="/atlas/me"
      className="inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-2"
    >
      {signedIn ? "My roles" : "Sign in to see your roles"} →
    </a>
  );
}
