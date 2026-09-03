import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { techStack } from "@/data/techStack";

export function TechStack() {
  return (
    <section className="border-t border-border py-28 sm:py-40">
      <Container>
        <SectionHeading eyebrow="Toolbox" title="Technology I work with" />
        <Reveal
          delay={0.1}
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {techStack.map((group) => (
            <div key={group.category}>
              <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-foreground-subtle">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
