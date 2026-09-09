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
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Supabase",
      "PostgreSQL",
      "Recharts",
      "Mux",
    ],
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
          steps: [
            "Video Upload",
            "Mux (encoding & adaptive streaming)",
            "Playback in Training Log",
          ],
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
    slug: "ai-knowledge-assistant",
    category: "AI / RAG / Full-Stack",
    title: "KnowledgeOS",
    outcome:
      "A multi-tenant RAG platform where admins scope custom AI assistants to specific documents and roles, with every answer traceable back to its source.",
    description:
      "A self-hostable knowledge-assistant platform for internal company documents — admins upload PDFs and DOCX files, spin up chat assistants scoped to specific documents and employee roles, and every answer comes back grounded and cited against the exact document and page it came from.",
    features: [
      "Multi-tenant organizations with admin/employee roles",
      "PDF & DOCX ingestion with page-aware chunking",
      "pgvector semantic search (OpenAI embeddings)",
      "Assistants scoped to specific documents and roles",
      "Custom system prompt per assistant",
      "Grounded chat with inline, numbered citations",
      "JWT authentication",
      "Dockerized Postgres + pgvector",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "pgvector",
      "SQLAlchemy",
      "OpenAI API",
      "JWT",
      "Docker",
    ],
    links: {
      demo: undefined, // self-hosted, no public demo
      github: "https://github.com/RoastedBrotato/AIKnowledgeAssistant",
    },
    image: "/images/projects/ai-knowledge-assistant/cover.png",
    gallery: [
      "/images/projects/ai-knowledge-assistant/login.png",
      "/images/projects/ai-knowledge-assistant/chat.png",
    ],
    featured: true,
    caseStudy: {
      overview:
        "KnowledgeOS is a multi-tenant knowledge-assistant platform: an organization's admin uploads internal documents — policy handbooks, onboarding guides, anything in PDF or DOCX — and spins up a chat assistant scoped to exactly those documents and to whichever roles should be able to use it. Employees then ask questions in plain language and get answers grounded in, and cited against, the company's own documents instead of a general-purpose model's guess.",
      problem:
        "Internal knowledge tends to live scattered across PDFs and DOCX files that employees either have to hunt through themselves or ping HR/IT to answer. A general-purpose chatbot bolted on top of everything doesn't solve it either — it will happily answer confidently from anything it's ever seen, with no way to tell whether an answer actually came from the company's leave policy or was invented. What was needed was something narrower: let an admin decide exactly which documents a given assistant can see and who can talk to it, and make every answer traceable back to a real document and page.",
      solution:
        "An admin uploads a PDF or DOCX; the backend extracts its text (pypdf for PDFs, python-docx for Word files), splits it into overlapping ~1500-character chunks that track page numbers where available, embeds each chunk with OpenAI's text-embedding-3-small, and stores the vectors in a pgvector column alongside the rest of the relational data — no separate vector database to run. The admin then creates an assistant: a name, a system prompt (\"You are a helpful company knowledge assistant...\"), a set of documents it's allowed to see, and which roles (admin/employee) can use it. When an employee asks a question, it's embedded and matched via pgvector's cosine-distance operator against only that assistant's linked documents (and only within its own organization), and the top matches are handed to gpt-4o-mini inside a prompt that restricts it to answering from the numbered excerpts and citing them inline — every stored message keeps its citations (filename, page, snippet) so an answer can always be checked against the exact source it came from.",
      architecture: {
        primary: {
          label: "Ingestion pipeline",
          steps: [
            "PDF / DOCX Upload (admin)",
            "Text Extraction (pypdf / python-docx)",
            "Page-aware Chunking",
            "OpenAI Embeddings",
            "pgvector (Postgres)",
          ],
        },
        secondary: {
          label: "Chat & retrieval",
          steps: [
            "Employee Question",
            "Query Embedding",
            "Cosine-Distance Retrieval (scoped to assistant + org)",
            "gpt-4o-mini (grounded, cited)",
            "Answer + Citations",
          ],
        },
      },
      challenges: [
        {
          title: "Tenant isolation without a service per customer",
          description:
            "Every table — users, documents, chunks, assistants — carries an org_id, and every query (retrieval, chat, document listing) filters on it explicitly, rather than standing up separate databases or schemas per organization for what's fundamentally shared infrastructure.",
        },
        {
          title: "Scoping retrieval to exactly the right documents",
          description:
            "A similarity search that isn't scoped tightly enough would let a \"Sales\" assistant surface HR chunks, or worse, another organization's data. Retrieval filters on both the assistant's specific linked-document set and its org_id before ranking by vector distance, not after.",
        },
        {
          title: "Role-gating who can use which assistant",
          description:
            'Allowed roles live on the assistant, not the user, so access has to be checked server-side on every chat request (not just when listing assistants in the UI) — an admin can always use any assistant in their org, an employee only those whose allowed_roles include "employee".',
        },
        {
          title: "Keeping answers traceable, not just plausible",
          description:
            "The model is restricted to answering from the numbered source excerpts it's given and told to say so plainly when they don't contain the answer, rather than filling the gap with a plausible-sounding guess. Every message persists the filename, page, and snippet actually used, so a questionable answer can be checked against its source instead of just trusted.",
        },
        {
          title: "Page numbers don't exist for every file type",
          description:
            "python-docx has no native concept of a page, so page-aware citation works cleanly for PDFs but DOCX chunks fall back to whole-document text with no page number — a real trade-off in citation precision depending on what an org actually uploads.",
        },
      ],
      techDecisions: [
        {
          decision: "pgvector inside the primary Postgres instance",
          reasoning:
            "One database to run and back up instead of a separate vector store — chunk embeddings live in a normal SQLAlchemy-mapped table and get queried with a plain cosine_distance() call, which was enough for this scale without adding a dedicated vector database to operate.",
        },
        {
          decision: "An OpenAI-compatible client with a configurable base URL",
          reasoning:
            "Embeddings and chat both go through a client that accepts a configurable base_url, so the same code can point at OpenAI directly or any OpenAI-compatible endpoint (Azure OpenAI, a self-hosted gateway) with a config change instead of an application change.",
        },
        {
          decision: "Synchronous ingestion inside the upload request",
          reasoning:
            "For the document sizes this targets, extraction, chunking, and embedding finish well within a normal request lifetime — a background job queue would have added real operational surface for a scaling problem that isn't actually happening yet.",
        },
        {
          decision: "A strict, excerpt-only system prompt with inline citations",
          reasoning:
            "Grounding is the product's core trust promise, so the prompt explicitly restricts the model to the numbered excerpts it's given and requires inline citations, rather than leaving grounding behavior to whatever the base model happens to do by default.",
        },
        {
          decision: "JWT auth with bcrypt instead of an identity provider",
          reasoning:
            "A small, self-contained auth layer covered org- and role-based access without standing up Keycloak or Auth0 for what is fundamentally two roles per organization.",
        },
      ],
      outcome:
        "The result is a self-hostable, multi-tenant RAG platform: an org admin can upload internal documents and hand employees a scoped, cited chat assistant in minutes. Demoed end to end with real HR documents — an employee handbook, leave policy, and travel policy — from upload through grounded, cited chat.",
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
    techStack: [
      "Go",
      "Python",
      "Faster-Whisper",
      "XTTS v2",
      "RAG",
      "LLMs",
      "Keycloak",
      "Docker",
      "PostgreSQL",
      "Vector Database",
    ],
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
