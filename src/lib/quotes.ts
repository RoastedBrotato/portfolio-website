import "server-only";
import { Redis } from "@upstash/redis";
import type { QuoteRequest } from "@/types";

/*
 * Quote request storage and notification.
 *
 * Storage is a near-copy of src/lib/feedback.ts for the same reason that file
 * gives: these are private leads, so there is no public read path and no
 * toPublic() mapper — nothing here renders anywhere but /admin/reviews.
 *
 * Keys:
 *   quote:<id>        the QuoteRequest object
 *   quotes:inbox      sorted set of ids, score = createdAt
 *
 * Storage and email are independent: either one landing counts as the lead
 * being received. Upstash is the record; the email is the nudge.
 */

const INBOX_KEY = "quotes:inbox";

export function quoteStorageEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function quoteEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_FROM_EMAIL);
}

let client: Redis | null = null;

function redis(): Redis | null {
  if (!quoteStorageEnabled()) return null;
  // Lazy, so importing this module never throws in an unconfigured environment.
  client ??= Redis.fromEnv();
  return client;
}

/** The whole inbox, newest first. Admin-only. Swallows errors like the other reads. */
export async function getAllQuotes(): Promise<QuoteRequest[]> {
  const db = redis();
  if (!db) return [];

  try {
    const ids = await db.zrange<string[]>(INBOX_KEY, 0, -1, { rev: true });
    if (ids.length === 0) return [];

    const rows = await db.mget<(QuoteRequest | null)[]>(ids.map((id) => `quote:${id}`));
    return rows.filter((row): row is QuoteRequest => row !== null);
  } catch (error) {
    console.error("[quotes] failed to read the inbox", error);
    return [];
  }
}

export type NewQuote = Omit<QuoteRequest, "id" | "createdAt" | "read">;

export function buildQuote(input: NewQuote): QuoteRequest {
  return { ...input, id: crypto.randomUUID(), createdAt: Date.now(), read: false };
}

/** Throws on failure — the caller decides whether the email alone is enough. */
export async function saveQuote(quote: QuoteRequest): Promise<void> {
  const db = redis();
  if (!db) throw new Error("Quote storage is not configured");

  await db.set(`quote:${quote.id}`, quote);
  await db.zadd(INBOX_KEY, { score: quote.createdAt, member: quote.id });
}

export async function markQuoteRead(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  const quote = await db.get<QuoteRequest>(`quote:${id}`);
  if (!quote) return;
  await db.set(`quote:${id}`, { ...quote, read: true });
}

export async function deleteQuote(id: string): Promise<void> {
  const db = redis();
  if (!db) return;

  await db.del(`quote:${id}`);
  await db.zrem(INBOX_KEY, id);
}

function line(label: string, value: string | undefined): string {
  return value ? `${label}: ${value}` : "";
}

/**
 * Email the lead through Resend's REST API — a plain fetch, so no SDK to add.
 * Reply-To is the client, so answering the notification answers them.
 *
 * Throws on failure. Times out after 8s: a slow mail API must not hold the
 * visitor's submit button hostage when the lead is already stored.
 */
export async function sendQuoteNotification(
  quote: QuoteRequest,
  labels: { projectType: string; budget: string; timeline: string; source?: string },
  to: string,
): Promise<void> {
  const { attribution: a } = quote;

  const text = [
    `New quote request from ${quote.name}${quote.company ? ` (${quote.company})` : ""}`,
    "",
    line("Email", quote.email),
    line("Project", labels.projectType),
    line("Budget", labels.budget),
    line("Timeline", labels.timeline),
    "",
    quote.description,
    "",
    line("Links", quote.links),
    line("Found me via", labels.source),
    "",
    "— Attribution —",
    line("utm_source", a.utmSource),
    line("utm_medium", a.utmMedium),
    line("utm_campaign", a.utmCampaign),
    line("Landing page", a.landingPage),
    line("Referrer", a.referrer),
    line("Form", quote.placement),
  ]
    .filter((row, i, rows) => row !== "" || rows[i - 1] !== "")
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.QUOTE_FROM_EMAIL,
      to: [to],
      reply_to: quote.email,
      subject: `Quote request: ${labels.projectType} — ${quote.name}`,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}
