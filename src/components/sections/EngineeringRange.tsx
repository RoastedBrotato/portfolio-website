import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";

/**
 * The full-stack and AI case studies, grouped beneath the creative work.
 *
 * `lead` is for the window where Selected work has no real entries yet (every
 * slot still a dev-only placeholder): this section then takes the #work anchor
 * so the navbar's Work link still lands somewhere.
 */
export function EngineeringRange({ lead = false }: { lead?: boolean }) {
  const featured = projects.filter((project) => project.featured);

  return (
    <Section id={lead ? "work" : "engineering"} label={lead ? "Work" : "Engineering range"}>
      <Reveal>
        <p className="text-foreground-muted max-w-xl text-lg leading-relaxed">
          The engineering underneath the motion: production apps, RAG systems and the backends
          behind them — built and shipped end to end.
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
