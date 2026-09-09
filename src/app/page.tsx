import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Experience } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Writing } from "@/components/sections/Writing";
import { Services } from "@/components/sections/Services";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Experience />
      <About />
      <Writing />
      <Services />
      <ContactCTA />
    </>
  );
}
