import { Section } from "@/components/ui/Section";
import { ProjectShowcase } from "@/components/project/ProjectShowcase";
import { projects } from "@/data/projects";

export function FeaturedWork() {
  const featured = projects.filter((project) => project.featured);

  return (
    <Section id="work" label="Work">
      <div className="divide-y divide-border">
        {featured.map((project, index) => (
          <ProjectShowcase key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
