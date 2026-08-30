import { Layers, Plug, Sparkles, Workflow } from "lucide-react";
import { Service } from "@/types";

const iconMap = {
  sparkles: Sparkles,
  layers: Layers,
  plug: Plug,
  workflow: Workflow,
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = iconMap[service.icon];

  return (
    <div className="group rounded-2xl border border-border bg-background-elevated p-7 transition-colors duration-300 hover:border-border-strong hover:bg-background-elevated-hover sm:p-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-background text-accent">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{service.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted">
        {service.description}
      </p>
      <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
        {service.capabilities.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-muted">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
