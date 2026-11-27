"use client";

import { useRouter } from "next/navigation";
import { Kicker } from "@/components/ui/Text";

export default function MyRolesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-10 pb-16 sm:px-6">
      <Kicker className="mb-3">Atlas</Kicker>
      <h1 className="mb-8 text-[40px] leading-[0.95] tracking-tight normal-case sm:text-[56px]">
        Your roles
      </h1>
      <div
        role="alert"
        className="max-w-[640px] rounded-2xl border border-coral-dark/35 bg-coral/8 p-6"
      >
        <p className="m-0 font-semibold text-ink">
          We couldn&apos;t load your roles.
        </p>
        <p className="mt-2 mb-4 text-sm text-ink">
          Something went wrong on our side. Your roles haven&apos;t changed.
        </p>
        <button
          type="button"
          onClick={() => {
            router.refresh();
            reset();
          }}
          className="cursor-pointer rounded-full border border-ink/22 bg-white px-3 py-1.5 text-[13px] font-semibold"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
