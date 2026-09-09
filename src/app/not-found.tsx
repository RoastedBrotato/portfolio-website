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
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-foreground-muted">
          The page you&apos;re looking for may have moved or been renamed.
        </p>
        <Button href="/" className="mt-8">
          Back home
        </Button>
        <Link href="/#work" className="mt-4 text-sm text-foreground-muted hover:text-foreground">
          View selected work
        </Link>
      </Container>
    </section>
  );
}
