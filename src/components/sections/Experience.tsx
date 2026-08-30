import { Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ExperienceTimeline } from "@/components/ui/ExperienceTimeline";
import { experience } from "@/data/experience";
import { siteConfig } from "@/data/config";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 border-t border-border py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Experience" title="Where I've worked" />
          <Button href={siteConfig.resumeUrl} variant="secondary" external className="shrink-0">
            Download Resume
            <Download size={16} />
          </Button>
        </div>
        <div className="mt-16">
          <ExperienceTimeline items={experience} />
        </div>
      </Container>
    </section>
  );
}
