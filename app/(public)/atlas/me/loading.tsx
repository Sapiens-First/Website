import { Kicker } from "@/components/ui/Text";

function Card() {
  return (
    <div
      className="rounded-2xl border border-ink/14 bg-white p-[22px]"
      aria-hidden="true"
    >
      <div className="mb-3 h-3 w-24 rounded-full bg-ink/6" />
      <div className="mb-3 h-7 w-40 rounded-md bg-ink/6" />
      <div className="mb-2 h-3 w-full rounded-full bg-ink/6" />
      <div className="h-3 w-2/3 rounded-full bg-ink/6" />
    </div>
  );
}

export default function Loading() {
  return (
    <main
      className="mx-auto w-full max-w-[1200px] px-4 pt-10 pb-16 sm:px-6"
      aria-busy="true"
    >
      <Kicker className="mb-3">Atlas</Kicker>
      <h1 className="text-[40px] leading-[0.95] tracking-tight normal-case sm:text-[56px]">
        Your roles
      </h1>
      <p className="sr-only" role="status">
        Loading your roles…
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 min-[860px]:grid-cols-2">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </main>
  );
}
