import { useEffect, useRef, useState } from "react";
import { projectList } from "../../data/narrative";

const NAV_H = 64;

function getFileState(i: number, active: number, total: number) {
  const offset = i - active;
  if (offset < 0) return "gone";
  if (offset === 0) return "active";
  if (offset === 1) return "behind-1";
  if (offset === 2) return "behind-2";
  if (offset >= 3 && i < total) return "behind-3";
  return "hidden";
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(1, scrollable)));
      const idx = Math.min(projectList.length - 1, Math.floor(progress * projectList.length));
      setActiveIdx(idx);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="scene-projects">
      {/* Header — normal flow, above the sticky area */}
      <div className="projects-header content-section">
        <p className="meta" data-reveal>Selected Projects</p>
        <h2 data-reveal>Work that deserves its own folder.</h2>
      </div>

      {/* Scroll track — gives the sticky stage its scroll space */}
      <div
        ref={trackRef}
        className="projects-track"
        style={{ height: `calc(${projectList.length} * 100svh)` }}
      >
        <div className="projects-sticky-stage" style={{ top: NAV_H }}>
          <div className="projects-file-stack content-section">
            {projectList.map((project, i) => {
              const state = getFileState(i, activeIdx, projectList.length);

              return (
                <article
                  key={project.name}
                  className={`project-file project-file--${state}`}
                  aria-hidden={state === "gone" || state === "hidden"}
                >
                  {/* Folder tab — visible even when card is behind */}
                  <div className="project-file-tab">
                    <span className="project-file-num">0{i + 1}</span>
                    <span className="meta">{project.type}</span>
                  </div>

                  {/* File body */}
                  <div className="project-file-body">
                    <div className="project-file-top">
                      <h3>{project.name}</h3>
                    </div>

                    <p className="project-file-summary">{project.summary}</p>

                    <div className="project-file-footer">
                      <p className="project-file-stack">{project.stack.join(" · ")}</p>
                      <a href={project.link} className="project-file-link">
                        View project
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="projects-progress content-section" aria-hidden="true">
            {projectList.map((_, i) => (
              <div
                key={i}
                className={`projects-progress-pip${i === activeIdx ? " is-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
