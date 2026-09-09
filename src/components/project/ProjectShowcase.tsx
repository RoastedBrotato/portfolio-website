import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Project } from "@/types";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { Reveal } from "@/components/ui/Reveal";
import { visualVariantFor } from "@/lib/projectVisuals";

/**
 * Homepage project row. Deliberately thin: outcome, stack, links.
 * The full description, architecture and decisions live on the case study.
 */
export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  return (
    // The padding lives on Reveal, not the <article>: Reveal is the element that
    // actually sits in the divided list, so first:/last: only resolve correctly here.
    <Reveal delay={Math.min(index * 0.08, 0.24)} className="py-12 first:pt-0 last:pb-0">
      <article className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_1.1fr] sm:items-center">
        <Link href={`/work/${project.slug}`} tabIndex={-1} aria-hidden className="block">
          <ProjectVisual
            variant={visualVariantFor(project.slug)}
            image={project.image}
            title={project.title}
          />
        </Link>

        <div className="flex flex-col">
          <span className="text-accent font-mono text-xs font-bold tracking-[0.16em] uppercase">
            {project.category}
          </span>

          <h3 className="font-display text-foreground mt-4 text-3xl font-bold tracking-tight">
            <Link href={`/work/${project.slug}`} className="hover:text-accent transition-colors">
              {project.title}
            </Link>
          </h3>

          <p className="text-foreground-muted mt-4 text-base leading-relaxed">{project.outcome}</p>

          <p className="text-foreground-subtle mt-6 font-mono text-xs leading-relaxed">
            {project.techStack.join(" · ")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={`/work/${project.slug}`}
              className="text-foreground decoration-accent hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.12em] uppercase underline decoration-2 underline-offset-4 transition-colors"
            >
              Case study
              <ArrowUpRight size={15} />
            </Link>
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
              >
                Live site
                <ExternalLink size={13} />
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
              >
                GitHub
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
