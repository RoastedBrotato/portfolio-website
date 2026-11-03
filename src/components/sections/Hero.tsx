import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/hero/Wordmark";
import { Marquee } from "@/components/hero/Marquee";
import { siteConfig } from "@/data/config";

const MARQUEE = ["Waleed Ajaz", "creative developer", "Doha · Islamabad", "3D · motion · web", "booking projects"];

/**
 * The wordmark takes the top of the hero and the intro takes the rest: a
 * heading and a subheading, two ways forward, then the ticker. No scene, no
 * video — the work section below is where the sites appear.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="pt-12 pb-14 sm:pt-20 sm:pb-20">
        <div className="fade-up">
          <Wordmark />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div className="fade-up" style={{ animationDelay: "0.15s" }}>
            <h1 className="font-display text-h2 text-foreground max-w-[22ch]">
              I&apos;m Waleed. I design and build the websites and web apps a business sells with.
            </h1>
          </div>
          <div className="fade-up" style={{ animationDelay: "0.25s" }}>
            <p className="text-foreground-muted max-w-[44ch] text-lg leading-relaxed">
              A bit of 3D, art and motion design, and a lot of software and web development. I write
              about the work and the experiments on{" "}
              <Link href="/blog" className="text-foreground underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:decoration-accent">
                the blog
              </Link>
              .
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/quote" size="lg">
                Start a project
                <ArrowRight size={18} />
              </Button>
              <Button href="#work" variant="secondary" size="lg">
                See the work
              </Button>
            </div>
            <p className="text-foreground-subtle mt-6 text-sm">
              {siteConfig.availability} · {siteConfig.location}
            </p>
          </div>
        </div>
      </Container>

      <Marquee items={MARQUEE} />
    </section>
  );
}
