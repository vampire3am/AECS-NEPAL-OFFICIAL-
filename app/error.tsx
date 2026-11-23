"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="not-found">
      <h1>Something didn’t load.</h1>
      <p>
        Please try again. You can also call the AECS desk on +977 970-451-8337.
      </p>
      <button className="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

