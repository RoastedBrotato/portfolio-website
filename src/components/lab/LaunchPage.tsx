"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useSceneTier } from "@/lib/useSceneTier";
import type { Colorway } from "@/components/scene/speaker/colorways";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";

const LaunchScene = dynamic(() => import("@/components/scene/speaker/LaunchScene"), { ssr: false });

/*
 * A launch page for Quarr One, a fictional speaker — the Immersive Landing
 * Page package as a working piece. One long page: a big opener, a pinned
 * scroll sequence, the numbers, and a waitlist. The product is invented and
 * every surface says so; the waitlist form sends nothing.
 */

const STEPS: { at: number; label: string; title: string; body: string; colorway: Colorway }[] = [
  {
    at: 0,
    label: "01",
    title: "Turn it.",
    body: "A slab of a speaker: 21 centimetres tall, square edges, nothing on the top to collect dust.",
    colorway: "graphite",
  },
  {
    at: 0.27,
    label: "02",
    title: "Open it.",
    body: "A 6.5″ woofer and a 1″ dome tweeter, each with its own 60 W amplifier behind the baffle.",
    colorway: "graphite",
  },
  {
    at: 0.55,
    label: "03",
    title: "Colour it.",
    body: "Graphite, Bone or Signal. The baffle stays dark so the drivers never fight the finish.",
    colorway: "signal",
  },
  {
    at: 0.8,
    label: "04",
    title: "Hear it.",
    body: "45 Hz to 22 kHz from something the size of a hardback. USB-C, optical or line in.",
    colorway: "bone",
  },
];

const NUMBERS: [string, string][] = [
  ["45 Hz", "Bass extension"],
  ["2 × 60 W", "Class D, bi-amped"],
  ["21 cm", "Tall"],
  ["3", "Inputs, no app"],
];

function stepAt(p: number) {
  let index = 0;
  STEPS.forEach((step, i) => {
    if (p >= step.at) index = i;
  });
  return index;
}

function Waitlist() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="border-accent text-foreground border-2 p-6 text-base leading-relaxed" role="status">
        Thanks — though nothing was sent. Quarr One is a fictional product and this form is part of
        the demo. If you want a page like this for something real, that part works.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="waitlist-email" className="sr-only">
        Email
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        placeholder="you@example.com"
        // Not a real list: nothing is collected, so don't let a browser autofill a real address.
        autoComplete="off"
        className="border-border-strong bg-background text-foreground placeholder:text-foreground-subtle focus:border-accent h-14 flex-1 border-2 px-4 text-base outline-none"
      />
      <Button type="submit" size="lg">
        Join the waitlist
      </Button>
    </form>
  );
}

export function LaunchPage() {
  const tier = useSceneTier();
  const pinned = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);

  // 0 when the pinned section's top meets the viewport top, 1 when its bottom
  // meets the viewport bottom: exactly the stretch the sticky frame is stuck.
  const { scrollYProgress } = useScroll({ target: pinned, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(stepAt(p)));

  useEffect(() => {
    const el = pinned.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scene = tier?.kind === "scene";

  return (
    <div className="bg-plane-0">
      <p className="bg-accent text-accent-foreground py-2 text-center font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
        Fictional product · a landing page demo by Waleed Ajaz
      </p>

      {/* Opener */}
      <section className="relative overflow-hidden">
        <Container className="flex min-h-[80svh] flex-col justify-end py-16 sm:py-24">
          <p className="text-accent font-mono text-xs font-bold tracking-[0.16em] uppercase">
            Quarr One · bookshelf speaker
          </p>
          <h1 className="font-display text-mega text-foreground mt-4 leading-[0.9] font-bold tracking-tight">
            Small box.
            <br />
            <em className="text-accent italic">Whole</em> room.
          </h1>
          <p className="text-foreground-muted mt-8 max-w-lg text-lg leading-relaxed">
            A speaker the size of a hardback that sounds like it isn&apos;t. Scroll to take it apart.
          </p>
        </Container>
      </section>

      {/* The pinned sequence: 400svh of scroll, one sticky frame. */}
      <section ref={pinned} className="border-border-strong relative h-[400svh] border-t-2">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="absolute inset-0">
            {scene ? (
              <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
                <LaunchScene
                  quality={tier.quality}
                  progress={scrollYProgress}
                  colorway={STEPS[step].colorway}
                  active={active}
                  onReady={() => setReady(true)}
                />
              </div>
            ) : tier?.kind === "fallback" ? (
              <Image
                src="/lab/configurator/poster.jpg"
                alt="Quarr One speaker, three-quarter view"
                fill
                sizes="100vw"
                className="object-contain"
              />
            ) : null}
          </div>

          {/* Captions sit in the bottom-left on a dark plane, never over the model's centre. */}
          <Container className="pointer-events-none relative flex h-full items-end pb-10 sm:pb-16">
            <div className="bg-plane-0/85 max-w-sm p-5 backdrop-blur-sm sm:p-6">
              <div className="flex gap-2" aria-hidden>
                {STEPS.map((s, i) => (
                  <span key={s.label} className={cn("h-0.5 w-8 transition-colors", i <= step ? "bg-accent" : "bg-border")} />
                ))}
              </div>
              {/* aria-live so the step change is announced, the way it's seen. */}
              <div aria-live="polite">
                <p className="text-accent mt-4 font-mono text-xs font-bold tracking-[0.16em]">{STEPS[step].label}</p>
                <h2 className="font-display text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                  {STEPS[step].title}
                </h2>
                <p className="text-foreground-muted mt-3 text-base leading-relaxed">{STEPS[step].body}</p>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* The numbers */}
      <section className="border-border-strong border-t-2 py-20 sm:py-28">
        <Container>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {NUMBERS.map(([value, label], i) => (
              <Reveal key={label} delay={i * 0.06}>
                <dt className="text-foreground-subtle font-mono text-[11px] tracking-[0.14em] uppercase">{label}</dt>
                <dd className="font-display text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                  <CountUp value={value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Waitlist */}
      <section className="border-border-strong bg-plane-2 border-t-2 py-20 sm:py-28">
        <Container className="max-w-3xl">
          <h2 className="font-display text-h1 text-foreground leading-[1.05] font-bold tracking-tight">
            Ships when it exists.
          </h2>
          <p className="text-foreground-muted mt-4 mb-10 max-w-lg text-lg leading-relaxed">
            Which is never: Quarr One is made up. The form below is part of the demo and sends nothing.
          </p>
          <Waitlist />
        </Container>
      </section>

      <section className="border-border-strong border-t-2 py-16">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground-muted max-w-xl text-base leading-relaxed">
            This page is a demo of the Immersive Landing Page package: a pinned, scroll-driven 3D
            sequence, built to stay smooth on a mid-range phone.
          </p>
          <Button href="/quote?package=immersive-landing" size="lg" variant="secondary">
            Get one built
          </Button>
        </Container>
      </section>
    </div>
  );
}
