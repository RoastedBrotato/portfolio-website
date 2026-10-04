import { Section, type SectionTone } from "@/components/ui/Section";
import { ExperienceTimeline } from "@/components/ui/ExperienceTimeline";
import { experience } from "@/data/experience";

/** The timeline, on /about. Each role's detail is collapsed; the current one starts open. */
export function Experience({ tone }: { tone?: SectionTone }) {
  return (
    <Section id="experience" label="Experience" tone={tone}>
      <ExperienceTimeline items={experience} />
    </Section>
  );
}
