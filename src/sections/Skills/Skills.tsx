import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { skills } from "../../data/narrative";

export function Skills() {
  return (
    <section className="content-section skills-section" id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="A blended stack of interface craft, technical execution, and product sense."
        description="These are placeholders for now, grouped visually as a capability field rather than a badge wall."
      />
      <div className="skill-cloud">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  );
}
