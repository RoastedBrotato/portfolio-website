"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
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

/*
 * Where the form is embedded, stored with the lead. Only /quote today: the
 * homepage and /services link there instead of embedding a copy. Older leads
 * may carry "pricing" or "home" from before that change.
 */
export type QuotePlacement = "quote-page";

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

/** Step one's choices, kept for the session so a visitor who leaves and comes back picks up where they were. */
const STEP_ONE_KEY = "quote-step-one";
const STEP_ONE_FIELDS = ["projectType", "budget", "timeline"] as const;
type StepOne = Partial<Record<(typeof STEP_ONE_FIELDS)[number], string>>;

function readStepOne(): StepOne {
  try {
    return JSON.parse(sessionStorage.getItem(STEP_ONE_KEY) ?? "{}") as StepOne;
  } catch {
    return {};
  }
}

function writeStepOne(values: StepOne) {
  try {
    sessionStorage.setItem(STEP_ONE_KEY, JSON.stringify(values));
  } catch {
    // Private mode or blocked storage: the form still works, it just won't remember.
  }
}

// Bands are stored currency-free; the code is added for display only.
const budgetOptions = budgetRanges.map((range) => ({
  value: range.value,
  label: range.value === "unsure" ? range.label : `${currency.code} ${range.label}`,
}));

/**
 * The quote request form, on /quote. `placement` says where it was embedded,
 * and is stored with the lead alongside the visitor's UTM attribution.
 *
 * Two steps (audit 5.2): the project (type, budget, timeline), then the
 * details. Both steps are one <form>, so the submission and the server
 * validation are unchanged; step two is only hidden until step one is filled.
 * Finishing step one fires `quote_step` with the choices, so a visitor from an
 * ad who bounces at the contact fields still records what they wanted.
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
  const form = useRef<HTMLFormElement>(null);
  const [stepOneErrors, setStepOneErrors] = useState<StepOne>({});
  // After a failed submit, land on whichever step has the problem.
  const [step, setStep] = useState<1 | 2>(() => {
    if (!state.values) return 1;
    const e = state.errors;
    return e?.projectType || e?.budget || e?.timeline ? 1 : 2;
  });

  // Restore step one from the session, unless the server just sent values
  // back (or the URL already picked a package). In an effect: storage isn't
  // readable during the server render.
  useEffect(() => {
    if (state.values) return;
    const el = form.current;
    if (!el) return;
    const saved = readStepOne();
    for (const name of STEP_ONE_FIELDS) {
      if (name === "projectType" && defaultProjectType) continue;
      const field = el.elements.namedItem(name) as HTMLSelectElement | null;
      const value = saved[name];
      if (field && value) field.value = value;
    }
  }, [state.values, defaultProjectType]);

  function next() {
    const data = new FormData(form.current!);
    const values: StepOne = Object.fromEntries(
      STEP_ONE_FIELDS.map((name) => [name, String(data.get(name) ?? "")]),
    );
    const missing: StepOne = {};
    if (!values.projectType) missing.projectType = "Choose a project type.";
    if (!values.budget) missing.budget = "Choose a budget range.";
    if (!values.timeline) missing.timeline = "Choose a timeline.";
    setStepOneErrors(missing);
    if (Object.keys(missing).length > 0) return;

    writeStepOne(values);
    track("quote_step", { placement, ...values });
    setStep(2);
    // The next field the visitor needs, once step two is showing.
    requestAnimationFrame(() => document.getElementById(id("name"))?.focus());
  }

  function back() {
    setStep(1);
    requestAnimationFrame(() => document.getElementById(id("projectType"))?.focus());
  }

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
          {/* The red square mark, landing. */}
          <span aria-hidden className="bg-accent mark-in h-3 w-3" />
          Request sent
          <Check size={18} className="text-accent" />
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
  // Field ids are suffixed by placement so labels stay correct if two forms
  // ever share a page.
  const id = (name: string) => `${name}-${placement}`;

  return (
    <form
      ref={form}
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

      <p
        aria-live="polite"
        className="text-foreground-subtle mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase"
      >
        <span aria-hidden className="flex gap-1.5">
          <span className="bg-accent h-0.5 w-6" />
          <span className={cn("h-0.5 w-6 transition-colors", step === 2 ? "bg-accent" : "bg-border")} />
        </span>
        Step {step} of 2 · {step === 1 ? "The project" : "About you"}
      </p>

      {/* Step one: the project. */}
      <div hidden={step !== 1} className={cn(step === 1 && "step-in")}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Project type"
            name={id("projectType")}
            error={stepOneErrors.projectType ?? errors?.projectType}
          >
            <Select
              id={id("projectType")}
              name="projectType"
              required
              invalid={Boolean(stepOneErrors.projectType ?? errors?.projectType)}
              defaultValue={values?.projectType ?? defaultProjectType}
              placeholder="Choose one"
              options={projectTypes}
            />
          </Field>

          <Field label="Budget" name={id("budget")} error={stepOneErrors.budget ?? errors?.budget}>
            <Select
              id={id("budget")}
              name="budget"
              required
              invalid={Boolean(stepOneErrors.budget ?? errors?.budget)}
              defaultValue={values?.budget}
              placeholder="Choose a range"
              options={budgetOptions}
            />
          </Field>

          <Field
            label="Timeline"
            name={id("timeline")}
            error={stepOneErrors.timeline ?? errors?.timeline}
          >
            <Select
              id={id("timeline")}
              name="timeline"
              required
              invalid={Boolean(stepOneErrors.timeline ?? errors?.timeline)}
              defaultValue={values?.timeline}
              placeholder="Choose one"
              options={timelines}
            />
          </Field>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="button" size="lg" onClick={next}>
            Continue
            <ArrowRight size={16} />
          </Button>
          <p className="text-foreground-subtle text-sm">Three choices, then your details.</p>
        </div>
      </div>

      {/* Step two: the details. Step one stays in the form while hidden, so
          its values submit with this. */}
      <div hidden={step !== 2} className={cn(step === 2 && "step-in")}>
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
          <Button type="button" variant="secondary" size="lg" onClick={back}>
            <ArrowLeft size={16} />
            Back
          </Button>
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
      </div>
    </form>
  );
}
