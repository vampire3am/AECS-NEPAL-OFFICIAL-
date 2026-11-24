"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const links = [
  ["Study abroad", "/destinations"],
  ["English tests", "/courses"],
  ["Fees", "/pricing"],
  ["Resources", "/guides"],
  ["Study planner", "/plan"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="shell header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="AECS Nepal home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.webp"
            alt=""
            width={48}
            height={48}
            priority
          />
          <span>
            <strong>
              AECS<span className="brand-nepal"> NEPAL</span>
            </strong>
            <small>Abroad Education Consultancy</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={path.startsWith(url) ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="portal-link" href="/my-aecs">
            My AECS
          </Link>
          <Link href="/book" className="button button-small">
            Book a free session
          </Link>
          <button
            className="menu-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="mobile-nav shell"
          id="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          {[
            ...links,
            ["About AECS", "/about"],
            ["नेपाली", "/nepali"],
            ["Guides", "/guides"],
            ["Contact & booking", "/book"],
          ].map(([name, url]) => (
            <Link key={url} href={url} onClick={() => setOpen(false)}>
              {name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
