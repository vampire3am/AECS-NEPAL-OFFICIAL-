"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { packages, money } from "@/lib/content";
export function PricingExplorer() {
  const [group, setGroup] = useState("All packages");
  return (
    <>
      <div className="pricing-filters" aria-label="Filter packages">
        {["All packages", "IELTS", "PTE", "Duolingo", "Mock tests"].map((g) => (
          <button
            key={g}
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="price-list">
        {packages
          .filter((p) => group === "All packages" || p.group === group)
          .map((p) => (
            <article className="price-item" key={p.name}>
              <div className="price-top">
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <span className="price-value">{money(p.price)}</span>
                <small>Published AECS package rate</small>
              </div>
              <ul className="check-list">
                {p.items.map((i) => (
                  <li key={i}>
                    <Check size={17} />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                href={
                  "/book?service=" +
                  encodeURIComponent(
                    p.group === "Mock tests" ? "Mock test" : "Exam booking",
                  ) +
                  "&note=" +
                  encodeURIComponent(
                    "I would like to discuss the " + p.name + " package.",
                  )
                }
                className="text-link"
              >
                Ask about this package <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
      </div>
    </>
  );
}
