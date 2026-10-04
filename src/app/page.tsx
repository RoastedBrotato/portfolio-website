import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { EngineeringRange } from "@/components/sections/EngineeringRange";
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

  /*
   * Five sections, one scroll story: show the work, make it buyable, lower the
   * risk, ask. Anything that isn't showing work or asking for the quote (bio,
   * CV, stack, writing) lives on /about.
   *
   * The backgrounds step through the near-black planes one at a time, so the
   * page changes pace as it scrolls. Until Selected work has a real entry, the
   * engineering strip holds the Work slot so "See the work" still lands on work.
   */
  return (
    <>
      <Hero />
      {work.length > 0 ? (
        <SelectedWork items={work} index={1} />
      ) : (
        <EngineeringRange id="work" label="Work" index={1} />
      )}
      <Services index={2} tone="plane-1" />
      <Testimonials index={3} tone="plane-2" />
      <ContactCTA index={4} tone="plane-1" />
    </>
  );
}
