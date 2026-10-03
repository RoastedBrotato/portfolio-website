import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookCallButton } from "@/components/ui/BookCallButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { siteConfig } from "@/data/config";

export function ContactCTA() {
  return (
    <Section id="contact" label="Contact">
      <RevealText
        as="h2"
        trigger="inView"
        className="font-display text-h2 text-foreground max-w-2xl font-bold tracking-tight"
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
        <p className="text-foreground-muted mt-6 max-w-xl text-base leading-relaxed">
          A landing page that people remember, a brand site with some motion in it, or a 3D
          product showcase — send a short brief and I&apos;ll reply within a day with questions or
          a quote.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/quote" size="lg">
            Get a quote
            <ArrowRight size={16} />
          </Button>
          <BookCallButton placement="contact" />
        </div>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-foreground-muted decoration-accent hover:text-foreground text-sm underline decoration-2 underline-offset-4 transition-colors"
          >
            {siteConfig.email}
          </a>
          <div className="flex items-center gap-4">
            <SocialLinks linkClassName="border-border-strong text-foreground brutal flex h-11 w-11 items-center justify-center border-2" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
