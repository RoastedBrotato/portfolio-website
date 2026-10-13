import { SiteConfig } from "@/types";

/** Central place for personal/site information. */
export const siteConfig: SiteConfig = {
  name: "Waleed Ajaz",
  // Shows in the hero rail, the footer and the OG images.
  role: "Creative Developer",
  // The hero's one sentence under the thesis (docs/voice.md).
  tagline:
    "Websites with motion and 3D on top and proper engineering underneath, from one developer.",
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
