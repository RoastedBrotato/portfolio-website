import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { WorkList } from "@/components/sections/WorkList";
import { EngineeringRange } from "@/components/sections/EngineeringRange";
import { Disciplines } from "@/components/sections/Disciplines";
import { Services } from "@/components/sections/Services";
import { Proof } from "@/components/sections/Proof";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ScrollDepth } from "@/components/ScrollDepth";
import { getFeaturedWork } from "@/data/work";
import { siteConfig } from "@/data/config";

/*
 * The root layout's title and description are the homepage's; this adds the
 * canonical. It is set here rather than on the layout because `alternates` is
 * inherited wholesale by any page that doesn't set its own, and "/" is the
 * wrong canonical for every other page.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: siteConfig.siteUrl },
};

/*
 * The homepage is otherwise static; it only re-renders because approving a
 * review calls revalidatePath("/"). The hourly window is the safety net for a
 * revalidation that never lands, so an approved review can't sit invisible
 * until the next deploy.
 */
export const revalidate = 3600;

export default function Home() {
  const featured = getFeaturedWork();

  /*
   * Hero (the wordmark and the intro), the work as names, what it is made of,
   * what it costs, what clients say (once any have), the ask.
   */
  return (
    <>
      <Hero />
      {featured.length > 0 ? (
        <WorkList items={featured} />
      ) : (
        <EngineeringRange id="work" label="Work" />
      )}
      <Disciplines />
      <Services tone="plane-1" />
      <Proof />
      <ContactCTA />
      <ScrollDepth sections={["work", "what-i-do", "services", "contact"]} />
    </>
  );
}
