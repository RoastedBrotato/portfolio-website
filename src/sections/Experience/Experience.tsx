import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { experienceList } from "../../data/narrative";

export function Experience() {
  return (
    <section className="content-section experience-section" id="experience">
      <SectionHeading
        eyebrow="Experience"
        title="The experience section is scaffolded now and can be tightened once you send the resume details."
        description="I’ve kept the visual treatment strong enough to evaluate the page rhythm without pretending placeholder content is final."
      />

      <div className="experience-list">
        {experienceList.map((item) => (
          <article className="experience-item" key={`${item.company}-${item.title}`}>
            <p className="meta">{item.period}</p>
            <h3>{item.title}</h3>
            <p className="company">{item.company}</p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
