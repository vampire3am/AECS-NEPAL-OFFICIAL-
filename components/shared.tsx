import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Check,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { business } from "@/lib/content";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-brand">
              AECS NEPAL<span>Good guidance. A clearer next step.</span>
            </Link>
            <p>
              Study-abroad counselling, English preparation and exam booking,
              together in Bagbazar.
            </p>
          </div>
          <div>
            <h2>Find your way</h2>
            <Link href="/destinations">Study destinations</Link>
            <Link href="/courses">English preparation</Link>
            <Link href="/pricing">Fees & packages</Link>
            <Link href="/plan">My study plan</Link>
            <Link href="/guides">Student guides</Link>
            <Link href="/about">Meet AECS</Link>
            <Link href="/my-aecs">My AECS workspace</Link>
            <Link href="/nepali" lang="ne">
              नेपालीमा जानकारी
            </Link>
          </div>
          <div>
            <h2>Visit or get in touch</h2>
            <a href={business.map}>
              <MapPin size={17} />
              {business.address}
            </a>
            <a href={"tel:" + business.tel}>
              <Phone size={17} />
              {business.phone}
            </a>
            <a href={"mailto:" + business.email}>
              <Mail size={17} />
              {business.email}
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {business.name}
          </p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/staff">Staff sign-in</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function Invitation() {
  return (
    <section className="invitation">
      <div className="shell invitation-inner">
        <div>
          <h2>
            Big questions deserve
            <br />a proper conversation.
          </h2>
          <p>
            Visit us in Bagbazar, or start with a call. Your first counselling
            session is free.
          </p>
        </div>
        <Link href="/book" className="button button-light">
          Book a free session <ArrowUpRight size={19} />
        </Link>
      </div>
    </section>
  );
}
export function PageIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-intro shell">
      <Link href="/" className="breadcrumb">
        <ArrowLeft size={15} /> Back to home
      </Link>
      <h1>{title}</h1>
      <div className="lede">{children}</div>
    </div>
  );
}
export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Check size={17} aria-hidden="true" />
      {children}
    </li>
  );
}
