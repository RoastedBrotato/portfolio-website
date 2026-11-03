import type { PublicReview } from "@/types";

/**
 * Reviews clients sent directly, before the public form existed. They render
 * exactly like approved form submissions (see getPublishedReviews in
 * src/lib/reviews.ts) but live here, so they ship with the code and need no
 * database. Typos fixed, nothing else touched.
 *
 * `name` is the company until each reviewer's name and title are added: set
 * `name` to the person and `company` to the business and the card updates.
 */
export const testimonials: PublicReview[] = [
  {
    id: "client-al-mahhar-holding",
    name: "Al Mahhar Holding",
    relationship: "client",
    project: "Corporate site and investor relations",
    body:
      "Working with Waleed has been an absolute pleasure. He helped upscale the company's website to modern elements, created funnels for publishing investor relations documents, and helped us with integrations that were necessary to be shown in the website. Waleed is professional, punctual, and gets the job done. He has always come up with the most ideal and cost effective solution for our problems, and implemented them properly. Any company looking to rebrand or upscale their digital presence should definitely work with him.",
    createdAt: Date.UTC(2026, 9, 1),
  },
  {
    id: "client-benda-offroad",
    name: "Benda Offroad",
    relationship: "client",
    project: "Dealer site, bendaoffroad.qa",
    body:
      "Waleed is an exceptional developer who helped bring our vision to life. We wanted to showcase our off-road experience, and Waleed managed to display our vision on our website. Would definitely recommend him for creative work!",
    createdAt: Date.UTC(2026, 8, 20),
  },
  {
    id: "client-createxworks",
    name: "CreateXworks",
    relationship: "client",
    project: "Studio site, createxworks.com",
    body:
      "We found Waleed's services at a very early stage of our company. He developed a portfolio for us that helped us showcase what we do to our clients. The custom 3D elements were mind blowing and relevant to what we do.",
    createdAt: Date.UTC(2026, 6, 15),
  },
];
