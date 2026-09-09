import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/Section";
import { Project } from "@/types";
import { visualVariantFor } from "@/lib/projectVisuals";

/**
 * Article-level section. Same rail as the homepage so the text column doesn't
 * shift when you navigate from /#work into a case study, but a tighter vertical
 * rhythm (py-14/16) because these are sub-sections of one article, not pages.
 */
function CaseStudySection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal
      as="section"
      className="grid grid-cols-1 gap-6 py-14 sm:py-16 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]"
    >
      <div>
        <SectionLabel>{label}</SectionLabel>
      </div>
      <div className="text-foreground-muted max-w-2xl text-base leading-relaxed sm:text-lg">
        {children}
      </div>
    </Reveal>
  );
}

export function CaseStudyLayout({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  const { caseStudy } = project;

  return (
    <>
      <article>
        <header className="border-border-strong relative overflow-hidden border-b-2">
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          />
          <Container className="relative grid grid-cols-1 gap-8 py-20 sm:py-28 lg:grid-cols-[var(--rail)_1fr] lg:gap-[var(--rail-gap)]">
            <div className="flex flex-col items-start gap-5">
              <SectionLabel as="p">{project.category}</SectionLabel>
              <Link
                href="/#work"
                className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </Link>
            </div>

            <div className="min-w-0">
              <h1 className="font-display text-h1 text-foreground max-w-3xl leading-[1.05] font-bold tracking-tight">
                {project.title}
              </h1>
              <p className="text-foreground-muted mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
                {project.outcome}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>

              {(project.links.demo || project.links.github) && (
                <div className="mt-10 flex flex-wrap gap-4">
                  {project.links.demo && (
                    <Button href={project.links.demo} external>
                      Live site
                      <ExternalLink size={15} />
                    </Button>
                  )}
                  {project.links.github && (
                    <Button href={project.links.github} variant="secondary" external>
                      GitHub
                      <GithubIcon className="h-[15px] w-[15px]" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Container>
        </header>

        <Container>
          <div className="py-14 sm:py-16">
            <ProjectVisual
              variant={visualVariantFor(project.slug)}
              image={project.image}
              title={project.title}
            />
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-1 gap-6 pb-14 sm:grid-cols-2 sm:pb-16">
              {project.gallery.map((src) => (
                <div
                  key={src}
                  className="border-border-strong bg-background-elevated brutal overflow-hidden border-2"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — product screenshot`}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="divide-border divide-y-2">
            <CaseStudySection label="Overview">
              <p>{caseStudy.overview}</p>
            </CaseStudySection>

            <CaseStudySection label="Problem">
              <p>{caseStudy.problem}</p>
            </CaseStudySection>

            <CaseStudySection label="Approach">
              <p>{caseStudy.solution}</p>
              {project.features.length > 0 && (
                <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-foreground-muted flex items-start gap-3 text-sm"
                    >
                      <span className="bg-accent mt-[0.5em] h-1.5 w-1.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </CaseStudySection>

            <CaseStudySection label="Architecture">
              <ArchitectureDiagram
                primary={caseStudy.architecture.primary}
                secondary={caseStudy.architecture.secondary}
              />
            </CaseStudySection>

            <CaseStudySection label="Challenges">
              <div className="flex flex-col gap-8">
                {caseStudy.challenges.map((challenge) => (
                  <div key={challenge.title}>
                    <h3 className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
                      {challenge.title}
                    </h3>
                    <p className="text-foreground-muted mt-2.5 text-base leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection label="Decisions">
              <div className="flex flex-col gap-8">
                {caseStudy.techDecisions.map((decision) => (
                  <div key={decision.decision}>
                    <h3 className="text-foreground font-mono text-sm font-bold tracking-[0.08em] uppercase">
                      {decision.decision}
                    </h3>
                    <p className="text-foreground-muted mt-2.5 text-base leading-relaxed">
                      {decision.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection label="Outcome">
              <p>{caseStudy.outcome}</p>
            </CaseStudySection>
          </div>
        </Container>
      </article>

      <nav className="border-border-strong border-t-2">
        <Container className="divide-border sm:divide-border grid grid-cols-1 divide-y-2 sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0">
          <Link
            href={`/work/${prev.slug}`}
            className="group flex flex-col gap-2 py-12 pr-0 sm:pr-10"
          >
            <span className="text-foreground-subtle group-hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.16em] uppercase transition-colors">
              <ArrowLeft size={14} />
              Previous
            </span>
            <span className="font-display text-foreground group-hover:text-accent text-xl font-bold transition-colors">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col gap-2 py-12 pl-0 text-right sm:items-end sm:pl-10"
          >
            <span className="text-foreground-subtle group-hover:text-accent inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.16em] uppercase transition-colors">
              Next
              <ArrowRight size={14} />
            </span>
            <span className="font-display text-foreground group-hover:text-accent text-xl font-bold transition-colors">
              {next.title}
            </span>
          </Link>
        </Container>
      </nav>
    </>
  );
}
