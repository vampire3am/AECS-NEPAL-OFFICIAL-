"use client";
import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
const courses = [
  {
    name: "IELTS",
    subtitle: "Academic & General Training",
    text: "Build confidence across listening, reading, writing and speaking with a structured preparation plan.",
    points: [
      "Practice the format accepted by your institution",
      "Writing feedback and speaking practice",
      "Timed mock sessions and a practical study plan",
    ],
    help: "Start by confirming whether you need Academic or General Training, then choose the delivery format that your route accepts.",
  },
  {
    name: "PTE",
    subtitle: "PTE Academic preparation",
    text: "Get comfortable with the microphone, keyboard and integrated tasks before your test day.",
    points: [
      "Task-by-task strategy and timed drills",
      "Practice in an exam-simulation lab",
      "Feedback on speaking, writing, reading and listening",
    ],
    help: "PTE Academic and PTE Core serve different purposes. Confirm the exact test required before booking.",
  },
  {
    name: "Duolingo",
    subtitle: "Duolingo English Test",
    text: "Prepare for an online-proctored test with attention to the questions, equipment and test environment.",
    points: [
      "Question-format and timing practice",
      "ID, camera, room and equipment checklist",
      "Institution acceptance and score-send guidance",
    ],
    help: "Check that your particular institution and programme accept the test. Admission acceptance does not automatically establish visa suitability.",
  },
];
export function Courses({ initialTest }: { initialTest?: string }) {
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      courses.findIndex(
        (course) => course.name.toLowerCase() === initialTest?.toLowerCase(),
      ),
    ),
  );
  const c = courses[selected];
  return (
    <>
      <div
        className="tabs"
        role="tablist"
        aria-label="English preparation courses"
      >
        {courses.map((x, i) => (
          <button
            key={x.name}
            role="tab"
            id={"tab-" + i}
            aria-selected={selected === i}
            tabIndex={selected === i ? 0 : -1}
            aria-controls="course-panel"
            onClick={() => setSelected(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const n = (selected + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                setSelected(n);
                document.getElementById("tab-" + n)?.focus();
              }
            }}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div
        key={c.name}
        className="course-detail"
        id="course-panel"
        role="tabpanel"
        aria-labelledby={"tab-" + selected}
      >
        <div className="course-title">
          <h2>{c.name}</h2>
          <p>{c.subtitle}</p>
        </div>
        <div>
          <h3>Preparation with a purpose.</h3>
          <p>{c.text}</p>
          <ul className="check-list">
            {c.points.map((p) => (
              <li key={p}>
                <Check size={17} />
                {p}
              </li>
            ))}
          </ul>
          <p>{c.help}</p>
          <div className="hero-actions">
            <Link href="/book?service=English%20preparation" className="button">
              Find my starting point
            </Link>
            <Link href="/pricing" className="text-link">
              See published packages
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
