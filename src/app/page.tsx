import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Writing } from "@/components/sections/Writing";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactCTA } from "@/components/sections/ContactCTA";

/*
 * The homepage is otherwise static; it only re-renders because approving a
 * review calls revalidatePath("/"). The hourly window is the safety net for a
 * revalidation that never lands, so an approved review can't sit invisible
 * until the next deploy.
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Experience />
      <About />
      <Writing />
      <Services />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
