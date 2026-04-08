import { SectionHeading } from "../../components/SectionHeading/SectionHeading";

export function Showcase() {
  return (
    <section className="content-section showcase-section" id="showcase">
      <SectionHeading
        eyebrow="Showcase"
        title="Motion, interaction studies, and visual experiments can sit here once we decide how far to push the site."
        description="For now this acts as a visual breathing point between the process story and the more practical credentials below."
      />
      <div className="showcase-band">
        <span>Motion-led UI</span>
        <span>Creative coding</span>
        <span>Editorial systems</span>
        <span>Interactive prototypes</span>
      </div>
    </section>
  );
}
