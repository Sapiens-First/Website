"use client";

export default function AtlasError({ reset }: { reset: () => void }) {
  return (
    <>
      <main className={"relative z-2 mx-auto w-full max-w-7xl px-3 sm:px-6"}>
        <section
          className="max-w-2xl border-b-2 border-ink pt-20 pb-10 max-sm:pt-12 max-sm:pb-7"
          aria-labelledby="atlas-error-title"
        >
          <h1
            id="atlas-error-title"
            className="mb-3.5 max-w-xl text-4xl normal-case sm:text-5xl lg:text-6xl"
          >
            Atlas
          </h1>
          <div
            id="atlas-error"
            className="rounded-lg border border-rule bg-soft p-7"
            role="alert"
          >
            <h3 className="mb-2.5 text-xl">Atlas data is unavailable.</h3>
            <p className="text-sm leading-relaxed">
              Please reload the page or download the source CSV below.
            </p>
            <button type="button" onClick={reset}>
              Try again
            </button>
            <p>
              <a href="/data/atlas/governance.csv" download>
                Download governance CSV ↓
              </a>
            </p>
            <p>
              <a href="/data/atlas/domains.csv" download>
                Download domains CSV ↓
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
