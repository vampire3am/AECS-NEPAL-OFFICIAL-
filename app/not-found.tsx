import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <h1>Let’s find your way back.</h1>
      <p>This page isn’t available. Your next step is still here.</p>
      <Link href="/" className="button">
        Return to AECS
      </Link>
    </div>
  );
}

