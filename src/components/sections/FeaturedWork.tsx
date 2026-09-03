import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectShowcase } from "@/components/project/ProjectShowcase";
import { projects } from "@/data/projects";

export function FeaturedWork() {
  return (
    <section id="work" className="scroll-mt-20 py-28 sm:py-40">
      <Container>
        <SectionHeading
          eyebrow="Selected Work"
          title="Systems and products I've designed and built"
          description="A selection of full-stack, AI, and backend systems — from problem to production."
        />
        <div className="mt-16 divide-y divide-border">
          {projects
            .filter((project) => project.featured)
            .map((project, index) => (
              <ProjectShowcase key={project.slug} project={project} index={index} />
            ))}
        </div>
      </Container>
    </section>
  );
}
