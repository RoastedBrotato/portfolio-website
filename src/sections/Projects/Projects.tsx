import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { projectList } from "../../data/narrative";
import { easeOut } from "../../animations/presets";

export function Projects() {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll-active indicator: as each project enters the viewport center,
  // an accent bar draws in from the left
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll(".project-item");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const bar = entry.target.querySelector(".project-bar");
          if (!bar) continue;

          if (entry.isIntersecting) {
            animate(bar, {
              scaleX: [0, 1],
              opacity: [0.4, 1],
              duration: 500,
              easing: easeOut
            });
          } else {
            animate(bar, {
              scaleX: [1, 0],
              opacity: [1, 0],
              duration: 300,
              easing: easeOut
            });
          }
        }
      },
      {
        threshold: 0.55,
        rootMargin: "-15% 0px -15% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="content-section projects-section" id="projects">
      <SectionHeading
        eyebrow="Selected Projects"
        title="A first pass at the work: product utility, real-time systems, and web experiences."
        description="This is placeholder content for now, but the section layout is set up to support stronger case-study storytelling once your final links and outcomes are in."
      />

      <div className="project-list" ref={listRef}>
        {projectList.map((project) => (
          <article className="project-item" key={project.name}>
            <div
              className="project-bar"
              style={{ transformOrigin: "left center" }}
            />
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
