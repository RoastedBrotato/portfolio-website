export const profile = {
  name: "Waleed",
  title: "Full Stack Engineer",
  tagline: "Building scalable platforms and AI-powered systems.",
  location: "Doha, Qatar"
};

export const projectList = [
  {
    name: "Multilingual Meeting Translator",
    type: "AI / Real-Time Systems",
    summary:
      "Live meeting platform with real-time transcription and translation across 10+ languages. Integrates Faster-Whisper for ASR and XTTS v2 for voice cloning, with speaker diarization, RAG-powered Q&A, and auto meeting minutes.",
    stack: ["Go", "Python", "Hugging Face", "Docker", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    accent: "rgba(111, 119, 201, 0.34)",
    link: "#"
  },
  {
    name: "Legacy .NET Auditor",
    type: "Developer Tooling",
    summary:
      "Python static analysis CLI for auditing ASP.NET MVC and WebForms applications. Detects anti-patterns, N+1 queries, and missing async — generates phased modernization roadmaps with Mermaid architecture diagrams.",
    stack: ["Python", "AST Analysis", "CLI", "Mermaid"],
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    accent: "rgba(184, 131, 77, 0.28)",
    link: "https://github.com/RoastedBrotato/legacy-dotnet-auditor"
  },
  {
    name: "Rust Language Interpreter",
    type: "Systems / Creative Coding",
    summary:
      "A custom programming language interpreter built in Rust from scratch — full lexer, recursive-descent parser, and AST evaluator with TDD coverage across variable scoping, control flow, and function calls.",
    stack: ["Rust", "Lexer", "Parser", "AST"],
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    accent: "rgba(147, 164, 184, 0.3)",
    link: "https://github.com/RoastedBrotato/Projects"
  }
];

export const experienceList = [
  {
    period: "Dec 2025 – Present",
    title: "Full Stack Developer",
    company: "Daixara Technology",
    description:
      "Auditing legacy .NET systems and delivering modernization roadmaps. Built a real-time multilingual meeting platform with Hugging Face ASR/TTS models, async job queues, and a Dockerized Go + Python microservices stack."
  },
  {
    period: "Mar 2020 – Jun 2025",
    title: "Software Developer",
    company: "Qatar Charity",
    description:
      "Modernized a .NET MVC monolith serving 50K+ users into modular APIs, cutting load time by 35%. Built React component libraries, optimized EF/LINQ queries, and architected zero-downtime CI/CD pipelines on Azure."
  },
  {
    period: "Sep 2019 – Dec 2019",
    title: "Software Developer",
    company: "Mirwad Fragrances",
    description:
      "Deployed a customized Odoo ERP with Python logistics modules, Azure serverless functions for real-time order tracking, and a Scrapy pipeline extracting 10K+ product records for the recommendation engine."
  },
  {
    period: "Sep 2018 – May 2019",
    title: "Junior Software Developer",
    company: "Smart Village",
    description:
      "Delivered 4 cross-platform applications in C#.NET, Java, and Python. Built React front-ends with secure REST API integrations, automating manual workflows across 3 client engagements."
  }
];

export const skillGroups = [
  {
    label: "Languages",
    skills: ["TypeScript", "Python", "C#", "Go", "Rust", "JavaScript"],
  },
  {
    label: "Application Stack",
    skills: ["React", "Next.js", "Node.js", ".NET Core", "Express", "GraphQL"],
  },
  {
    label: "Cloud & Data",
    skills: ["Azure", "Docker", "PostgreSQL", "SQL Server", "MongoDB", "GitHub Actions"],
  },
  {
    label: "AI & Systems",
    skills: ["Hugging Face", "RAG", "WebSockets", "Microservices", "REST", "Power BI"],
  },
];

export const puzzlePoints = [
  "Business context",
  "User behavior",
  "Technical constraints",
  "Interface clarity",
  "Speed to ship",
  "Visual direction"
];
