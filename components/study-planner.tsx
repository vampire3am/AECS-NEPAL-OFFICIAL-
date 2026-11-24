"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Printer, Save } from "lucide-react";
import { destinations, money } from "@/lib/content";
import { calculateBudget } from "@/lib/validation";
type Plan = {
  level: string;
  interest: string;
  destination: string;
  timing: string;
  tuition: string;
  living: string;
  other: string;
};
const blank: Plan = {
  level: "",
  interest: "",
  destination: "Not sure yet",
  timing: "",
  tuition: "",
  living: "",
  other: "",
};
export function StudyPlanner() {
  const [plan, setPlan] = useState<Plan>(blank),
    [status, setStatus] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("aecs-plan-v1") || "null");
      if (saved && typeof saved === "object") {
        const safe = { ...blank };
        for (const key of Object.keys(blank) as (keyof Plan)[])
          if (typeof saved[key] === "string")
            safe[key] = saved[key].slice(0, 100);
        setPlan(safe);
      }
    } catch {}
  }, []);
  function update(key: keyof Plan, value: string) {
    setPlan((p) => ({ ...p, [key]: value }));
    setStatus("");
  }
  const total = calculateBudget([
    Number(plan.tuition),
    Number(plan.living),
    Number(plan.other),
  ]);
  const completed = [plan.level, plan.interest, plan.timing].filter(
    Boolean,
  ).length;
  const note = `My starting study plan: ${plan.level || "Study level undecided"}; subject: ${plan.interest || "undecided"}; timing: ${plan.timing || "flexible"}; destination: ${plan.destination}.${total ? " My own estimated budget is " + money(total) + "." : ""}`;
  return (
    <div className="plan-layout">
      <div className="plan-steps">
        <fieldset>
          <legend>What would you like to study?</legend>
          <div className="choice-grid">
            {[
              "Bachelor’s degree",
              "Master’s degree",
              "Research / PhD",
              "Still exploring",
            ].map((v) => (
              <label key={v}>
                <input
                  name="level"
                  type="radio"
                  checked={plan.level === v}
                  onChange={() => update("level", v)}
                />
                {v}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="interest">Your subject or area of interest</label>
          <input
            id="interest"
            placeholder="e.g. business, engineering, healthcare"
            value={plan.interest}
            maxLength={100}
            onChange={(e) => update("interest", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="plan-destination">
            A destination you’re curious about
          </label>
          <select
            id="plan-destination"
            value={plan.destination}
            onChange={(e) => update("destination", e.target.value)}
          >
            <option>Not sure yet</option>
            {destinations.map((d) => (
              <option key={d.slug}>{d.name}</option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend>When would you like to start?</legend>
          <div className="choice-grid">
            {[
              "Within 6 months",
              "6–12 months",
              "More than a year",
              "I’m flexible",
            ].map((v) => (
              <label key={v}>
                <input
                  name="timing"
                  type="radio"
                  checked={plan.timing === v}
                  onChange={() => update("timing", v)}
                />
                {v}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>
            Your own budget estimate{" "}
            <span className="optional">(optional)</span>
          </legend>
          <p style={{ marginBottom: 20, fontSize: ".9rem" }}>
            Use figures you have gathered, all in NPR and for the same study
            period. This calculator adds your estimates; it does not quote costs
            or check visa funds.
          </p>
          <div className="budget-fields">
            {[
              ["tuition", "Tuition"],
              ["living", "Living costs"],
              ["other", "Other costs & contingency"],
            ].map(([key, label]) => (
              <div className="field" key={key}>
                <label htmlFor={"budget-" + key}>{label}</label>
                <input
                  id={"budget-" + key}
                  type="number"
                  min="0"
                  max="1000000000"
                  inputMode="decimal"
                  placeholder="NPR"
                  value={plan[key as keyof Plan]}
                  onChange={(e) => update(key as keyof Plan, e.target.value)}
                />
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <aside className="panel plan-summary">
        <h2>Your starting plan.</h2>
        <p>
          This is a conversation starter. A counsellor will help you check the
          details.
        </p>
        <p className="status-label">
          {completed} of 3 starting questions answered
        </p>
        <dl>
          <dt>Study level</dt>
          <dd>{plan.level || "Still to explore"}</dd>
          <dt>Subject</dt>
          <dd>{plan.interest || "Your interests come first"}</dd>
          <dt>Destination</dt>
          <dd>{plan.destination}</dd>
          <dt>Timing</dt>
          <dd>{plan.timing || "Let’s work it out"}</dd>
        </dl>
        {total > 0 && (
          <div>
            <p>Your estimate for the period you chose</p>
            <div className="budget-total">{money(total)}</div>
          </div>
        )}
        <ul className="check-list">
          <li>
            <Check size={17} />
            Check course and institution requirements
          </li>
          <li>
            <Check size={17} />
            Discuss English preparation
          </li>
          <li>
            <Check size={17} />
            Review costs and a realistic timeline
          </li>
        </ul>
        <Link
          className="button"
          href={
            "/book?destination=" +
            encodeURIComponent(plan.destination) +
            "&note=" +
            encodeURIComponent(note)
          }
        >
          Discuss this plan
        </Link>
        <button
          className="button button-outline"
          onClick={() => {
            try {
              localStorage.setItem("aecs-plan-v1", JSON.stringify(plan));
              setStatus(
                "Saved on this device. Your plan has not been sent to AECS.",
              );
            } catch {
              setStatus(
                "This browser could not save your plan. You can print it instead.",
              );
            }
          }}
        >
          <Save size={17} />
          Save on this device
        </button>
        <button
          className="button button-outline"
          onClick={() => window.print()}
        >
          <Printer size={17} />
          Print my plan
        </button>
        <Link href="/my-aecs" className="text-link">
          Save in My AECS account
        </Link>
        <p className="section-note">
          Save on this device first, then import your draft inside My AECS.
        </p>
        <p className="form-status" role="status">
          {status}
        </p>
      </aside>
    </div>
  );
}
