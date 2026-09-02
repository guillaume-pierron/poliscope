import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "poliscope_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "poliscope-dev-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

/** Simple signed-cookie session, sufficient for a single-admin V1. See README for hardening notes. */
export function createSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  const expected = sign(issuedAt);
  if (expected.length !== signature.length) return false;
  const valid = timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) return false;
  const ageMs = Date.now() - Number(issuedAt);
  return ageMs >= 0 && ageMs < 1000 * 60 * 60 * 12; // 12h session
}

export async function getAdminSession() {
  const store = await cookies();
  return isValidSessionToken(store.get(ADMIN_COOKIE)?.value);
}
