import { WorkflowBuilder } from "../../components/WorkflowBuilder/WorkflowBuilder";

export function About() {
  return (
    <section className="content-section scene scene-about" id="about">
      <div className="about-frame">
        <p className="meta" data-reveal>About</p>
        <div className="about-grid">
          <h2 data-reveal>Interfaces built at the edge of craft and engineering.</h2>
          <div className="about-notes">
            {/* ── Bio — update this with your details ── */}
            <p data-reveal>
              I'm a creative developer based in Qatar. I work across the full spectrum of product work — from early design decisions to the final lines of code.
            </p>
            <p data-reveal>
              My focus is on building things that feel fast, considered, and alive. Not just functional — worth experiencing.
            </p>
          </div>
        </div>

        <div className="about-workflow">
          <WorkflowBuilder />
        </div>
      </div>
    </section>
  );
}
