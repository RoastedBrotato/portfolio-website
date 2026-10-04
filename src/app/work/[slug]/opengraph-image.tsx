import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";
import { getProjectBySlug, projects } from "@/data/projects";
import { getStudies, getWorkBySlug } from "@/data/work";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return [
    ...projects.map((project) => ({ slug: project.slug })),
    ...getStudies().map((item) => ({ slug: item.slug })),
  ];
}

/* Its own card per case study, rather than inheriting /work's. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const piece = project ? undefined : getWorkBySlug(slug);

  return renderOgImage({
    tag: project?.category ?? piece?.tags[0] ?? "Work",
    headline: project
      ? `${project.title} — ${project.outcome}`
      : piece
        ? `${piece.title} — ${piece.description}`
        : "Case study",
  });
}
