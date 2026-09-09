import { ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
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
          Freelance projects, contract work, or a full-time role — if it&apos;s interesting, I want
          to hear about it. I usually reply within a day.
        </p>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Button href={`mailto:${siteConfig.email}`} size="lg">
            {siteConfig.email}
            <ArrowUpRight size={16} />
          </Button>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="border-border-strong text-foreground brutal flex h-11 w-11 items-center justify-center border-2"
            >
              <LinkedinIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="border-border-strong text-foreground brutal flex h-11 w-11 items-center justify-center border-2"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <p className="text-foreground-subtle mt-10 text-sm">
          Client work goes through{" "}
          <a
            href={`mailto:${siteConfig.businessEmail}`}
            className="text-foreground-muted decoration-accent hover:text-foreground underline decoration-2 underline-offset-4 transition-colors"
          >
            {siteConfig.businessEmail}
          </a>
          .
        </p>
      </Reveal>
    </Section>
  );
}
