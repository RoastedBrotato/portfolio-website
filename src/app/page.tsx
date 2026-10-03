import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { EngineeringRange } from "@/components/sections/EngineeringRange";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Writing } from "@/components/sections/Writing";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getWork } from "@/data/work";

/*
 * The homepage is otherwise static; it only re-renders because approving a
 * review calls revalidatePath("/"). The hourly window is the safety net for a
 * revalidation that never lands, so an approved review can't sit invisible
 * until the next deploy.
 */
export const revalidate = 3600;

export default function Home() {
  const work = getWork();

  // Order is the pitch: creative work first, the engineering that backs it
  // second, then what you can hire me for and proof that people have.
  return (
    <>
      <Hero />
      {work.length > 0 ? <SelectedWork items={work} /> : null}
      <EngineeringRange lead={work.length === 0} />
      <Services />
      <Testimonials />
      <About />
      <Experience />
      <Writing />
      <ContactCTA />
    </>
  );
}
