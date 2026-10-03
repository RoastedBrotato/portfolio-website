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

export interface Service {
  title: string;
  description: string;
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

/** A visitor-submitted testimonial. `email` is collected for verification and never rendered. */
export interface Review {
  id: string;
  name: string;
  /** Job title, e.g. "Founder". Optional. */
  role?: string;
  /** Company or product name. Optional. */
  company?: string;
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
  body: string;
  /** Private — so I can reply. Never rendered outside the moderation page. */
  email?: string;
  /** Epoch ms. Doubles as the sort score in Redis. */
  createdAt: number;
  read: boolean;
}

/**
 * A card's preview. Video is the short looping clip (muted, autoplayed while on
 * screen); `poster` is what shows before it loads and, under reduced motion,
 * instead of it — so it's required.
 */
export type Media =
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "image"; src: string; alt: string };

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
