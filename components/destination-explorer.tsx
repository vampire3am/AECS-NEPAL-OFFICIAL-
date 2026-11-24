"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ArrowUpRight, ArrowRight } from "lucide-react";
import { destinationFacts, factsReviewed } from "@/lib/destination-facts";
import { destinations } from "@/lib/content";
export function DestinationExplorer() {
  const [active, setActive] = useState("australia"),
    [region, setRegion] = useState("All destinations"),
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
  const visibleActive = filtered.some((d) => d.slug === active)
    ? active
    : filtered[0]?.slug;
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
        Select up to three destinations to compare costs, start dates and
        official sources. Your shortlist stays on this device. Sign in to My
        AECS to import and save it to your account.
      </p>
      <p role="status" className="form-status error">
        {message}
      </p>
      <div className="destination-directory">
        <div
          className="country-directory-list"
          aria-label="Choose a destination"
        >
          {filtered.map((d) => (
            <div
              className={
                "country-directory-row " +
                (visibleActive === d.slug ? "is-active" : "")
              }
              key={d.slug}
            >
              <button
                aria-pressed={visibleActive === d.slug}
                onClick={() => {
                  setActive(d.slug);
                  if (window.matchMedia("(max-width:760px)").matches)
                    setTimeout(
                      () =>
                        document
                          .getElementById("route-preview")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          }),
                      50,
                    );
                }}
              >
                <span>{d.region}</span>
                <strong>{d.name}</strong>
                <ArrowUpRight size={20} />
              </button>
              <label className="directory-compare">
                <input
                  type="checkbox"
                  checked={selected.includes(d.slug)}
                  onChange={() => toggle(d.slug)}
                  aria-label={"Compare " + d.name}
                />
                <span>Compare</span>
              </label>
            </div>
          ))}
          {!filtered.length && (
            <div className="empty-state">
              <h2>No destinations found.</h2>
              <p>Try another name or select all destinations.</p>
            </div>
          )}
        </div>
        {filtered.length > 0 &&
          (() => {
            const d = filtered.find((d) => d.slug === active) || filtered[0];
            return (
              <aside
                className="route-preview"
                id="route-preview"
                aria-label={d.name + " study overview"}
              >
                <div className="route-preview-image">
                  <Image
                    src={d.image}
                    alt={d.name + " destination view"}
                    fill
                    sizes="(max-width:760px) 90vw, 50vw"
                  />
                  <h2>{d.name}</h2>
                </div>
                <div className="route-preview-body">
                  <p>{d.intro}</p>
                  <dl>
                    <div>
                      <dt>Planning focus</dt>
                      <dd>{d.focus}</dd>
                    </div>
                    <div>
                      <dt>Language</dt>
                      <dd>{d.language}</dd>
                    </div>
                  </dl>
                  <div className="route-preview-cost">
                    <strong>Budget starting point</strong>
                    <p>{destinationFacts[d.slug].living}</p>
                    <span>Checked {factsReviewed} · Original currency</span>
                  </div>
                  <div className="route-preview-actions">
                    <Link href={"/destinations/" + d.slug} className="button">
                      Explore the route <ArrowUpRight size={18} />
                    </Link>
                    <button
                      className="text-link"
                      onClick={() => toggle(d.slug)}
                    >
                      {selected.includes(d.slug)
                        ? "Remove from comparison"
                        : "Add to comparison"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </aside>
            );
          })()}
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
                {(
                  [
                    ["tuition", "Tuition and scope"],
                    ["living", "Living costs"],
                    ["intakes", "Intakes and deadlines"],
                  ] as const
                ).map(([key, label]) => (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    {compare.map((d) => (
                      <td key={d.slug}>{destinationFacts[d.slug][key]}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">Official sources</th>
                  {compare.map((d) => (
                    <td key={d.slug}>
                      {destinationFacts[d.slug].sources.map((source) => (
                        <p key={source.url}>
                          <a className="text-link" href={source.url}>
                            {source.label}
                          </a>
                        </p>
                      ))}
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
            Sources checked {factsReviewed}. Figures retain their original
            currency and period; they are indicative, not an AECS quote. Add
            travel, insurance and course-specific costs. This comparison does
            not assess admission or visa eligibility.
          </p>
        </section>
      )}
    </>
  );
}
