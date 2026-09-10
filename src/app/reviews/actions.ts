"use server";

import { headers } from "next/headers";
import { createReview, reviewsEnabled, withinRateLimit } from "@/lib/reviews";

/*
 * Public submission endpoint. A Server Action is a POST route that anyone can
 * call directly, so nothing here trusts the form: every field is re-validated,
 * and the result is always written as pending.
 */

const LIMITS = {
  name: { min: 2, max: 60 },
  role: { max: 80 },
  company: { max: 80 },
  email: { max: 120 },
  body: { min: 30, max: 800 },
} as const;

export type ReviewFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<"name" | "role" | "company" | "email" | "body", string>>;
  /** Echoed back so a validation error doesn't wipe what the visitor typed. */
  values?: Partial<Record<"name" | "role" | "company" | "email" | "body", string>>;
};

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Link-stuffing is the one spam shape worth rejecting outright, queue or not. */
function linkCount(text: string): number {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

function clientIp(headerList: Headers): string {
  // Netlify sets the first; x-forwarded-for is the portable fallback and can be
  // a comma-separated chain, where the client is the leftmost entry.
  return (
    headerList.get("x-nf-client-connection-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const values = {
    name: field(formData, "name"),
    role: field(formData, "role"),
    company: field(formData, "company"),
    email: field(formData, "email"),
    body: field(formData, "body"),
  };

  // Honeypot: a hidden field no human sees, so anything in it is a bot. Report
  // success rather than an error — a bot that knows it failed just tries again.
  if (field(formData, "website")) {
    return { status: "success", message: "Thanks — your review is in the queue." };
  }

  if (!reviewsEnabled()) {
    return {
      status: "error",
      message: "Reviews aren't accepting submissions right now. Please email me instead.",
      values,
    };
  }

  const errors: ReviewFormState["errors"] = {};

  if (values.name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (values.name.length > LIMITS.name.max)
    errors.name = `Keep this under ${LIMITS.name.max} characters.`;

  if (values.role.length > LIMITS.role.max)
    errors.role = `Keep this under ${LIMITS.role.max} characters.`;

  if (values.company.length > LIMITS.company.max)
    errors.company = `Keep this under ${LIMITS.company.max} characters.`;

  if (
    values.email &&
    (values.email.length > LIMITS.email.max || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
  )
    errors.email = "That doesn't look like an email address.";

  if (values.body.length < LIMITS.body.min)
    errors.body = `A little more detail, please — at least ${LIMITS.body.min} characters.`;
  else if (values.body.length > LIMITS.body.max)
    errors.body = `Keep this under ${LIMITS.body.max} characters.`;
  else if (linkCount(values.body) > 1) errors.body = "Please leave links out of the review.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the fields below.", errors, values };
  }

  const ip = clientIp(await headers());
  if (!(await withinRateLimit(ip))) {
    return {
      status: "error",
      message: "You've submitted a few already — try again in an hour.",
      values,
    };
  }

  try {
    await createReview({
      name: values.name,
      role: values.role || undefined,
      company: values.company || undefined,
      email: values.email || undefined,
      body: values.body,
    });
  } catch {
    return { status: "error", message: "Something went wrong saving that. Try again?", values };
  }

  // No revalidation: the review is pending, so no public page changed yet.
  return {
    status: "success",
    message: "Thanks — I read every one of these. It'll appear once I've approved it.",
  };
}
