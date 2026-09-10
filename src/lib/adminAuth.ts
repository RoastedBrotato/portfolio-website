import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
 * Single-secret gate for /admin/reviews.
 *
 * There is one admin — me — so a full auth system would be more moving parts
 * than the thing it protects. The secret is REVIEWS_ADMIN_TOKEN in the host's
 * env; the browser only ever holds its SHA-256 digest, so a stolen cookie
 * grants a session but never reveals the token itself.
 */

const COOKIE = "reviews_admin";
const SESSION_SECONDS = 60 * 60 * 12;

function digest(token: string): string {
  return createHash("sha256").update(`reviews-admin:${token}`).digest("hex");
}

/** Constant-time compare, so a wrong guess can't be refined by timing it. */
function matches(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // timingSafeEqual throws on a length mismatch, which would itself leak length.
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.REVIEWS_ADMIN_TOKEN);
}

export async function isAdmin(): Promise<boolean> {
  const token = process.env.REVIEWS_ADMIN_TOKEN;
  if (!token) return false;

  const cookie = (await cookies()).get(COOKIE)?.value;
  if (!cookie) return false;

  return matches(cookie, digest(token));
}

/** Returns false on a bad token; the caller decides what the UI says. */
export async function signIn(candidate: string): Promise<boolean> {
  const token = process.env.REVIEWS_ADMIN_TOKEN;
  if (!token || !matches(candidate, token)) return false;

  (await cookies()).set(COOKIE, digest(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
  return true;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

/** Throws rather than returning — every mutating admin action calls this first. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
