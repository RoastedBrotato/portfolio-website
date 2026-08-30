import { Container } from "@/components/ui/Container";

const items = ["React", "TypeScript", "Python", ".NET", "Go", "PostgreSQL", "Docker", "AI / RAG"];

export function CredibilityStrip() {
  return (
    <section className="border-y border-border py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center sm:justify-between sm:gap-x-6">
          {items.map((item, i) => (
            <div key={item} className="flex items-center gap-x-3 gap-y-3 sm:gap-x-6">
              <span className="font-mono text-xs tracking-wide text-foreground-subtle sm:text-sm">
                {item}
              </span>
              {i < items.length - 1 && (
                <span className="hidden text-foreground-subtle/40 sm:inline">·</span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
