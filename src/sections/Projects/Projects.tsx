import { projectList } from "../../data/narrative";

export function Projects() {
  return (
    <section id="projects" className="scene-projects">
      <div className="projects-header content-section">
        <p className="meta" data-reveal>Selected Projects</p>
        <h2 data-reveal>Work that takes over the room.</h2>
      </div>

      <div className="project-cards">
        {projectList.map((project, index) => (
          <div className="project-card-wrap" key={project.name}>
            <article
              className="project-card"
              style={{ "--card-index": index } as React.CSSProperties}
            >
              <div className="project-card-inner content-section">
                <div className="project-card-top">
                  <span className="project-card-num">0{index + 1}</span>
                  <p className="meta">{project.type}</p>
                </div>
                <h3 className="project-card-title">{project.name}</h3>
                <div className="project-card-bottom">
                  <p className="project-card-desc">{project.summary}</p>
                  <p className="project-card-stack">{project.stack.join(" · ")}</p>
                  <a href={project.link} className="project-card-link">View project</a>
                </div>
              </div>
              <div className="project-card-bg" aria-hidden="true" />
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
