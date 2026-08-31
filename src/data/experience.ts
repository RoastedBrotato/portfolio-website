import { ExperienceItem } from "@/types";

/**
 * Employment history, most recent first. Set `current: true` on your present role.
 */
export const experience: ExperienceItem[] = [
  {
    company: "Al Sufun Trading",
    role: "Senior Software Engineer",
    startDate: "May 2026",
    endDate: "Present",
    location: "Qatar",
    current: true,
    accomplishments: [
      "Joined as a technical partner — own client acquisition, run technical discovery meetings, and scope, build, and ship custom software end to end for each engagement",
      "Built and shipped moementum.fit, a full-stack fitness coaching platform for a personal trainer — workout and calorie logging, daily metrics, trainer feedback, progress photos/video, and stats — now running with 10 active clients",
      "Leading development of a food-delivery marketplace MVP for a client, currently in active build (confidential)",
      "Delivered two smaller client engagements: an inventory management system for Al Faitri, and a full digitalization of a caravan dealership — product catalog, marketing channels, and SEO/AEO",
    ],
  },
  {
    company: "Daixara Technology",
    role: "Full Stack Developer",
    startDate: "Dec 2025",
    endDate: "Apr 2026",
    location: "Lusail, Qatar (Remote)",
    accomplishments: [
      "Built a real-time multilingual meeting translation and intelligence platform — Faster-Whisper transcription, XTTS v2 voice cloning, RAG-powered Q&A, and speaker diarization — deployed as Dockerized Go + Python microservices",
      "Built a static-analysis CLI tool to audit legacy .NET systems for performance anti-patterns, used it to audit and fix 6 internal tools, and upgraded 3 of them to AI-compatible services rebuilt in Python and Go",
      "Rebuilt an ERP workflow-visibility system modeling an 8-step, sometimes-deescalating approval chain — giving requesters live status, clear ownership at every step, and non-disruptive notifications when something needed their input",
    ],
  },
  {
    company: "Qatar Charity",
    role: "Software Developer",
    startDate: "Mar 2020",
    endDate: "Jun 2025",
    location: "Lusail, Qatar",
    accomplishments: [
      "Modernized a legacy .NET MVC monolith serving 50K+ users into modular components and RESTful APIs, cutting average page load time by 35% and enabling independent feature deployments",
      "Architected GitHub Actions CI/CD pipelines for .NET Core services on Azure App Services, moving release cycles from bi-weekly to on-demand with zero-downtime deployments",
      "Optimized database queries across critical modules with Entity Framework and LINQ, improving execution time by 40% and reducing server load during peak donation campaigns",
    ],
  },
  {
    company: "Mirwad Fragrances",
    role: "Software Developer",
    startDate: "Sep 2019",
    endDate: "Dec 2019",
    location: "Lusail, Qatar",
    accomplishments: [
      "Customized and deployed an Odoo ERP system with Python modules for logistics and operations, plus Azure serverless functions for real-time order tracking, cutting manual reporting effort by ~50%",
      "Built a Scrapy-based web scraping pipeline that extracted and normalized 10,000+ competitor product records, improving recommendation-engine matching accuracy by ~20%",
    ],
  },
  {
    company: "Smart Village",
    role: "Junior Software Developer",
    startDate: "Sep 2018",
    endDate: "May 2019",
    location: "Doha, Qatar",
    accomplishments: [
      "Delivered 4 cross-platform desktop and mobile applications in C#/.NET, Java, and Python, automating manual client workflows across 3 engagements with React front ends and secure REST API integrations",
    ],
  },
];
