"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Globe2,
  BookOpen,
  FolderLock,
  MapPin,
  FileText,
  MessageSquare,
} from "lucide-react";
import { destinations } from "@/lib/content";
export function StudyHero() {
  const [active, setActive] = useState("australia");
  const destination = destinations.find((d) => d.slug === active)!;
  return (
    <section className="study-hero">
      <div className="shell hero-stage">
        <div className="hero-message">
          <h1>
            Big plans.
            <br />
            <span>
              Clear next
              <br /> steps.
            </span>
          </h1>
          <p>
            Find your study route. Prepare for your test. Keep your next move in
            focus—with AECS in Kathmandu.
          </p>
          <div className="hero-primary">
            <Link href="#start-here" className="button">
              Build my study plan <ArrowUpRight size={20} />
            </Link>
            <Link href="/book" className="hero-secondary">
              Talk it through <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-place">
            <MapPin size={16} />
            <span>
              A team in Bagbazar.
              <br />
              <strong>A plan that goes further.</strong>
            </span>
          </div>
        </div>
        <div className="hero-destination">
          <div className="hero-destination-image">
            <Image
              key={active}
              src={destination.image}
              alt={`A view of ${destination.name}`}
              fill
              priority
              sizes="(max-width:760px) 100vw, 48vw"
            />
            <div className="destination-nameplate">
              <div>
                <span>Imagine studying in</span>
                <strong>{destination.name}</strong>
              </div>
              <Link
                href={"/destinations/" + active}
                aria-label={"Explore studying in " + destination.name}
              >
                <ArrowUpRight size={28} />
              </Link>
            </div>
          </div>
          <div className="hero-country-tabs" aria-label="Preview a destination">
            {["australia", "uk", "germany", "japan"].map((slug) => (
              <button
                key={slug}
                aria-pressed={active === slug}
                onClick={() => setActive(slug)}
              >
                {destinations.find((d) => d.slug === slug)!.name}
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-bottom shell">
        <span>Study abroad. English preparation. Exam support.</span>
        <Link href="/nepali" lang="ne">
          नेपालीमा जानकारी <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
export function StartingPoint() {
  const router = useRouter();
  const [mode, setMode] = useState("Study abroad"),
    [destination, setDestination] = useState("Not sure yet"),
    [level, setLevel] = useState("Bachelor’s degree"),
    [interest, setInterest] = useState(""),
    [test, setTest] = useState("IELTS"),
    [error, setError] = useState("");
  function createDraft(e: React.FormEvent) {
    e.preventDefault();
    try {
      let prior: Record<string, unknown> = {};
      try {
        prior = JSON.parse(localStorage.getItem("aecs-plan-v1") || "{}") || {};
      } catch {}
      const draft = {
        level,
        interest,
        destination,
        timing: typeof prior.timing === "string" ? prior.timing : "",
        tuition: typeof prior.tuition === "string" ? prior.tuition : "",
        living: typeof prior.living === "string" ? prior.living : "",
        other: typeof prior.other === "string" ? prior.other : "",
      };
      localStorage.setItem("aecs-plan-v1", JSON.stringify(draft));
      router.push("/plan");
    } catch {
      setError(
        "This browser could not save your draft. Open the study planner to continue.",
      );
    }
  }
  return (
    <section className="launchpad shell" id="start-here">
      <div className="launchpad-heading">
        <h2>
          Where are
          <br />
          you starting?
        </h2>
        <p>
          You don’t need a finished plan.
          <br />
          Just a place to begin.
        </p>
      </div>
      <div className="launchpad-workspace">
        <div className="launchpad-tabs" aria-label="Choose your starting point">
          {["Study abroad", "English test", "My application"].map((name, i) => (
            <button
              key={name}
              aria-pressed={mode === name}
              onClick={() => {
                setMode(name);
                setError("");
              }}
            >
              {i === 0 ? (
                <Globe2 size={18} />
              ) : i === 1 ? (
                <BookOpen size={18} />
              ) : (
                <FolderLock size={18} />
              )}{" "}
              {name}
            </button>
          ))}
        </div>
        {mode === "Study abroad" ? (
          <form onSubmit={createDraft} className="start-form">
            <div className="start-fields">
              <label>
                Study level
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {[
                    "Bachelor’s degree",
                    "Master’s degree",
                    "Research / PhD",
                    "Still exploring",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Destination
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option>Not sure yet</option>
                  {destinations.map((d) => (
                    <option key={d.slug}>{d.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Your subject
                <input
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  maxLength={100}
                  placeholder="What interests you?"
                />
              </label>
            </div>
            <div className="start-form-bottom">
              <p>A draft on this device. Add your budget and timing next.</p>
              <button className="button" type="submit">
                Create my draft <ArrowRight size={18} />
              </button>
            </div>
            {error && (
              <p role="alert" className="form-status error">
                {error} <Link href="/plan">Open planner</Link>
              </p>
            )}
          </form>
        ) : mode === "English test" ? (
          <div className="start-test">
            <div>
              <h3>Start with the right test.</h3>
              <p>
                Confirm what your institution accepts, then find the preparation
                that fits.
              </p>
            </div>
            <label>
              Your test
              <select value={test} onChange={(e) => setTest(e.target.value)}>
                {["IELTS", "PTE", "Duolingo"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <Link className="button" href={"/courses?test=" + test}>
              Explore preparation <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="start-account">
            <div>
              <h3>Pick up where you left off.</h3>
              <p>
                Your saved plan, application updates, private documents and AECS
                conversations, together.
              </p>
            </div>
            <Link className="button" href="/my-aecs">
              Open My AECS <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
const tour = [
  {
    name: "Your plan",
    icon: FileText,
    title: "A starting point you can build on.",
    text: "Save your study goals, country shortlist and estimated budget. Bring the whole picture to your counselling session.",
    rows: [
      "Study level and subject",
      "Country shortlist",
      "Budget and intended intake",
    ],
    link: "/plan",
    action: "Try the study planner",
  },
  {
    name: "Applications",
    icon: Globe2,
    title: "Know what happens next.",
    text: "Read actual staff-entered stages and application history. See the next action and whether it is waiting on you, AECS or the institution.",
    rows: [
      "Current application stage",
      "Recorded application history",
      "Next action and who owns it",
    ],
    link: "/my-aecs",
    action: "Open my workspace",
  },
  {
    name: "Documents",
    icon: FolderLock,
    title: "Private files. Clear feedback.",
    text: "Upload requested documents in your account, then read the team’s review and any changes needed. Downloads require account authorisation.",
    rows: [
      "Private uploads and downloads",
      "Document checklist",
      "Review feedback from AECS",
    ],
    link: "/my-aecs",
    action: "Open my workspace",
  },
  {
    name: "Conversations",
    icon: MessageSquare,
    title: "Keep the conversation together.",
    text: "Send the team a question, request an appointment and check confirmed meeting details in Nepal time. Replies stay in your workspace.",
    rows: [
      "Questions and staff replies",
      "Appointment requests",
      "Confirmed meeting details",
    ],
    link: "/my-aecs",
    action: "Open my workspace",
  },
];
export function WorkspaceTour() {
  const [active, setActive] = useState(0);
  const item = tour[active];
  const Icon = item.icon;
  return (
    <section className="portal-showcase">
      <div className="shell portal-showcase-inner">
        <div className="portal-story">
          <h2>
            Less chasing.
            <br />
            More clarity.
          </h2>
          <p>
            There’s more to studying abroad than choosing a country. My AECS
            gives the work that follows a proper home.
          </p>
          <Link href="/my-aecs" className="button">
            Meet your workspace <ArrowUpRight size={19} />
          </Link>
          <span className="portal-note">Included with your AECS account.</span>
        </div>
        <div className="portal-tour">
          <div className="portal-tour-top">
            <strong>My AECS</strong>
            <span>Explore the workspace</span>
          </div>
          <div
            className="portal-tour-tabs"
            aria-label="Explore My AECS features"
          >
            {tour.map((t, i) => (
              <button
                key={t.name}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="portal-tour-body" aria-live="polite">
            <Icon size={31} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <ul>
              {item.rows.map((row) => (
                <li key={row}>
                  <Check size={16} />
                  {row}
                </li>
              ))}
            </ul>
            <Link href={item.link} className="text-link">
              {item.action}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
