import { Download } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { ExperienceTimeline } from "@/components/ui/ExperienceTimeline";
import { experience } from "@/data/experience";
import { siteConfig } from "@/data/config";

export function Experience() {
  return (
    <Section
      id="experience"
      label="Experience"
      aside={
        <a
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          Resume
          <Download size={14} />
        </a>
      }
    >
      <ExperienceTimeline items={experience} />
    </Section>
  );
}
