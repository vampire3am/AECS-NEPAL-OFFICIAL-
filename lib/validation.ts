import { z } from "zod";
export const requestSchema = z.object({
  requestId: z.uuid(),
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,22}$/, "Enter a valid phone number.")
    .refine((v) => v.replace(/\D/g, "").length >= 7),
  email: z.union([z.email(), z.literal("")]).default(""),
  service: z.enum([
    "Study abroad counselling",
    "English preparation",
    "Exam booking",
    "Mock test",
    "Family consultation",
  ]),
  destination: z.string().max(60).default("Not sure yet"),
  mode: z.enum(["At the Bagbazar office", "Phone call", "Online meeting"]),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  note: z.string().trim().max(1500).default(""),
  consent: z.literal(true, { error: "Please agree to the privacy notice." }),
  website: z
    .string()
    .max(0, "Please leave the website field empty.")
    .default(""),
});
export type EnquiryInput = z.infer<typeof requestSchema>;
export function isAllowedOrigin(
  origin: string | null,
  url: string,
  configured?: string,
) {
  if (!origin) return false;
  try {
    return (
      origin === new URL(url).origin ||
      (!!configured && origin === new URL(configured).origin)
    );
  } catch {
    return false;
  }
}
export function calculateBudget(values: number[]) {
  return values.reduce(
    (sum, v) => sum + (Number.isFinite(v) && v > 0 ? v : 0),
    0,
  );
}

