import { ExternalLink } from "lucide-react";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";
import { shipped } from "@/data/shipped";

/**
 * The "Make it work" proof: the full-stack and AI case studies as a compact
 * three-up strip, then the shipped work that has no write-up yet as rows.
 * Lives on /work and /about; the homepage only shows it while Selected work
 * has no real entries.
 */
export function EngineeringRange({
  id = "engineering",
  label = "The part that has to work",
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
          Production apps, donation systems, RAG platforms and the backends under the creative
          builds. The same engineering goes under every site on this page.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.08, 0.16)} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {shipped.length > 0 ? (
        <div className="mt-20">
          <Reveal>
            <p className="text-foreground-subtle font-mono text-xs tracking-[0.14em] uppercase">
              Also shipped
            </p>
          </Reveal>
          <ul className="border-border-strong divide-border mt-5 max-w-3xl divide-y border-y-2">
            {shipped.map((item, i) => (
              <li key={item.href}>
                <Reveal delay={Math.min(i * 0.06, 0.18)}>
                  <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-8">
                    <div>
                      <h3 className="font-display text-foreground flex flex-wrap items-center gap-3 text-xl font-bold tracking-tight">
                        {item.title}
                        {item.mine ? (
                          <span className="border-accent text-accent border-2 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.16em] uppercase">
                            My studio
                          </span>
                        ) : null}
                      </h3>
                      <p className="text-foreground-muted mt-2 max-w-xl text-sm leading-relaxed">
                        {item.what}
                      </p>
                      <p className="text-foreground mt-2 max-w-xl text-sm leading-relaxed">
                        {item.part}
                      </p>
                    </div>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 self-start font-mono text-xs tracking-[0.12em] uppercase transition-colors sm:self-center"
                    >
                      {item.linkLabel}
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
