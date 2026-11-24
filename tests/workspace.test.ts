import test from "node:test";
import assert from "node:assert/strict";
import {
  actionSchema,
  documentType,
  isStaffOnly,
} from "../lib/workspace-validation.ts";
test("Only staff actions can create or advance official application records", () => {
  for (const a of [
    "application",
    "application-update",
    "task",
    "document-review",
    "appointment-update",
  ])
    assert.equal(isStaffOnly(a), true);
  for (const a of ["profile", "plan", "message", "appointment", "task-toggle"])
    assert.equal(isStaffOnly(a), false);
  assert.equal(
    actionSchema.safeParse({
      action: "application-update",
      id: crypto.randomUUID(),
      stage: "Guaranteed visa",
      nextAction: "",
      waitingOn: "AECS",
    }).success,
    false,
  );
});
test("Documents must have an approved binary signature", () => {
  assert.equal(
    documentType(new TextEncoder().encode('<svg onload="alert(1)">')),
    null,
  );
  assert.equal(
    documentType(new TextEncoder().encode("%PDF-1.7\n")),
    "application/pdf",
  );
  assert.equal(
    documentType(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/png",
  );
  assert.equal(
    documentType(new Uint8Array([255, 216, 255, 224])),
    "image/jpeg",
  );
  assert.equal(documentType(new Uint8Array([137, 80, 78])), null);
});
test("Student input rejects invalid budgets, dates and oversized messages", () => {
  const plan = {
    action: "plan",
    level: "Master",
    interest: "Design",
    destination: "UK",
    timing: "2027",
    tuition: 0,
    living: 0,
    other: 0,
    shortlist: [],
  };
  assert.equal(actionSchema.safeParse(plan).success, true);
  assert.equal(actionSchema.safeParse({ ...plan, tuition: -1 }).success, false);
  assert.equal(
    actionSchema.safeParse({ ...plan, shortlist: ["a", "b", "c", "d"] })
      .success,
    false,
  );
  assert.equal(
    actionSchema.safeParse({ action: "message", body: " ".repeat(10) }).success,
    false,
  );
  assert.equal(
    actionSchema.safeParse({ action: "message", body: "a".repeat(2001) })
      .success,
    false,
  );
  assert.equal(
    actionSchema.safeParse({
      action: "appointment",
      date: "2027-02-30",
      mode: "Online",
      note: "",
    }).success,
    false,
  );
});
