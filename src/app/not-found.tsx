import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center">
      <Container className="flex flex-col items-center text-center">
        <span className="inline-block bg-accent px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground">
          404
        </span>
        <h1 className="font-display mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Looks like we wandered off-trail.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-foreground-muted">
          Even the best routes have detours. Let&apos;s get you back to the work.
        </p>
        <Button href="/work" className="mt-8">
          Back to the work
        </Button>
        <Link href="/" className="mt-4 text-sm text-foreground-muted hover:text-foreground">
          Or start from the top
        </Link>
      </Container>
    </section>
  );
}
