import "server-only";
import { createNeonAuth } from "@neon/auth/next/server";
export function getAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL,
    secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !secret) throw new Error("Sign-in is not configured.");
  return createNeonAuth({ baseUrl, cookies: { secret, sessionDataTtl: 1 } });
}
export async function getStaff() {
  const { data } = await getAuth().getSession();
  const user = data?.user;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (
    !email ||
    !user ||
    !user.emailVerified ||
    user.email.toLowerCase() !== email
  )
    return null;
  return user;
}

