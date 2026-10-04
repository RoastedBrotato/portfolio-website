import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";

/**
 * The full-stack and AI case studies as a compact three-up strip — proof that
 * the creative work is built properly, not the main event. Lives on /work and
 * /about; the homepage only shows it while Selected work has no real entries.
 */
export function EngineeringRange({
  id = "engineering",
  label = "Under the hood",
  index,
  tone,
}: {
  id?: string;
  label?: string;
  index?: number;
  tone?: SectionTone;
}) {
  const featured = projects.filter((project) => project.featured);

  return (
    <Section id={id} label={label} index={index} tone={tone}>
      <Reveal>
        <p className="text-foreground-muted max-w-xl text-lg leading-relaxed">
          Full-stack and AI work, shipped end to end: production apps, RAG systems and the
          backends behind them. The same engineering goes under every creative build.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.08, 0.16)} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
