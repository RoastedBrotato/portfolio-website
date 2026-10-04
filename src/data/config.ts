import { SiteConfig } from "@/types";

/** Central place for personal/site information. */
export const siteConfig: SiteConfig = {
  name: "Waleed Ajaz",
  // DRAFT — edit freely. Shows in the hero rail, the footer and the OG images.
  role: "Creative Developer",
  tagline: "Immersive websites, interactive 3D and the full-stack engineering underneath them.",
  email: "waleed@alsufun.com",
  github: "https://github.com/RoastedBrotato",
  linkedin: "https://www.linkedin.com/in/waleedajaz/",
  instagram: "https://www.instagram.com/waleedbrotato.dev/",
  x: "https://x.com/brotatodev",
  // Set NEXT_PUBLIC_BOOKING_URL (Cal.com or Calendly) in the environment, or
  // paste the link here. NEXT_PUBLIC_ so it's inlined into the client navbar too.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  location: "Islamabad, Pakistan",
  availability: "Booking client projects",
  resumeUrl: "/resume.pdf",
  // Feeds metadataBase, every URL in sitemap.xml, the sitemap reference in
  // robots.txt, the OpenGraph tags and the RSS feed. No trailing slash.
  siteUrl: "https://waleedajaz.com",
};
