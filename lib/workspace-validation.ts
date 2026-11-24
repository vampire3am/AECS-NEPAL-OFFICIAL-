import { z } from "zod";
const text = (n: number) => z.string().trim().min(1).max(n);
import { stages, owners } from "./workspace-options.ts";
export { stages, owners } from "./workspace-options.ts";
export const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("profile"),
    name: text(100),
    phone: z.string().trim().max(40),
  }),
  z.object({
    action: z.literal("plan"),
    level: z.string().trim().max(100),
    interest: z.string().trim().max(200),
    destination: z.string().trim().max(100),
    timing: z.string().trim().max(100),
    tuition: z.number().min(0).max(1e9),
    living: z.number().min(0).max(1e9),
    other: z.number().min(0).max(1e9),
    shortlist: z.array(z.string().trim().max(60)).max(3),
  }),
  z.object({ action: z.literal("message"), body: text(2000) }),
  z.object({
    action: z.literal("appointment"),
    date: z.iso.date(),
    mode: z.enum(["In person", "Online", "Phone"]),
    note: z.string().trim().max(500),
  }),
  z.object({
    action: z.literal("task-toggle"),
    id: z.uuid(),
    completed: z.boolean(),
  }),
  z.object({
    action: z.literal("application"),
    institution: text(200),
    course: text(200),
    destination: text(100),
    intake: text(100),
  }),
  z.object({
    action: z.literal("application-update"),
    id: z.uuid(),
    stage: z.enum(stages),
    nextAction: z.string().trim().max(1000),
    waitingOn: z.enum(owners),
  }),
  z.object({
    action: z.literal("task"),
    title: text(300),
    owner: z.enum(owners),
    dueDate: z.union([z.iso.date(), z.literal("")]),
  }),
  z.object({
    action: z.literal("document-review"),
    id: z.uuid(),
    status: z.enum(["Reviewed", "Changes requested"]),
    feedback: z.string().trim().max(1000),
  }),
  z.object({
    action: z.literal("appointment-update"),
    id: z.uuid(),
    status: z.enum([
      "Confirmed",
      "Reschedule requested",
      "Cancelled",
      "Completed",
    ]),
    startsAt: z.union([z.iso.datetime({ offset: true }), z.literal("")]),
    note: z.string().trim().max(1000),
  }),
]);
export function isStaffOnly(action: string) {
  return [
    "application",
    "application-update",
    "task",
    "document-review",
    "appointment-update",
  ].includes(action);
}
export function documentType(bytes: Uint8Array) {
  if (
    bytes.length >= 5 &&
    String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-"
  )
    return "application/pdf";
  if (
    bytes.length >= 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
  )
    return "image/png";
  if (
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  )
    return "image/jpeg";
  return null;
}
