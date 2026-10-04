import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { siteConfig } from "@/data/config";

/**
 * The closing ask. No embedded form — the one form lives on /quote — so this is
 * a headline, a line of copy, "Get a quote", "Book a call" and the email.
 */
export function ContactCTA({ index, tone }: { index?: number; tone?: SectionTone }) {
  return (
    <Section id="contact" label="Contact" index={index} tone={tone}>
      <RevealText
        as="h2"
        trigger="inView"
        className="font-display text-h1 text-foreground max-w-3xl leading-[1.05] font-bold tracking-tight"
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
        <p className="text-foreground-muted mt-6 max-w-xl text-lg leading-relaxed">
          A landing page that people remember, a brand site with some motion in it, or a 3D
          product showcase — send a short brief and I&apos;ll reply within a day with questions or
          a quote.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href="/quote" size="lg">
            Get a quote
            <ArrowRight size={16} />
          </Button>
          <BookCallButton placement="contact" size="lg" variant="secondary" />
        </div>

        <a
          href={`mailto:${siteConfig.email}`}
          className="text-foreground-muted decoration-accent hover:text-foreground mt-8 inline-block text-sm underline decoration-2 underline-offset-4 transition-colors"
        >
          {siteConfig.email}
        </a>
      </Reveal>
    </Section>
  );
}
