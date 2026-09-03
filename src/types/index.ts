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

export type ServiceIcon =
  | "sparkles"
  | "layers"
  | "plug"
  | "workflow";

export interface Service {
  icon: ServiceIcon;
  title: string;
  description: string;
  capabilities: string[];
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
  initials: string;
  role: string;
  tagline: string;
  email: string;
  businessEmail: string;
  github: string;
  linkedin: string;
  location: string;
  availability: string;
  resumeUrl: string;
  siteUrl: string;
}
