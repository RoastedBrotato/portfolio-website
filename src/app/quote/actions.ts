"use server";

import { headers } from "next/headers";
import { siteConfig } from "@/data/config";
import { budgetRanges, projectTypes, referralSources, timelines } from "@/data/pricing";
import { clientIp, withinRateLimit } from "@/lib/reviews";
import {
  buildQuote,
  quoteEmailEnabled,
  quoteStorageEnabled,
  saveQuote,
  sendQuoteNotification,
} from "@/lib/quotes";

/*
 * Public submission endpoint for /quote and the embedded copies of the form.
 * Like the review action, nothing from the client is trusted: every field is
 * re-validated, select values are checked against the option lists, and the
 * attribution fields are length-capped like any other input.
 */

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  company: { max: 100 },
  description: { min: 20, max: 3000 },
  links: { max: 600 },
  attribution: { max: 300 },
} as const;

type FieldName =
  | "name"
  | "email"
  | "company"
  | "projectType"
  | "budget"
  | "timeline"
  | "description"
  | "links"
  | "source";

export type QuoteFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<FieldName, string>>;
  /** Echoed back so a validation error doesn't wipe what the visitor typed. */
  values?: Partial<Record<FieldName, string>>;
};

function field(formData: FormData, key: string, max = 5000): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label;
}

const SUCCESS_MESSAGE =
  "Got it — thanks. I'll reply within one working day, usually sooner, from " +
  siteConfig.email +
  ".";

export async function submitQuote(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const values = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    company: field(formData, "company"),
    projectType: field(formData, "projectType"),
    budget: field(formData, "budget"),
    timeline: field(formData, "timeline"),
    description: field(formData, "description"),
    links: field(formData, "links"),
    source: field(formData, "source"),
  };

  // Honeypot — report success so a bot has no signal to retry on.
  if (field(formData, "website")) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  if (!quoteStorageEnabled() && !quoteEmailEnabled()) {
    return {
      status: "error",
      message: `The form isn't connected right now — please email ${siteConfig.email} instead.`,
      values,
    };
  }

  const errors: QuoteFormState["errors"] = {};

  if (values.name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (values.name.length > LIMITS.name.max)
    errors.name = `Keep this under ${LIMITS.name.max} characters.`;

  if (!values.email) errors.email = "I'll need an email to reply to.";
  else if (
    values.email.length > LIMITS.email.max ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)
  )
    errors.email = "That doesn't look like an email address.";

  if (values.company.length > LIMITS.company.max)
    errors.company = `Keep this under ${LIMITS.company.max} characters.`;

  if (!labelFor(projectTypes, values.projectType)) errors.projectType = "Pick the closest fit.";
  if (!labelFor(budgetRanges, values.budget)) errors.budget = "Pick a range — “Not sure yet” is fine.";
  if (!labelFor(timelines, values.timeline)) errors.timeline = "Pick a timeline.";

  if (values.description.length < LIMITS.description.min)
    errors.description = "A sentence or two more, please — what are you making, and for whom?";
  else if (values.description.length > LIMITS.description.max)
    errors.description = `Keep this under ${LIMITS.description.max} characters.`;

  if (values.links.length > LIMITS.links.max)
    errors.links = `Keep this under ${LIMITS.links.max} characters.`;

  // Optional, but if it's set it has to be one of ours.
  if (values.source && !labelFor(referralSources, values.source)) values.source = "";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the fields below.", errors, values };
  }

  const ip = clientIp(await headers());
  if (!(await withinRateLimit("quote", ip))) {
    return {
      status: "error",
      message: `You've sent a few already — try again in an hour, or email ${siteConfig.email}.`,
      values,
    };
  }

  const max = LIMITS.attribution.max;
  const quote = buildQuote({
    name: values.name,
    email: values.email,
    company: values.company || undefined,
    projectType: values.projectType,
    budget: values.budget,
    timeline: values.timeline,
    description: values.description,
    links: values.links || undefined,
    source: values.source || undefined,
    attribution: {
      utmSource: field(formData, "utm_source", max) || undefined,
      utmMedium: field(formData, "utm_medium", max) || undefined,
      utmCampaign: field(formData, "utm_campaign", max) || undefined,
      landingPage: field(formData, "landing_page", max) || undefined,
      referrer: field(formData, "referrer", max) || undefined,
    },
    placement: field(formData, "placement", 40) || undefined,
  });

  // Run both; the lead is received if either one lands.
  const [stored, emailed] = await Promise.allSettled([
    quoteStorageEnabled() ? saveQuote(quote) : Promise.reject(new Error("storage off")),
    quoteEmailEnabled()
      ? sendQuoteNotification(
          quote,
          {
            projectType: labelFor(projectTypes, quote.projectType)!,
            budget: labelFor(budgetRanges, quote.budget)!,
            timeline: labelFor(timelines, quote.timeline)!,
            source: quote.source ? labelFor(referralSources, quote.source) : undefined,
          },
          process.env.QUOTE_NOTIFY_EMAIL || siteConfig.email,
        )
      : Promise.reject(new Error("email off")),
  ]);

  if (stored.status === "rejected" && quoteStorageEnabled())
    console.error("[quote] failed to store", stored.reason);
  if (emailed.status === "rejected" && quoteEmailEnabled())
    console.error("[quote] failed to send notification", emailed.reason);

  if (stored.status === "rejected" && emailed.status === "rejected") {
    return {
      status: "error",
      message: `Something went wrong sending that. Try again, or email ${siteConfig.email}.`,
      values,
    };
  }

  return { status: "success", message: SUCCESS_MESSAGE };
}
