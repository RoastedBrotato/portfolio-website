import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { siteConfig } from "@/data/config";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-border-strong">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm font-bold uppercase tracking-[0.08em] text-foreground">
            {siteConfig.name}
          </p>
          <p className="mt-1 text-sm text-foreground-subtle">{siteConfig.role}</p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <Mail size={18} strokeWidth={1.75} />
          </a>
        </div>

        <p className="text-sm text-foreground-subtle">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
