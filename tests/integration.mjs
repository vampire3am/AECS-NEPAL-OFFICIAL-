import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const routes = [
  "/",
  "/destinations",
  "/destinations/australia",
  "/destinations/uk",
  "/destinations/canada",
  "/destinations/germany",
  "/destinations/usa",
  "/destinations/new-zealand",
  "/destinations/finland",
  "/destinations/japan",
  "/destinations/south-korea",
  "/destinations/hungary",
  "/destinations/malta",
  "/destinations/cyprus",
  "/courses",
  "/pricing",
  "/about",
  "/plan",
  "/book",
  "/guides",
  "/guides/choosing-your-english-test",
  "/guides/building-a-study-budget",
  "/guides/your-first-counselling-session",
  "/privacy",
  "/terms",
  "/staff/sign-in",
  "/sitemap.xml",
  "/robots.txt",
];
for (const route of routes) {
  const r = await fetch(base + route);
  assert.equal(r.status, 200, route);
  const text = await r.text();
  assert.ok(!text.includes("\uFFFD"), "Corrupted text on " + route);
}
console.log(
  "PASS: 28 public routes return 200 without replacement characters.",
);
const page = await fetch(base + "/");
assert.equal(page.headers.get("x-content-type-options"), "nosniff");
assert.equal(page.headers.get("x-frame-options"), "DENY");
assert.ok(
  page.headers
    .get("content-security-policy")
    ?.includes("frame-ancestors 'none'"),
);
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
assert.ok(sitemap.includes("/pricing"));
assert.ok(!sitemap.includes("/staff"));
const denied = await fetch(base + "/api/staff/enquiries");
assert.equal(denied.status, 403);
assert.ok(!(await denied.text()).includes('"items"'));
const missing = await fetch(base + "/missing-page");
assert.equal(missing.status, 404);
console.log(
  "PASS: security headers, sitemap coverage, private API denial and 404.",
);
const input = {
  requestId: randomUUID(),
  name: "[TEST] AECS Integration",
  phone: "+977 9800000000",
  email: "",
  service: "Study abroad counselling",
  destination: "Not sure yet",
  mode: "Phone call",
  preferredDate: "",
  note: "Synthetic integration fixture. Development database only.",
  consent: true,
  website: "",
};
const ip = "203.0.113." + (10 + Math.floor(Math.random() * 200));
const send = (payload, origin = base) =>
  fetch(base + "/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      "x-vercel-forwarded-for": ip,
    },
    body: JSON.stringify(payload),
  });
assert.equal((await send({ ...input, consent: false })).status, 400);
assert.equal((await send(input, "https://untrusted.example")).status, 403);
assert.equal(
  (await send({ ...input, preferredDate: "2020-01-01" })).status,
  400,
);
const first = await send(input);
assert.equal(first.status, 201, await first.clone().text());
const saved = await first.json();
assert.match(saved.reference, /^AECS-[A-F0-9]{10}$/);
const retry = await send(input);
assert.equal(retry.status, 201);
assert.equal((await retry.json()).reference, saved.reference);
for (let i = 0; i < 3; i++)
  assert.equal((await send({ ...input, requestId: randomUUID() })).status, 201);
assert.equal((await send({ ...input, requestId: randomUUID() })).status, 429);
console.log(
  "PASS: consent, cross-origin and past-date rejection; persisted booking reference; idempotent retries; database-backed rate limiting.",
);
console.log(
  "No authentication email was sent. No production customer data was read or modified.",
);

