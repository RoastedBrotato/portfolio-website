"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/config";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-[0.12em] -top-[0.14em] select-none text-[38vw] italic leading-none text-foreground/[0.035] sm:text-[26vw] lg:-right-[0.08em] lg:-top-[0.16em] lg:text-[20vw]"
      >
        {siteConfig.initials}
      </span>

      <Container className="relative flex min-h-[88svh] flex-col justify-center py-28 sm:py-32">
        <motion.span
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent"
        >
          {siteConfig.role}
        </motion.span>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-display mt-6 max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          I build software that solves <em className="italic text-accent">real</em> business
          problems.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-muted sm:text-xl"
        >
          Full-stack engineer specializing in web applications, AI-powered products,
          backend systems, and intelligent automation — from first commit to production.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Button href="/#work" size="lg">
            View My Work
            <ArrowRight size={16} />
          </Button>
          <Button href="/#contact" variant="secondary" size="lg">
            Let&apos;s Work Together
          </Button>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-14 flex items-center gap-2.5 text-sm text-foreground-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {siteConfig.availability}
        </motion.div>
      </Container>
    </section>
  );
}
