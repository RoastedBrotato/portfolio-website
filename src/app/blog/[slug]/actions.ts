"use server";

import { headers } from "next/headers";
import { createFeedback, feedbackEnabled } from "@/lib/feedback";
import { commentsEnabled, createComment } from "@/lib/comments";
import { clientIp, withinRateLimit } from "@/lib/reviews";
import { getPostBySlug } from "@/data/blog";

/*
 * The end-of-post form. One form, two destinations, chosen by the reader:
 *
 *   public  → a comment, held for approval, then shown under the post
 *   private → a note to my inbox, never published (the original feedback box)
 *
 * Like the review action this is a POST route anyone can call, so nothing here
 * trusts the form — including the slug, which arrives in a hidden input and is
 * checked against the content directory before a key is written. Without that
 * check the store is an open write to any key name.
 */

const LIMITS = {
  name: { min: 2, max: 60 },
  email: { max: 120 },
  // Shorter than a review: this is a reply to a post, not a testimonial. The
  // floor exists to catch an empty-ish submit, not to make anyone work for it.
  body: { min: 10, max: 1000 },
} as const;

type CommentField = "name" | "email" | "body";

export type CommentFormState = {
  status: "idle" | "error" | "success";
  /** Which destination the success message is about. */
  visibility?: "public" | "private";
  message?: string;
  errors?: Partial<Record<CommentField, string>>;
  /** Echoed back so a validation error doesn't wipe what the reader typed. */
  values?: Partial<Record<CommentField | "visibility", string>>;
};

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Link-stuffing is the one spam shape worth rejecting outright, queue or not. */
function linkCount(text: string): number {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

const SUCCESS = {
  public: "Thanks — it'll show up here once I've read it.",
  private: "Thanks — that goes straight to me, and nowhere else.",
} as const;

export async function submitComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  // Anything but an explicit "private" is public — that's the default on the form.
  const visibility = field(formData, "visibility") === "private" ? "private" : "public";
  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    body: field(formData, "body"),
    visibility,
  };

  // Honeypot: a hidden field no human sees, so anything in it is a bot. Report
  // success rather than an error — a bot that knows it failed just tries again.
  if (field(formData, "website")) {
    return { status: "success", visibility, message: SUCCESS[visibility] };
  }

  if (!(visibility === "public" ? commentsEnabled() : feedbackEnabled())) {
    return {
      status: "error",
      message: "This isn't working right now. Please email me instead.",
      values,
    };
  }

  // Checked before anything else touches Redis: an unknown slug is not a
  // validation error a real reader can hit, it is someone poking the endpoint.
  const slug = field(formData, "slug");
  if (!slug || !getPostBySlug(slug)) {
    return { status: "error", message: "Couldn't tell which post this was about.", values };
  }

  const errors: CommentFormState["errors"] = {};

  // A public comment needs a name to sit beside it; a private note doesn't,
  // though it helps me know who wrote it.
  if (visibility === "public" && values.name.length < LIMITS.name.min)
    errors.name = "Add a name to post publicly — or send it privately instead.";
  else if (values.name.length > LIMITS.name.max)
    errors.name = `Keep this under ${LIMITS.name.max} characters.`;

  if (
    values.email &&
    (values.email.length > LIMITS.email.max || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
  )
    errors.email = "That doesn't look like an email address.";

  if (values.body.length < LIMITS.body.min)
    errors.body = `A little more, please — at least ${LIMITS.body.min} characters.`;
  else if (values.body.length > LIMITS.body.max)
    errors.body = `Keep this under ${LIMITS.body.max} characters.`;
  else if (visibility === "public" && linkCount(values.body) > 1)
    errors.body = "Please leave links out of public comments.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the fields below.", errors, values };
  }

  const ip = clientIp(await headers());
  // Separate buckets per destination and from reviews, so commenting on a few
  // posts doesn't lock someone out of anything else.
  if (!(await withinRateLimit(visibility === "public" ? "comment" : "feedback", ip))) {
    return {
      status: "error",
      message: "You've sent a few already — try again in an hour.",
      values,
    };
  }

  try {
    if (visibility === "public") {
      await createComment({
        slug,
        name: values.name,
        body: values.body,
        email: values.email || undefined,
      });
    } else {
      await createFeedback({
        slug,
        name: values.name || undefined,
        body: values.body,
        email: values.email || undefined,
      });
    }
  } catch {
    return { status: "error", message: "Something went wrong sending that. Try again?", values };
  }

  // No revalidatePath: a comment is pending and a note is never public, so no
  // public page changed yet. Approving is what revalidates the post.
  return { status: "success", visibility, message: SUCCESS[visibility] };
}
