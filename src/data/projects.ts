import { Project } from "@/types";

/**
 * Featured project / case-study data.
 *
 * To add a new project:
 * 1. Add an entry to this array.
 * 2. Drop a cover image at /public/images/projects/<slug>/cover.png (see README for dimensions)
 *    and set the `image` field — otherwise a generated abstract visual is used automatically.
 * 3. The route /work/<slug> is generated automatically.
 */
export const projects: Project[] = [
  {
    slug: "moementum-fit",
    category: "Full-Stack / SaaS",
    title: "Moementum",
    outcome:
      "A fitness coaching platform trainers and clients actually use daily — live in production with 10 active clients.",
    description:
      "A full-stack coaching platform built for an independent personal trainer — clients log workouts, morning and night metrics, and progress photos and video, while the trainer reviews and leaves feedback directly against each logged session.",
    features: [
      "Daily workout logging (sets, reps, weight)",
      "Morning & night metric check-ins (weight, sleep, recovery)",
      "Weekly measurements & progress photo/video uploads",
      "Trainer feedback threaded on individual sessions",
      "Weight, sleep, and lift-progression trend charts",
      "Streaks & daily/weekly checklists",
      "Per-client data isolation (Postgres RLS)",
      "Authentication & per-client dashboards",
    ],
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase", "PostgreSQL", "Recharts", "Mux"],
    links: {
      demo: "https://moementum.fit",
      github: undefined, // TODO: add the GitHub repo URL
    },
    image: "/images/projects/moementum-fit/cover.png",
    gallery: [
      "/images/projects/moementum-fit/training-log.png",
      "/images/projects/moementum-fit/metrics.png",
    ],
    featured: true,
    caseStudy: {
      overview:
        "Moementum is a coaching platform built for an independent personal trainer running an online program — it replaces the spreadsheet-and-DM workflow most trainers default to with a single place where clients log their training and daily metrics, and the trainer reviews and responds directly against that data.",
      problem:
        "Coaching clients remotely usually means a mess of spreadsheets, screenshots, and DMs — clients forget to log, trainers can't see trends at a glance, and feedback ends up disconnected from the session it's actually about. There was no lightweight, habit-forming way for a client to check in daily and for a trainer to review that data in context, without building a heavyweight fitness-tracking app clients wouldn't stick with.",
      solution:
        "Clients log a session, morning metrics (weight, sleep), and a nightly check-in through short, focused forms designed to take under a minute, with a running streak to keep the habit alive. Weekly cadence items — body measurements, progress photos, and video uploads — sit alongside the daily checklist so nothing falls through. Every logged session becomes something the trainer can review and leave feedback directly against, so a note about a lift ties back to the exact set and weight it refers to instead of living in a separate chat thread. Weight, sleep, and lift-progression charts turn the accumulated logs into something both sides can actually read at a glance.",
      architecture: {
        primary: {
          label: "Application flow",
          steps: [
            "Client / Trainer Browser",
            "Next.js App Router (Server Components + Route Handlers)",
            "Supabase (Postgres + Auth + RLS)",
            "Recharts Dashboards",
          ],
        },
        secondary: {
          label: "Workout video flow",
          steps: ["Video Upload", "Mux (encoding & adaptive streaming)", "Playback in Training Log"],
        },
      },
      challenges: [
        {
          title: "Making daily logging a habit, not a chore",
          description:
            "The platform is only useful if clients actually log in every day. Forms had to be short enough to fill in under a minute, with streaks and a daily/weekly checklist giving immediate feedback on consistency rather than a wall of fields to fill in whenever someone remembered.",
        },
        {
          title: "Keeping trainer feedback attached to context",
          description:
            "Feedback that lives in a separate chat thread loses the specific set, weight, or session it's actually about. Coach notes needed to attach directly to the logged session they refer to, so a client sees the feedback right next to the numbers it's commenting on.",
        },
        {
          title: "Per-client data isolation without a custom auth layer",
          description:
            "Every client's metrics, photos, and videos needed to be visible only to that client and their trainer — never to other clients on the platform. Supabase Row Level Security policies enforce that isolation at the database layer rather than trusting application code to filter every query correctly.",
        },
        {
          title: "Reliable video without building video infrastructure",
          description:
            "Form-check videos need to upload reliably from a phone on a mediocre connection and play back smoothly regardless of device. Rather than build encoding and adaptive streaming from scratch, video handling was delegated to Mux, taking transcoding, thumbnails, and playback off the table as a problem to solve.",
        },
        {
          title: "Turning raw logs into readable trends",
          description:
            "A table of daily weight and sleep entries is hard to read at a glance. Data needed to roll up into daily, weekly, and monthly views so both the client and trainer could see a trend instead of scrolling a log.",
        },
      ],
      techDecisions: [
        {
          decision: "Next.js 16 App Router with Server Components",
          reasoning:
            "Data-heavy dashboard pages (charts, logs, checklists) render server-side by default, keeping the client bundle small and avoiding a separate API layer for most reads — Route Handlers cover the rest.",
        },
        {
          decision: "Supabase for Auth, Postgres, and Storage",
          reasoning:
            "A single provider for auth, the relational data model, and file storage (photos, progress uploads) meant shipping a full backend without standing up and wiring together separate services — and Postgres Row Level Security enforces per-client data isolation directly in the database.",
        },
        {
          decision: "Mux for workout video",
          reasoning:
            "Encoding, adaptive bitrate streaming, and thumbnails for user-uploaded video is a deep, solved problem elsewhere — building that in-house wasn't worth it for a coaching app, so video handling was delegated entirely to Mux.",
        },
        {
          decision: "Recharts for trend visualization",
          reasoning:
            "A composable, React-native charting library was a better fit than a heavier dashboarding tool for a handful of focused trend charts (weight, sleep, lift progression) embedded directly in the dashboard.",
        },
        {
          decision: "shadcn/ui + Tailwind CSS v4",
          reasoning:
            "Component primitives owned directly in the codebase rather than pulled from a closed component library, so the UI could be shaped around the coaching workflow instead of a generic dashboard template.",
        },
      ],
      outcome:
        "Moementum is live in production at moementum.fit with 10 active clients logging daily — replacing the spreadsheet-and-DM workflow with a single habit-forming logging surface and a feedback loop the trainer actually uses to coach.",
    },
  },
  {
    slug: "ai-meeting-intelligence",
    category: "AI / RAG / Full Stack",
    title: "AI Meeting Intelligence",
    outcome:
      "Turns recorded meetings into a searchable, multilingual knowledge base you can ask questions against.",
    description:
      "A platform for live multilingual meeting translation and post-meeting knowledge retrieval — real-time transcription and voice-cloned dubbing for concurrent participants, plus a RAG-powered Q&A layer over past meetings.",
    features: [
      "Live multilingual transcription (10+ languages)",
      "Real-time voice-cloned translation/dubbing",
      "Audio/video file processing",
      "Speaker diarization",
      "Auto-generated meeting minutes",
      "Semantic retrieval over past meetings",
      "Conversational Q&A (RAG)",
      "Authentication",
      "Containerized microservices",
    ],
    techStack: ["Go", "Python", "Faster-Whisper", "XTTS v2", "RAG", "LLMs", "Keycloak", "Docker", "PostgreSQL", "Vector Database"],
    links: {
      demo: undefined, // TODO: add a live demo URL if available
      github: undefined, // TODO: add a GitHub repo URL if the project is public
    },
    image: undefined, // TODO: /images/projects/ai-meeting-intelligence/cover.png
    featured: true,
    caseStudy: {
      overview:
        "Cross-language meetings have two separate problems: participants who don't share a language can't follow along live, and once the meeting ends, everything discussed is effectively unsearchable. This platform addresses both — real-time multilingual transcription and voice-cloned dubbing during the meeting, and a RAG-powered knowledge base over past meetings afterward.",
      problem:
        "Teams with international, multilingual participants lose people mid-meeting when the conversation shifts languages, and there's no good live solution short of a human interpreter. Separately, meeting recordings pile up in storage and are effectively write-only — searching them means scrubbing through video by hand, and knowledge shared verbally in one meeting is invisible to everyone who wasn't in the room.",
      solution:
        "For live meetings, audio is transcribed in real time with Faster-Whisper and translated on the fly, with XTTS v2 voice cloning used to dub the translated speech back in something close to the original speaker's voice — across 10+ languages for concurrent participants. Separately, uploaded recordings go through a batch pipeline: transcription, speaker diarization, translation, and auto-generated meeting minutes. Transcripts are chunked and embedded into a vector store, so instead of browsing a list of recordings, a user can ask a question — \"what did we decide about the pricing model in last month's calls?\" — and get an answer synthesized from the relevant meetings, with retrieval-augmented generation grounding the response in the actual transcript content rather than a model's guess.",
      architecture: {
        primary: {
          label: "Ingestion & retrieval pipeline",
          steps: [
            "Audio / Video Upload",
            "Speech Transcription (Faster-Whisper)",
            "Speaker Diarization",
            "Translation",
            "Processing / Chunking",
            "Embeddings",
            "Vector Database",
            "Retrieval",
            "LLM",
            "Answer",
          ],
        },
      },
      challenges: [
        {
          title: "Real-time latency budget for live translation",
          description:
            "Live dubbing only feels usable if the delay between someone speaking and hearing the translated, voice-cloned audio stays small. That put a hard latency budget on transcription, translation, and voice synthesis for concurrent participants — a very different constraint from the offline batch pipeline, which could trade latency for accuracy.",
        },
        {
          title: "Chunking transcripts without losing context",
          description:
            "Naive fixed-length chunking split conversations mid-thought and hurt retrieval quality. Chunk boundaries needed to respect speaker turns (from diarization) and topic shifts so retrieved passages stayed coherent when handed to the LLM.",
        },
        {
          title: "Multilingual transcription and translation accuracy",
          description:
            "Meeting audio quality varies widely — cross-talk, accents, and background noise all degrade transcription. The pipeline needed a translation step that ran reliably on Faster-Whisper's output without compounding transcription errors.",
        },
        {
          title: "Grounding answers in retrieved content",
          description:
            "A general-purpose LLM will happily answer from prior knowledge instead of the retrieved transcript chunks. Prompting and retrieval needed to be tight enough that answers stayed traceable back to specific meetings rather than sounding plausible but being unsupported.",
        },
        {
          title: "Isolating storage and identity per service",
          description:
            "Recordings, transcripts, and embeddings all needed durable, access-controlled storage independent of the application layer, and authentication needed to be handled centrally rather than re-implemented per service.",
        },
      ],
      techDecisions: [
        {
          decision: "Faster-Whisper for transcription, XTTS v2 for voice cloning",
          reasoning:
            "Both run self-hosted with strong multilingual accuracy, which mattered for keeping meeting audio under the platform's own control rather than sending it to a third-party API — and for keeping inference latency low enough for live dubbing.",
        },
        {
          decision: "Go + Python microservices split",
          reasoning:
            "Go for the latency-sensitive real-time path (streaming audio, live translation orchestration), Python for the ML-heavy work (transcription, diarization, RAG) — each language doing what it's actually good at instead of forcing one runtime to do both well.",
        },
        {
          decision: "A dedicated vector database for retrieval",
          reasoning:
            "Semantic search over meeting content needed to scale independently of the primary data store and support similarity search patterns that a relational database isn't built for.",
        },
        {
          decision: "Keycloak for authentication",
          reasoning:
            "Centralized identity and access control across services rather than building and maintaining custom auth, with room to add SSO later.",
        },
        {
          decision: "Docker for every service",
          reasoning:
            "Transcription, translation, retrieval, and the API each have different runtime dependencies. Containerizing each one kept the pipeline reproducible and easy to deploy as independent, scalable services.",
        },
      ],
      outcome:
        "The result is a platform that handles both sides of the multilingual meeting problem: live transcription and voice-cloned dubbing for participants in the room, and a queryable, cited knowledge base afterward — covering transcription, diarization, translation, retrieval, and conversational Q&A end to end.",
    },
  },
  {
    slug: "realtime-platform",
    category: "Backend / Distributed Systems",
    title: "Real-Time Task & Notification Platform",
    outcome:
      "An event-driven backend that processes work asynchronously and pushes results to clients in real time.",
    description:
      "An event-driven application demonstrating asynchronous processing and real-time updates — work is queued, processed by background workers, and results are pushed back to connected clients instantly rather than through polling.",
    features: [
      "Asynchronous task processing",
      "Message queue-driven workers",
      "Real-time client updates",
      "Reliable delivery under load",
      "REST API for task management",
      "Containerized services",
    ],
    techStack: [".NET", "RabbitMQ", "SignalR", "PostgreSQL", "Docker", "REST APIs"],
    links: {
      demo: undefined, // TODO
      github: undefined, // TODO
    },
    image: undefined, // TODO: /images/projects/realtime-platform/cover.png
    featured: true,
    caseStudy: {
      overview:
        "A backend architecture built to show how a system stays responsive under asynchronous load: requests are accepted immediately, real work happens off the request thread, and clients are notified the moment it's done instead of polling for status.",
      problem:
        "Handling long-running or bursty work synchronously inside an HTTP request doesn't scale — requests time out, the API becomes a bottleneck, and clients are left polling an endpoint to find out if anything happened. That pattern falls apart under real load and gives users a laggy, unreliable experience.",
      solution:
        "Incoming requests hit a thin API layer that publishes a message to a queue and returns immediately. Background workers consume the queue, do the actual processing, and write results to the database. Once a task completes, the platform pushes an update directly to the relevant connected client over a persistent real-time connection, so the UI updates the instant work finishes rather than on the next poll.",
      architecture: {
        primary: {
          label: "Request & processing path",
          steps: ["Frontend", "API", "RabbitMQ", "Worker", "Database"],
        },
        secondary: {
          label: "Real-time update path",
          steps: ["Database", "SignalR / WebSocket", "Client"],
        },
      },
      challenges: [
        {
          title: "Guaranteeing delivery without duplicate processing",
          description:
            "Workers need to acknowledge messages only after work is durably committed, so a crash mid-task doesn't silently drop it — but naive retry logic risks processing the same task twice. Message acknowledgment and idempotent handlers had to work together.",
        },
        {
          title: "Keeping real-time connections addressable",
          description:
            "Pushing an update to the right connected client (and only that client) required mapping users to active SignalR connections reliably, including across multiple server instances rather than assuming one client maps to one process.",
        },
        {
          title: "Backpressure under bursty load",
          description:
            "A sudden spike of incoming requests shouldn't overwhelm workers or the database. The queue absorbs bursts and workers scale independently of the API, so throughput degrades gracefully instead of falling over.",
        },
        {
          title: "Observability across an asynchronous flow",
          description:
            "Once work leaves the request/response cycle, tracing a single task from submission through queue, worker, database, and back to the client requires deliberate correlation — there's no single call stack to follow.",
        },
      ],
      techDecisions: [
        {
          decision: "RabbitMQ as the message broker",
          reasoning:
            "Mature, well-understood queuing semantics (acknowledgments, retries, dead-lettering) that decouple the API from worker throughput and let each side scale independently.",
        },
        {
          decision: "SignalR for real-time delivery",
          reasoning:
            "Push-based updates over WebSockets (with automatic fallback) instead of client-side polling, cutting both latency and unnecessary request volume.",
        },
        {
          decision: ".NET for the API and workers",
          reasoning:
            "A strongly-typed backend with first-class support for both the queuing and real-time pieces, keeping the API and worker codebases consistent.",
        },
        {
          decision: "PostgreSQL as the system of record",
          reasoning:
            "Workers and the API both need a consistent, transactional view of task state — Postgres gives that with room to add read replicas as load grows.",
        },
        {
          decision: "Docker Compose for local orchestration",
          reasoning:
            "API, workers, broker, and database run as independent services locally the same way they would in production, avoiding a gap between dev and deployed behavior.",
        },
      ],
      outcome:
        "The platform demonstrates a backend that stays responsive under asynchronous load: requests return immediately, processing happens off the critical path, and clients see results in real time instead of polling. It's a pattern built to extend to any workflow that needs reliable background processing — notifications, task pipelines, scheduled jobs.",
    },
  },
  {
    slug: "donor-platform",
    category: "Full-Stack / Legacy Modernization",
    title: "Donor & Campaign Platform Modernization",
    outcome:
      "Decomposed a legacy .NET monolith serving 50,000+ users into modular services with on-demand, zero-downtime releases.",
    description:
      "A multi-year modernization of an NGO's donor and campaign management system for Qatar Charity — decomposing a legacy .NET MVC monolith into modular RESTful services, rebuilding the front end with reusable React components, and automating the CI/CD and reporting workflows around it.",
    features: [
      "Legacy monolith decomposed into REST APIs",
      "Reusable React component library",
      "Campaign analytics integrations",
      "Donor tracking",
      "Zero-downtime CI/CD",
      "Automated data validation",
      "Automated donor & impact reporting",
    ],
    techStack: [".NET Core", "React", "Entity Framework", "SQL Server", "Azure App Services", "GitHub Actions", "Python"],
    links: {
      demo: undefined, // internal NGO system — no public demo
      github: undefined, // internal NGO system — not open source
    },
    image: undefined, // TODO: /images/projects/donor-platform/cover.png
    featured: true,
    caseStudy: {
      overview:
        "Qatar Charity ran donor management, campaign tracking, and humanitarian reporting through a single legacy .NET MVC monolith serving 50,000+ users. Over several years, this became a full modernization: decomposing the monolith into RESTful services, rebuilding the front end, and automating the operational workflows — deployment, reporting, data validation — around it.",
      problem:
        "The existing platform was a single .NET MVC monolith that had accumulated years of donation-campaign features. Every change risked the whole system, releases were infrequent and manual (biweekly at best), database queries had degraded under years of ad-hoc additions — especially under peak load during donation campaigns — and operational teams depended on engineering for basic reporting because there was no self-serve access to campaign or donor data.",
      solution:
        "The monolith was decomposed into modular components exposed through RESTful APIs, letting features ship independently instead of through a single release train. A reusable React component library was built on top of those APIs and wired into third-party campaign analytics and donor-tracking systems, giving operational teams real-time access to campaign data without going through engineering. Database queries across the critical modules were rewritten and optimized with Entity Framework and LINQ, and the release process itself was automated with GitHub Actions CI/CD pipelines targeting Azure App Services — moving deploys from a manual, biweekly process to on-demand, zero-downtime releases. Python automation scripts were added around the data pipeline to validate the thousands of donor records processed daily and to generate SSRS reports for quarterly humanitarian impact reviews.",
      architecture: {
        primary: {
          label: "Application architecture",
          steps: [
            "React Client",
            "RESTful API Layer",
            "Modular Business Services",
            "SQL Server",
            "Campaign Analytics & Donor Tracking Integrations",
          ],
        },
        secondary: {
          label: "CI/CD pipeline",
          steps: ["Git Push", "GitHub Actions", "Automated Build & Test", "Azure App Service (zero-downtime deploy)"],
        },
      },
      challenges: [
        {
          title: "Decomposing a monolith without breaking production",
          description:
            "The legacy system was live and serving 50,000+ users throughout the migration. Modules had to be extracted behind REST APIs incrementally, with the old and new code paths running side by side, rather than a big-bang rewrite that risked a hard cutover.",
        },
        {
          title: "Query performance at scale",
          description:
            "Years of ad-hoc additions had degraded critical queries, which became especially visible under the traffic spikes of active donation campaigns. Optimization work (Entity Framework, LINQ) had to target the highest-impact modules first rather than a full rewrite.",
        },
        {
          title: "Replacing a manual, infrequent release process",
          description:
            "Releases were a manual, biweekly bottleneck. Introducing CI/CD had to happen without disrupting a system that was mid-migration between monolith and modular services.",
        },
        {
          title: "Self-serve reporting for non-engineers",
          description:
            "Operational and campaign teams needed real-time access to donor and campaign data without filing engineering tickets for every report — solved with a reusable component layer plus automated SSRS reporting rather than one-off requests.",
        },
      ],
      techDecisions: [
        {
          decision: "Incremental, strangler-pattern extraction",
          reasoning:
            "Pulling modules out from behind REST APIs one at a time — rather than a full rewrite — let the legacy monolith and the new services run side by side during migration, keeping the system live for 50,000+ users throughout.",
        },
        {
          decision: "GitHub Actions + Azure App Services for CI/CD",
          reasoning:
            "Native fit with the existing .NET/Azure stack, enabling zero-downtime deploys without introducing a new platform to operate.",
        },
        {
          decision: "A reusable React component library",
          reasoning:
            "Consistent UI across the growing set of extracted features, and a single integration point for the third-party campaign analytics and donor-tracking APIs.",
        },
        {
          decision: "Python for data automation, decoupled from the core app",
          reasoning:
            "Data validation and SSRS reporting scripts were faster to iterate on in Python and didn't need to ship on the .NET application's release cycle.",
        },
      ],
      outcome:
        "Page load times dropped 35%, query execution time during peak campaigns improved 40%, releases moved from biweekly manual pushes to on-demand zero-downtime deploys, and operational teams gained real-time access to campaign and donor data without depending on engineering for reporting.",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project; next: Project } {
  const index = projects.findIndex((project) => project.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { prev, next };
}
