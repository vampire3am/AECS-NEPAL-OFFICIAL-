import test from "node:test";
import assert from "node:assert/strict";
import {
  requestSchema,
  isAllowedOrigin,
  calculateBudget,
} from "../lib/validation.ts";
const valid = {
  requestId: "9f05e930-1b63-4414-8150-983c543545db",
  name: "Test Student",
  phone: "+977 9800000000",
  email: "",
  service: "Study abroad counselling",
  destination: "Not sure yet",
  mode: "Phone call",
  preferredDate: "",
  note: "Test request",
  consent: true,
  website: "",
};
test("valid counselling requests have explicit consent and normalized names", () => {
  const r = requestSchema.parse({ ...valid, name: "  Test Student  " });
  assert.equal(r.name, "Test Student");
});
test("rejects missing consent, bad contact details, excessive notes and bot fields", () => {
  for (const input of [
    { ...valid, consent: false },
    { ...valid, phone: "invalid" },
    { ...valid, email: "invalid" },
    { ...valid, note: "x".repeat(1501) },
    { ...valid, website: "https://spam.test" },
    { ...valid, service: "unrecognized" },
  ])
    assert.equal(requestSchema.safeParse(input).success, false);
});
test("requires a stable UUID for idempotent submissions", () => {
  assert.equal(
    requestSchema.safeParse({ ...valid, requestId: "guess" }).success,
    false,
  );
});
test("origin matching rejects absent, deceptive and cross-site origins", () => {
  assert.equal(isAllowedOrigin(null, "https://aecs.test/api/enquiries"), false);
  assert.equal(
    isAllowedOrigin(
      "https://aecs.test.evil.test",
      "https://aecs.test/api/enquiries",
    ),
    false,
  );
  assert.equal(
    isAllowedOrigin("https://evil.test", "https://aecs.test/api/enquiries"),
    false,
  );
  assert.equal(
    isAllowedOrigin("https://aecs.test", "https://aecs.test/api/enquiries"),
    true,
  );
  assert.equal(
    isAllowedOrigin(
      "https://official.test",
      "http://internal/api",
      "https://official.test",
    ),
    true,
  );
});
test("budget totals use only finite positive inputs", () => {
  assert.equal(calculateBudget([100000, 50000, 5000]), 155000);
  assert.equal(calculateBudget([0, -1, NaN, Infinity, 20]), 20);
});

