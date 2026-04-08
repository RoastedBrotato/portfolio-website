import { SectionHeading } from "../../components/SectionHeading/SectionHeading";

export function About() {
  return (
    <section className="content-section about-section" id="about">
      <SectionHeading
        eyebrow="About"
        title="I design and build digital experiences that feel considered, fast, and structurally clear."
        description="The through-line is simple: take something messy, find the signal, and turn it into a product or interface that people can actually use."
      />
    </section>
  );
}
