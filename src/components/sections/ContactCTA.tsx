import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { siteConfig } from "@/data/config";

/**
 * The closing ask. No embedded form — the one form lives on /quote — so this is
 * a headline, a line of copy, "Start a project", "Book a call" and the email.
 */
export function ContactCTA({ index, tone }: { index?: number; tone?: SectionTone }) {
  return (
    <Section id="contact" label="Contact" index={index} tone={tone}>
      <RevealText
        as="h2"
        trigger="inView"
        className="font-display text-h1 text-foreground max-w-[14ch]"
      >
        {[
          { text: "Tell" },
          { text: "me" },
          { text: "what" },
          { text: "you're", emphasis: true },
          { text: "building." },
        ]}
      </RevealText>

      <Reveal delay={0.1}>
        <p className="text-foreground-muted mt-6 max-w-[48ch] text-lg leading-relaxed">
          A site for a new business, a rebuild of one that isn&apos;t working, or a web app your
          team runs on. Send a short brief and you&apos;ll have a reply within one working day — with
          questions, or a price.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href="/quote" size="lg">
            Start a project
            <ArrowRight size={18} />
          </Button>
          <BookCallButton placement="contact" size="lg" variant="secondary" />
        </div>

        <a
          href={`mailto:${siteConfig.email}`}
          className="text-foreground-muted hover:text-foreground mt-8 inline-block text-sm underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:decoration-accent"
        >
          {siteConfig.email}
        </a>
      </Reveal>
    </Section>
  );
}
