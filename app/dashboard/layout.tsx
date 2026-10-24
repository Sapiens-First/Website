import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Action";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Container width="content">
        <div className="flex flex-wrap items-center justify-between gap-5 border-b-2 border-ink py-5">
          <nav
            aria-label="Member account"
            className="flex flex-wrap gap-6 font-bold"
          >
            <Link href="/dashboard" className="underline underline-offset-4">
              Account overview
            </Link>
            <Link
              href="/dashboard/profile"
              className="underline underline-offset-4"
            >
              Edit profile
            </Link>
          </nav>
          <form action={signOut}>
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      </Container>
      {children}
    </>
  );
}
