"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { destinations } from "@/lib/content";
export function DestinationExplorer() {
  const [region, setRegion] = useState("All destinations"),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string[]>([]),
    [show, setShow] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("aecs-shortlist") || "[]");
      if (Array.isArray(s))
        setSelected(
          s
            .filter(
              (v: unknown) =>
                typeof v === "string" && destinations.some((d) => d.slug === v),
            )
            .slice(0, 3),
        );
    } catch {}
  }, []);
  function toggle(slug: string) {
    let next: string[];
    if (selected.includes(slug)) next = selected.filter((x) => x !== slug);
    else {
      if (selected.length === 3) {
        setMessage(
          "You can compare up to three destinations. Remove one to add another.",
        );
        return;
      }
      next = [...selected, slug];
    }
    setSelected(next);
    setMessage("");
    try {
      localStorage.setItem("aecs-shortlist", JSON.stringify(next));
    } catch {
      setMessage(
        "Your browser could not save this shortlist. You can still compare here.",
      );
    }
  }
  const filtered = destinations.filter(
    (d) =>
      (region === "All destinations" || region === d.region) &&
      d.name.toLowerCase().includes(query.toLowerCase()),
  );
  const compare = destinations.filter((d) => selected.includes(d.slug));
  return (
    <>
      <div className="filter-bar">
        <div className="tabs" aria-label="Filter destinations">
          {["All destinations", "Europe", "Asia Pacific", "North America"].map(
            (r) => (
              <button
                key={r}
                aria-pressed={region === r}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ),
          )}
        </div>
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search destinations"
            placeholder="Find a destination"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <p className="section-note" style={{ marginBottom: 25, marginTop: 0 }}>
        Select up to three destinations to compare. Your shortlist stays on this
        device.
      </p>
      <p role="status" className="form-status error">
        {message}
      </p>
      <div className="destination-grid">
        {filtered.map((d) => (
          <article key={d.slug} className="destination-card">
            <Link
              href={"/destinations/" + d.slug}
              className="image-wrap"
              style={{ display: "block" }}
            >
              <Image
                src={d.image}
                alt={`${d.name} destination view`}
                fill
                sizes="(max-width:600px) 90vw, (max-width:900px) 45vw, 30vw"
              />
            </Link>
            <h2>
              <Link href={"/destinations/" + d.slug}>{d.name}</Link>
            </h2>
            <p>{d.intro}</p>
            <div>
              <Link className="text-link" href={"/destinations/" + d.slug}>
                Explore the route
              </Link>
              <label className="compare-toggle">
                <input
                  type="checkbox"
                  checked={selected.includes(d.slug)}
                  onChange={() => toggle(d.slug)}
                />
                Compare
              </label>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="empty-state">
            <h2>No destinations found.</h2>
            <p>Try another name or select all destinations.</p>
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="compare-tray">
          <div>
            <strong>{compare.map((d) => d.name).join(" · ")}</strong>
            <p>{selected.length} of 3 selected · Saved on this device</p>
          </div>
          <button
            className="button button-light"
            disabled={selected.length < 2}
            onClick={() => {
              setShow(true);
              setTimeout(
                () =>
                  document
                    .getElementById("comparison")
                    ?.scrollIntoView({ behavior: "smooth" }),
                30,
              );
            }}
          >
            Compare destinations
          </button>
        </div>
      )}
      {show && compare.length > 1 && (
        <section
          className="comparison"
          id="comparison"
          aria-label="Destination comparison"
        >
          <h2>Your options, side by side.</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">A starting comparison</th>
                  {compare.map((d) => (
                    <th key={d.slug} scope="col">
                      {d.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Region</th>
                  {compare.map((d) => (
                    <td key={d.slug}>{d.region}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Planning focus</th>
                  {compare.map((d) => (
                    <td key={d.slug}>{d.focus}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Course language</th>
                  {compare.map((d) => (
                    <td key={d.slug}>{d.language}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Costs and eligibility</th>
                  {compare.map((d) => (
                    <td key={d.slug}>
                      Confirm against your course, institution and current
                      requirements.
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Next step</th>
                  {compare.map((d) => (
                    <td key={d.slug}>
                      <Link
                        className="text-link"
                        href={"/book?destination=" + encodeURIComponent(d.name)}
                      >
                        Discuss {d.name}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="section-note">
            This comparison supports a counselling conversation. It does not
            assess admission or visa eligibility.
          </p>
        </section>
      )}
    </>
  );
}

