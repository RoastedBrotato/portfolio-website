"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/ui/icons";
import { Project } from "@/types";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

const visualVariant: Record<string, "ai" | "realtime" | "business"> = {
  "ai-meeting-intelligence": "ai",
  "realtime-platform": "realtime",
  "donor-platform": "business",
};

export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;
  const articleRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start end", "end start"],
  });
  const reduceMotion = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [28, -28]);

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 items-center gap-10 py-14 first:pt-0 lg:grid-cols-2 lg:gap-16 lg:py-20"
    >
      <motion.div style={{ y }} className={cn(reversed && "lg:order-2")}>
        <Link href={`/work/${project.slug}`} className="block">
          <ProjectVisual
            variant={visualVariant[project.slug] ?? "ai"}
            image={project.image}
            title={project.title}
          />
        </Link>
      </motion.div>

      <div className={cn("flex flex-col", reversed && "lg:order-1")}>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-3xl italic text-foreground/15 sm:text-4xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {project.category}
          </span>
        </div>
        <h3 className="font-display mt-4 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-base font-medium text-foreground sm:text-lg">
          {project.outcome}
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground-muted">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            View Case Study
            <ArrowUpRight size={16} />
          </Link>
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Live Demo
              <ExternalLink size={14} />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              GitHub
              <GithubIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
