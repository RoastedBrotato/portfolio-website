import type { CSSProperties, JSX } from "react";
import {
  SiDocker,
  SiDotnet,
  SiExpress,
  SiGithubactions,
  SiGo,
  SiGraphql,
  SiHuggingface,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiSharp,
  SiTypescript,
} from "react-icons/si";
import { skillGroups } from "../../data/narrative";

function IconCodeBrackets() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18 3 12l6-6" />
      <path d="m15 6 6 6-6 6" />
    </svg>
  );
}

function IconAtom() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1.7" />
      <path d="M4.9 8.1c2.8-2.4 7.6-3.3 11.8-1.8 4.2 1.5 6.4 4.8 5.4 7.9-1 3.1-5.1 5-9.9 4.6-4.8-.4-8.6-2.9-9.2-6.1-.3-1.7.4-3.4 1.9-4.6Z" />
      <path d="M8.1 4.9c2.4 2.8 3.3 7.6 1.8 11.8-1.5 4.2-4.8 6.4-7.9 5.4-3.1-1-5-5.1-4.6-9.9.4-4.8 2.9-8.6 6.1-9.2 1.7-.3 3.4.4 4.6 1.9Z" transform="translate(7 0)" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 18a4 4 0 1 1 .8-7.9A5.5 5.5 0 0 1 18.5 12 3.5 3.5 0 1 1 18 19H7Z" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 4.5a3 3 0 0 0-5 2.2A3 3 0 0 0 5.5 12a3.2 3.2 0 0 0 3.2 3.2V19a2.5 2.5 0 0 0 5 0v-3.8A3.2 3.2 0 0 0 16.9 12a3 3 0 0 0 1-5.3 3 3 0 0 0-5-2.2" />
      <path d="M9 8.5c.8.4 1.6.6 3 .6s2.2-.2 3-.6M12 9.1v8.4" />
    </svg>
  );
}

function IconFlow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M8.2 6h7.6M7.5 7.7l3.2 7M16.5 7.7l-3.2 7" />
    </svg>
  );
}

type SkillIcon = {
  icon: JSX.Element;
  color: string;
};

const iconMap: Record<string, SkillIcon> = {
  TypeScript: { icon: <SiTypescript />, color: "#3178c6" },
  Python: { icon: <SiPython />, color: "#3776ab" },
  "C#": { icon: <SiSharp />, color: "#8c57c5" },
  Go: { icon: <SiGo />, color: "#00add8" },
  Rust: { icon: <SiRust />, color: "#dea584" },
  JavaScript: { icon: <SiJavascript />, color: "#f7df1e" },
  React: { icon: <SiReact />, color: "#61dafb" },
  "Next.js": { icon: <SiNextdotjs />, color: "#f5f5f5" },
  "Node.js": { icon: <SiNodedotjs />, color: "#5fa04e" },
  ".NET Core": { icon: <SiDotnet />, color: "#512bd4" },
  Express: { icon: <SiExpress />, color: "#f5f5f5" },
  GraphQL: { icon: <SiGraphql />, color: "#e10098" },
  Azure: { icon: <IconCloud />, color: "#0078d4" },
  Docker: { icon: <SiDocker />, color: "#2496ed" },
  PostgreSQL: { icon: <SiPostgresql />, color: "#4169e1" },
  "SQL Server": { icon: <IconDatabase />, color: "#cc2927" },
  MongoDB: { icon: <SiMongodb />, color: "#47a248" },
  "GitHub Actions": { icon: <SiGithubactions />, color: "#2088ff" },
  "Hugging Face": { icon: <SiHuggingface />, color: "#ffd21e" },
  RAG: { icon: <IconBrain />, color: "var(--accent-secondary)" },
  WebSockets: { icon: <IconFlow />, color: "var(--accent-secondary)" },
  Microservices: { icon: <IconFlow />, color: "var(--accent-secondary)" },
  REST: { icon: <IconFlow />, color: "var(--accent-secondary)" },
  "Power BI": { icon: <IconDatabase />, color: "#f2c811" }
};

export function Skills() {
  return (
    <section className="content-section scene scene-skills" id="skills">
      <div className="skills-head" data-reveal>
        <div className="skills-copy">
          <p className="meta">Skills</p>
          <h2>Things I know.</h2>
        </div>
        <p className="skills-intro">
          Production stack across frontend, backend, cloud, and AI systems.
        </p>
      </div>

      <div className="skills-groups" data-reveal>
        {skillGroups.map((group) => (
          <section key={group.label} className="skill-row">
            <p className="skill-row-label">{group.label}</p>
            <div className="skill-icon-grid">
              {group.skills.map((skill) => (
                <div
                  key={skill}
                  className="skill-icon-tile"
                  title={skill}
                  aria-label={skill}
                  style={{ "--skill-brand": (iconMap[skill]?.color ?? "var(--accent-secondary)") } as CSSProperties}
                >
                  <span className="skill-icon-glyph">
                    {iconMap[skill]?.icon ?? <IconCodeBrackets />}
                  </span>
                  <span className="skill-icon-name">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
