import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { ArchitectureDiagram } from "@/components/case-study/ArchitectureDiagram";
import { Project } from "@/types";

const visualVariant: Record<string, "ai" | "realtime" | "business"> = {
  "moementum-fit": "business",
  "ai-meeting-intelligence": "ai",
  "realtime-platform": "realtime",
  "donor-platform": "business",
};

function CaseStudySection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-6 py-14 lg:grid-cols-[240px_1fr] lg:gap-16 lg:py-16">
      <div>
        <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
        <h2 className="font-display mt-3 text-2xl font-medium tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
        {children}
      </div>
    </section>
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
        <header className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          />
          <Container className="relative py-20 sm:py-28">
            <Link
              href="/#work"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft size={15} />
              Back to work
            </Link>

            <span className="mt-8 block font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {project.category}
            </span>
            <h1 className="font-display mt-4 max-w-3xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-muted sm:text-xl">
              {project.outcome}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>

            {(project.links.demo || project.links.github) && (
              <div className="mt-8 flex flex-wrap gap-4">
                {project.links.demo && (
                  <Button href={project.links.demo} external>
                    Live Demo
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
          </Container>
        </header>

        <Container>
          <div className="py-14 lg:py-16">
            <ProjectVisual
              variant={visualVariant[project.slug] ?? "ai"}
              image={project.image}
              title={project.title}
            />
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-1 gap-6 pb-14 sm:grid-cols-2 lg:pb-16">
              {project.gallery.map((src) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-2xl border border-border bg-background-elevated"
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

          <div className="divide-y divide-border">
            <CaseStudySection eyebrow="Overview" title="What this is">
              <p>{caseStudy.overview}</p>
            </CaseStudySection>

            <CaseStudySection eyebrow="Problem" title="The problem">
              <p>{caseStudy.problem}</p>
            </CaseStudySection>

            <CaseStudySection eyebrow="Solution" title="The approach">
              <p>{caseStudy.solution}</p>
              {project.features.length > 0 && (
                <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-foreground-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </CaseStudySection>

            <section className="py-14 lg:py-16">
              <div className="mb-10">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  Architecture
                </span>
                <h2 className="font-display mt-3 text-2xl font-medium tracking-tight text-foreground">
                  How it&apos;s put together
                </h2>
              </div>
              <ArchitectureDiagram
                primary={caseStudy.architecture.primary}
                secondary={caseStudy.architecture.secondary}
              />
            </section>

            <CaseStudySection eyebrow="Challenges" title="Key engineering challenges">
              <div className="flex flex-col gap-8">
                {caseStudy.challenges.map((challenge) => (
                  <div key={challenge.title}>
                    <h3 className="text-base font-semibold text-foreground">
                      {challenge.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="Decisions" title="Technology choices">
              <div className="flex flex-col gap-8">
                {caseStudy.techDecisions.map((decision) => (
                  <div key={decision.decision}>
                    <h3 className="text-base font-semibold text-foreground">
                      {decision.decision}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                      {decision.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="Outcome" title="Where it landed">
              <p>{caseStudy.outcome}</p>
            </CaseStudySection>
          </div>
        </Container>
      </article>

      <nav className="border-t border-border">
        <Container className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <Link
            href={`/work/${prev.slug}`}
            className="group flex flex-col gap-2 py-10 pr-0 sm:pr-10"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
              <ArrowLeft size={14} />
              Previous
            </span>
            <span className="font-display text-xl font-medium text-foreground transition-colors group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col gap-2 py-10 pl-0 text-right sm:items-end sm:pl-10"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
              Next
              <ArrowRight size={14} />
            </span>
            <span className="font-display text-xl font-medium text-foreground transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        </Container>
      </nav>
    </>
  );
}
