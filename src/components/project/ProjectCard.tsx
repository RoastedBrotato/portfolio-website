import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Project } from "@/types";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { visualVariantFor } from "@/lib/projectVisuals";

const secondaryLink =
  "text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors";

/**
 * Compact case-study card for the "Engineering range" grid. Deliberately
 * thinner than a Selected work card — these sit beneath the creative pieces —
 * so it's outcome, stack and links; the case study carries everything else.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col">
      <Link href={`/work/${project.slug}`} tabIndex={-1} aria-hidden className="block">
        <ProjectVisual
          variant={visualVariantFor(project.slug)}
          image={project.image}
          title={project.title}
        />
      </Link>

      <span className="text-accent mt-6 font-mono text-xs font-bold tracking-[0.16em] uppercase">
        {project.category}
      </span>

      <h3 className="font-display text-foreground mt-3 text-2xl font-bold tracking-tight">
        <Link href={`/work/${project.slug}`} className="hover:text-accent transition-colors">
          {project.title}
        </Link>
      </h3>

      <p className="text-foreground-muted mt-3 text-sm leading-relaxed">{project.outcome}</p>

      <p className="text-foreground-subtle mt-4 font-mono text-xs leading-relaxed">
        {project.techStack.slice(0, 5).join(" · ")}
      </p>

      {/* mt-auto pins the links to the card's bottom edge, so a row of cards
          with different-length outcomes still lines its links up. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
        <Link
          href={`/work/${project.slug}`}
          className="text-foreground decoration-accent hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-[0.12em] uppercase underline decoration-2 underline-offset-4 transition-colors"
        >
          Case study
          <ArrowUpRight size={15} />
        </Link>
        {project.links.demo && (
          <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={secondaryLink}>
            Live site
            <ExternalLink size={13} />
          </a>
        )}
        {project.links.github && (
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={secondaryLink}>
            GitHub
            <GithubIcon className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
