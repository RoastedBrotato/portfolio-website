import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";
import { getProjectBySlug, projects } from "@/data/projects";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/* Its own card per case study, rather than inheriting /work's. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return renderOgImage({
    tag: project?.category ?? "Work",
    headline: project ? `${project.title} — ${project.outcome}` : "Case study",
  });
}
