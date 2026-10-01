"use client";

export default function AtlasError({ reset }: { reset: () => void }) {
  return (
    <div className="route-root route-atlas">
      <main className="atlas container">
        <section className="atlas-hero" aria-labelledby="atlas-error-title">
          <h1 id="atlas-error-title">Atlas</h1>
          <div id="atlas-error" role="alert">
            <h3>Atlas data is unavailable.</h3>
            <p>Please reload the page or download the source CSV below.</p>
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
    </div>
  );
}
