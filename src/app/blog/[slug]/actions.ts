"use server";

import { headers } from "next/headers";
import { createFeedback, feedbackEnabled } from "@/lib/feedback";
import { clientIp, withinRateLimit } from "@/lib/reviews";
import { getPostBySlug } from "@/data/blog";

/*
 * Private feedback endpoint. Like the review action this is a POST route anyone
 * can call, so nothing here trusts the form — including the slug, which arrives
 * in a hidden input and is checked against the content directory before a key
 * is written. Without that check the inbox is an open write to any key name.
 *
 * Nothing submitted here is ever rendered on a public page, so there is no
 * revalidation and no approve step.
 */

const LIMITS = {
  email: { max: 120 },
  // Shorter than a review: this is a note, not a testimonial. The floor exists
  // to catch an empty-ish submit, not to make anyone work for it.
  body: { min: 10, max: 1000 },
} as const;

export type FeedbackFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<"email" | "body", string>>;
  /** Echoed back so a validation error doesn't wipe what the reader typed. */
  values?: Partial<Record<"email" | "body", string>>;
};

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitFeedback(
  _prevState: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  const values = {
    email: field(formData, "email"),
    body: field(formData, "body"),
  };

  // Honeypot: a hidden field no human sees, so anything in it is a bot. Report
  // success rather than an error — a bot that knows it failed just tries again.
  if (field(formData, "website")) {
    return { status: "success", message: "Thanks — that's with me." };
  }

  if (!feedbackEnabled()) {
    return {
      status: "error",
      message: "Feedback isn't working right now. Please email me instead.",
      values,
    };
  }

  // Checked before anything else touches Redis: an unknown slug is not a
  // validation error a real reader can hit, it is someone poking the endpoint.
  const slug = field(formData, "slug");
  if (!slug || !getPostBySlug(slug)) {
    return { status: "error", message: "Couldn't tell which post this was about.", values };
  }

  const errors: FeedbackFormState["errors"] = {};

  if (
    values.email &&
    (values.email.length > LIMITS.email.max || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
  )
    errors.email = "That doesn't look like an email address.";

  if (values.body.length < LIMITS.body.min)
    errors.body = `A little more, please — at least ${LIMITS.body.min} characters.`;
  else if (values.body.length > LIMITS.body.max)
    errors.body = `Keep this under ${LIMITS.body.max} characters.`;

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the fields below.", errors, values };
  }

  const ip = clientIp(await headers());
  // Its own bucket, so reading three posts and saying something about each
  // doesn't lock the reviews form — and vice versa.
  if (!(await withinRateLimit("feedback", ip))) {
    return {
      status: "error",
      message: "You've sent a few already — try again in an hour.",
      values,
    };
  }

  try {
    await createFeedback({
      slug,
      body: values.body,
      email: values.email || undefined,
    });
  } catch {
    return { status: "error", message: "Something went wrong sending that. Try again?", values };
  }

  // No revalidatePath: nothing public changed, because nothing here is public.
  return {
    status: "success",
    message: "Thanks — that goes straight to me, and nowhere else.",
  };
}
