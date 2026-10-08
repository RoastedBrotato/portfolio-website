export interface ArchitectureFlow {
  label?: string;
  steps: string[];
}

export interface ProjectChallenge {
  title: string;
  description: string;
}

export interface TechDecision {
  decision: string;
  reasoning: string;
}

export interface CaseStudyContent {
  overview: string;
  problem: string;
  solution: string;
  architecture: {
    primary: ArchitectureFlow;
    secondary?: ArchitectureFlow;
  };
  challenges: ProjectChallenge[];
  techDecisions: TechDecision[];
  outcome: string;
}

export interface ProjectLinks {
  demo?: string;
  github?: string;
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  outcome: string;
  description: string;
  features: string[];
  techStack: string[];
  links: ProjectLinks;
  /** Path under /public, e.g. "/images/projects/slug/cover.png". Leave undefined to use the generated abstract visual. */
  image?: string;
  /** Additional screenshots under /public, rendered as a gallery on the case-study page. */
  gallery?: string[];
  featured: boolean;
  caseStudy: CaseStudyContent;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-09-03" */
  date: string;
  tags?: string[];
  /** `draft: true` in frontmatter — shown by `next dev`, excluded from any build. */
  draft?: boolean;
  /** Derived from word count, not frontmatter. */
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  /** Raw MDX body, not yet compiled. */
  content: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  accomplishments: string[];
  current?: boolean;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  /** The one address shown anywhere client-facing. */
  email: string;
  github: string;
  linkedin: string;
  /** Full profile URL. Leave empty to hide the icon everywhere. */
  instagram: string;
  /** Full profile URL. Leave empty to hide the icon everywhere. */
  x: string;
  /** Cal.com / Calendly link. Leave empty to hide every "Book a call" button. */
  bookingUrl: string;
  location: string;
  availability: string;
  resumeUrl: string;
  siteUrl: string;
}

/** How a reviewer knows me. A value from `relationships` in src/data/reviews.ts. */
export type ReviewRelationship = "client" | "collaborator" | "colleague" | "friend" | "other";

/** A visitor-submitted testimonial. `email` is collected for verification and never rendered. */
export interface Review {
  id: string;
  name: string;
  /** Job title, e.g. "Founder". Optional. */
  role?: string;
  /** Company or product name. Optional. */
  company?: string;
  /**
   * How they know me. Required on new submissions; reviews written before the
   * field existed don't have it, so every reader has to cope with it missing.
   */
  relationship?: ReviewRelationship;
  /** What we worked on together, in their words. Optional. */
  project?: string;
  body: string;
  /** Private — used to follow up with the author, never sent to the client. */
  email?: string;
  /** Epoch ms. Doubles as the sort score in Redis. */
  createdAt: number;
  status: "pending" | "approved";
}

/** What the public pages render — the private fields stripped off. */
export type PublicReview = Omit<Review, "email" | "status">;

/**
 * A reader's note on a blog post. Private by construction: there is no public
 * surface for these and no approve step, so unlike `Review` there is no
 * `PublicFeedback` counterpart and nothing here is ever rendered off /admin.
 */
export interface Feedback {
  id: string;
  /** The post this was left on. Validated against the content directory on write. */
  slug: string;
  /** Optional, and absent on notes sent before the field existed. */
  name?: string;
  body: string;
  /** Private — so I can reply. Never rendered outside the moderation page. */
  email?: string;
  /** Epoch ms. Doubles as the sort score in Redis. */
  createdAt: number;
  read: boolean;
}

/**
 * A public comment on a blog post. The opposite of `Feedback`: written to be
 * published, so it's held for approval like a review and has a public shape.
 */
export interface PostComment {
  id: string;
  /** The post this was left on. Validated against the content directory on write. */
  slug: string;
  name: string;
  body: string;
  /** Private — so I can reply. Never sent to the client. */
  email?: string;
  /** Epoch ms. Doubles as the sort score in Redis. */
  createdAt: number;
  status: "pending" | "approved";
}

/** What a blog post renders — the private fields stripped off. */
export type PublicPostComment = Omit<PostComment, "email" | "status">;

/**
 * A card's preview. Video is the short looping clip (muted, autoplayed while on
 * screen); `poster` is what shows before it loads and, under reduced motion,
 * instead of it — so it's required.
 */
export type Media =
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "image"; src: string; alt: string };

/**
 * The write-up behind a creative piece, rendered by CreativeStudyLayout at
 * /work/<slug>. Image-led and light on text, unlike the engineering case
 * studies: a brief, a sequence of stills and clips, how it was built, result.
 */
export interface CreativeStudy {
  /** One paragraph: what it is, who it's for, what it had to do. */
  brief: string;
  /** Shown in order, each with a short caption that sticks beside it on desktop. */
  sequence: { media: Media; caption: string }[];
  build: {
    stack: string[];
    /** Measured, not aspirational: [label, value] pairs. */
    budget: [string, string][];
    notes: { title: string; body: string }[];
  };
  result: string;
}

/** A "Selected work" entry — the creative pieces that lead the homepage. */
export interface WorkItem {
  slug: string;
  title: string;
  /** One line. The card has room for nothing longer. */
  description: string;
  tags: string[];
  /** Omit while the clip isn't cut yet — the card shows a "preview coming" frame. */
  media?: Media;
  /** The live piece (external). */
  href?: string;
  /** An internal case-study path, e.g. "/work/<slug>". Optional. */
  caseStudy?: string;
  year?: string;
  /** The write-up. When present, /work/<slug> renders it. */
  study?: CreativeStudy;
  /** Placeholder slot: shown by `next dev` only, never in a build. */
  placeholder?: boolean;
}

/** A /lab entry: an experiment, a creative challenge, an AI-tool test. */
export interface LabEntry {
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-10-04". Entries sort newest first. */
  date: string;
  /** A sentence or two — what was tried and what came of it. */
  note: string;
  tags?: string[];
  media?: Media;
  /** Repo, demo, or the post where it was shared. */
  href?: string;
  /** Placeholder slot: shown by `next dev` only, never in a build. */
  placeholder?: boolean;
}

/** Where a lead came from — captured client-side on arrival, stored with the request. */
export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Path + query of the first page they landed on. */
  landingPage?: string;
  /** document.referrer on arrival. Often empty from in-app browsers — hence the UTMs. */
  referrer?: string;
}

/**
 * A /quote submission. Private by construction, like `Feedback`: nothing here
 * is ever rendered outside /admin/reviews.
 */
export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  /** A package id from src/data/pricing.ts, "custom" or "other". */
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  links?: string;
  /** "How did you hear about me" — self-reported, alongside the UTMs. */
  source?: string;
  attribution: Attribution;
  /** Which form it came through: "quote-page" (older leads: "pricing", "home"). */
  placement?: string;
  /** Epoch ms. Doubles as the sort score in Redis. */
  createdAt: number;
  read: boolean;
}

/** A fact on the proof strip, shown on the homepage until real reviews exist. */
export interface ProofItem {
  /** The big line, e.g. "10 active clients". */
  stat: string;
  /** What it refers to — one short sentence. */
  detail: string;
  /** Where to check it: a live site, a repo. */
  href?: string;
  linkLabel?: string;
  /** Placeholder slot: shown by `next dev` only, never in a build. */
  placeholder?: boolean;
}
