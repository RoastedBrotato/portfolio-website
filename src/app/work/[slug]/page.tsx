import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { CreativeStudyLayout } from "@/components/case-study/CreativeStudyLayout";
import { getAdjacentProjects, getProjectBySlug, projects } from "@/data/projects";
import { getStudies, getWorkBySlug } from "@/data/work";
import { caseStudyGraph, JsonLd, pageMetadata } from "@/lib/seo";

/*
 * Two templates under one route: engineering case studies from projects.ts,
 * creative studies from work.ts. Slugs are unique across both.
 */
export function generateStaticParams() {
  return [
    ...projects.map((project) => ({ slug: project.slug })),
    ...getStudies().map((item) => ({ slug: item.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const piece = project ? undefined : getWorkBySlug(slug);
  const title = project?.title ?? piece?.title;
  const description = project?.outcome ?? piece?.description;

  if (!title) {
    return {};
  }

  return pageMetadata({ title, description: description ?? title, path: `/work/${slug}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project) {
    const { prev, next } = getAdjacentProjects(slug);
    return (
      <>
        <JsonLd
          data={caseStudyGraph({
            slug,
            title: project.title,
            description: project.outcome,
            kind: project.category,
            href: project.links.demo,
            tags: project.techStack,
          })}
        />
        <CaseStudyLayout project={project} prev={prev} next={next} />
      </>
    );
  }

  const piece = getWorkBySlug(slug);
  if (!piece) {
    notFound();
  }

  const studies = getStudies();
  const next = studies[(studies.findIndex((item) => item.slug === slug) + 1) % studies.length];
  return (
    <>
      <JsonLd data={caseStudyGraph(piece)} />
      <CreativeStudyLayout item={piece} next={next.slug === slug ? undefined : next} />
    </>
  );
}
