import { Mail } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";
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
          <SocialLinks linkClassName="text-foreground-muted transition-colors hover:text-foreground" />
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
