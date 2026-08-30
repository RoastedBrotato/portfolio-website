import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/config";

export function ContactCTA() {
  return (
    <section id="contact" className="scroll-mt-20 relative overflow-hidden border-t border-border py-28 sm:py-36">
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -bottom-[0.22em] -left-[0.1em] select-none text-[38vw] italic leading-none text-foreground/[0.035] sm:text-[26vw] lg:-bottom-[0.24em] lg:-left-[0.06em] lg:text-[20vw]"
      >
        {siteConfig.initials}
      </span>
      <Container className="relative flex flex-col items-center text-center">
        <h2 className="font-display max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Have something <em className="italic text-accent">worth</em> building?
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
          I&apos;m available for selected freelance projects, contract work, and remote
          engineering opportunities.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href={`mailto:${siteConfig.email}`} size="lg">
            Start a Conversation
            <ArrowUpRight size={16} />
          </Button>
          <Button href={siteConfig.linkedin} variant="secondary" size="lg" external>
            LinkedIn
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-foreground-muted">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail size={16} strokeWidth={1.75} />
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </Container>
    </section>
  );
}
