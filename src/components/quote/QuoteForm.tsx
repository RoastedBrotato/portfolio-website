"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { Field, inputClass } from "@/components/ui/FormField";
import { submitQuote, type QuoteFormState } from "@/app/quote/actions";
import {
  budgetRanges,
  currency,
  projectTypes,
  referralSources,
  timelines,
} from "@/data/pricing";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { cn } from "@/lib/utils";

const DESCRIPTION_MAX = 3000;

/* Lives here, not in actions.ts: a "use server" module may only export async functions. */
const INITIAL_STATE: QuoteFormState = { status: "idle" };

export type QuotePlacement = "quote-page" | "pricing" | "home";

/** Native <select> for keyboard and screen-reader behaviour, styled to match the inputs. */
function Select({
  id,
  name,
  defaultValue,
  required,
  invalid,
  placeholder,
  options,
}: {
  /** Suffixed per placement; `name` is what the server reads. */
  id: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  invalid?: boolean;
  placeholder: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={invalid || undefined}
        defaultValue={defaultValue ?? ""}
        className={cn(inputClass, "appearance-none pr-10")}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className="text-foreground-muted pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
      />
    </div>
  );
}

// Bands are stored currency-free; the code is added for display only.
const budgetOptions = budgetRanges.map((range) => ({
  value: range.value,
  label: range.value === "unsure" ? range.label : `${currency.code} ${range.label}`,
}));

/**
 * The quote request form. One component for /quote, the bottom of /pricing and
 * the homepage contact section; `placement` says which, and is stored with the
 * lead alongside the visitor's UTM attribution.
 */
export function QuoteForm({
  placement,
  defaultProjectType,
}: {
  placement: QuotePlacement;
  /** Preselects the project type, e.g. from /quote?package=… */
  defaultProjectType?: string;
}) {
  const [state, formAction, pending] = useActionState<QuoteFormState, FormData>(
    submitQuote,
    INITIAL_STATE,
  );
  const [descriptionLength, setDescriptionLength] = useState(
    state.values?.description?.length ?? 0,
  );
  const started = useRef(false);

  useEffect(() => {
    if (state.status === "success") track("quote_submit", { placement });
  }, [state.status, placement]);

  // Attribution is read at submit, not render: it lives in browser storage, so
  // reading it during render would differ between server and client.
  function submit(formData: FormData) {
    const attribution = readAttribution();
    formData.set("utm_source", attribution.utmSource ?? "");
    formData.set("utm_medium", attribution.utmMedium ?? "");
    formData.set("utm_campaign", attribution.utmCampaign ?? "");
    formData.set("landing_page", attribution.landingPage ?? "");
    formData.set("referrer", attribution.referrer ?? "");
    formData.set("placement", placement);
    formAction(formData);
  }

  if (state.status === "success") {
    return (
      <div className="border-border-strong bg-background brutal max-w-2xl border-2 p-7" role="status">
        <p className="text-foreground flex items-center gap-2.5 font-mono text-sm font-bold tracking-[0.1em] uppercase">
          <Check size={18} className="text-accent" />
          Request sent
        </p>
        <p className="text-foreground-muted mt-4 text-base leading-relaxed">{state.message}</p>
        <div className="mt-6">
          <BookCallButton placement={`quote-success-${placement}`} size="md" />
        </div>
      </div>
    );
  }

  const values = state.values;
  const errors = state.errors;
  // Field ids must be unique per page; /pricing and the homepage each embed one
  // form, but suffixing keeps labels correct if two ever share a page.
  const id = (name: string) => `${name}-${placement}`;

  return (
    <form
      action={submit}
      noValidate
      className="max-w-2xl"
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        track("quote_start", { placement });
      }}
    >
      {/* Honeypot. Off-screen rather than display:none, and out of the tab
          order and the a11y tree. */}
      <div aria-hidden className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name" name={id("name")} error={errors?.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            aria-invalid={Boolean(errors?.name) || undefined}
            defaultValue={values?.name}
            className={inputClass}
          />
        </Field>

        <Field label="Email" name={id("email")} error={errors?.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors?.email) || undefined}
            defaultValue={values?.email}
            className={inputClass}
          />
        </Field>

        <Field label="Company" name={id("company")} error={errors?.company} hint="Optional.">
          <input
            id={id("company")}
            name="company"
            type="text"
            maxLength={100}
            autoComplete="organization"
            defaultValue={values?.company}
            className={inputClass}
          />
        </Field>

        <Field label="Project type" name={id("projectType")} error={errors?.projectType}>
          <Select
            id={id("projectType")}
            name="projectType"
            required
            invalid={Boolean(errors?.projectType)}
            defaultValue={values?.projectType ?? defaultProjectType}
            placeholder="Choose one"
            options={projectTypes}
          />
        </Field>

        <Field label="Budget" name={id("budget")} error={errors?.budget}>
          <Select
            id={id("budget")}
            name="budget"
            required
            invalid={Boolean(errors?.budget)}
            defaultValue={values?.budget}
            placeholder="Choose a range"
            options={budgetOptions}
          />
        </Field>

        <Field label="Timeline" name={id("timeline")} error={errors?.timeline}>
          <Select
            id={id("timeline")}
            name="timeline"
            required
            invalid={Boolean(errors?.timeline)}
            defaultValue={values?.timeline}
            placeholder="Choose one"
            options={timelines}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="What are you making?" name={id("description")} error={errors?.description}>
          <textarea
            id={id("description")}
            name="description"
            required
            rows={6}
            maxLength={DESCRIPTION_MAX}
            aria-invalid={Boolean(errors?.description) || undefined}
            defaultValue={values?.description}
            onChange={(e) => setDescriptionLength(e.target.value.length)}
            className={`${inputClass} resize-y leading-relaxed`}
            placeholder="What it is, who it's for, and what should happen when someone lands on it."
          />
        </Field>
        <p className="text-foreground-subtle mt-1.5 text-right font-mono text-xs">
          {descriptionLength}/{DESCRIPTION_MAX}
        </p>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Links or references"
          name={id("links")}
          error={errors?.links}
          hint="Optional. Your current site, sites you like, a Figma file."
        >
          <textarea
            id={id("links")}
            name="links"
            rows={2}
            maxLength={600}
            defaultValue={values?.links}
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="How did you find me?" name={id("source")} hint="Optional.">
          <Select
            id={id("source")}
            name="source"
            defaultValue={values?.source}
            placeholder="Choose one"
            options={referralSources}
          />
        </Field>
      </div>

      {state.status === "error" && state.message ? (
        <p className="border-accent text-accent mt-6 border-2 px-3.5 py-2.5 text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          aria-disabled={pending}
          className="disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send request"}
          {pending ? null : <ArrowRight size={16} />}
        </Button>
        <p className="text-foreground-subtle text-sm">I reply within one working day.</p>
      </div>
    </form>
  );
}
