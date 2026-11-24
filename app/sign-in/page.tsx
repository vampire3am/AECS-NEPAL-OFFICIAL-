import Link from "next/link";
import { StaffSignIn } from "@/components/staff-sign-in";
import { Check, ArrowUpRight } from "lucide-react";
export const metadata = {
  title: "Sign in to My AECS",
  robots: { index: false, follow: false },
};
export default function SignIn() {
  return (
    <section className="sign-in-layout shell">
      <StaffSignIn student />
      <aside>
        <h2>
          Your journey.
          <br />A little more
          <br />
          <span>organised.</span>
        </h2>
        <p>
          Keep the decisions, documents and conversations that matter in one
          place.
        </p>
        <ul>
          {[
            "A study plan you can revisit",
            "Application updates from AECS",
            "Private documents and feedback",
            "Appointments and messages",
          ].map((t) => (
            <li key={t}>
              <Check size={18} />
              {t}
            </li>
          ))}
        </ul>
        <Link href="/plan" className="text-link">
          Explore without an account <ArrowUpRight size={18} />
        </Link>
      </aside>
    </section>
  );
}
