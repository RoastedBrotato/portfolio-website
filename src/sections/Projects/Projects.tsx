import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { projectList } from "../../data/narrative";

export function Projects() {
  return (
    <section className="content-section projects-section" id="projects">
      <SectionHeading
        eyebrow="Selected Projects"
        title="A first pass at the work: product utility, real-time systems, and web experiences."
        description="This is placeholder content for now, but the section layout is set up to support stronger case-study storytelling once your final links and outcomes are in."
      />

      <div className="project-list">
        {projectList.map((project) => (
          <article className="project-item" key={project.name}>
            <div>
              <p className="meta">{project.type}</p>
              <h3>{project.name}</h3>
            </div>
            <p>{project.summary}</p>
            <p className="stack">{project.stack.join(" / ")}</p>
            <a href={project.link}>Project link</a>
          </article>
        ))}
      </div>
    </section>
  );
}
