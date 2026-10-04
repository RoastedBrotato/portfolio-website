"use client";

import { m } from "framer-motion";
import { CornerDownRight } from "lucide-react";
import { ArchitectureFlow } from "@/types";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Seconds per step: box, then the connector drawing down to the next one. */
const STEP = 0.12;

/**
 * A connector that draws itself (audit 6.2: the diagram draws on view). The
 * line is an SVG path animated from pathLength 0 to 1; the arrowhead lands as
 * the line arrives.
 */
function Connector({ index, dashed, still }: { index: number; dashed: boolean; still: boolean }) {
  const delay = index * STEP + 0.1;
  const draw = still
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.25, delay, ease: "easeOut" as const },
      };
  const land = still
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.15, delay: delay + 0.2 },
      };

  return (
    <svg
      width="12"
      height="30"
      viewBox="0 0 12 30"
      fill="none"
      aria-hidden
      className={dashed ? "text-foreground-subtle/60 my-1.5" : "text-accent my-1.5"}
    >
      <m.path
        d="M6 0 V27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray={dashed ? "3 3" : undefined}
        {...draw}
      />
      <m.path d="M1.5 22.5 L6 27 L10.5 22.5" stroke="currentColor" strokeWidth="1.5" {...land} />
    </svg>
  );
}

function FlowSteps({ flow, dashed = false }: { flow: ArchitectureFlow; dashed?: boolean }) {
  const still = useReducedMotion();

  return (
    <div className="flex flex-col items-stretch">
      {flow.label && (
        <span className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent">
          {flow.label}
        </span>
      )}
      {flow.steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center">
          <m.div
            initial={still ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: i * STEP }}
            className="w-full border-2 border-border-strong bg-background-elevated px-5 py-3.5 text-center font-mono text-xs font-bold uppercase tracking-[0.08em] text-foreground sm:w-auto sm:min-w-[280px]"
          >
            {step}
          </m.div>
          {i < flow.steps.length - 1 && <Connector index={i} dashed={dashed} still={still} />}
        </div>
      ))}
    </div>
  );
}

export function ArchitectureDiagram({
  primary,
  secondary,
}: {
  primary: ArchitectureFlow;
  secondary?: ArchitectureFlow;
}) {
  return (
    <div className="border-2 border-border-strong bg-grid p-8 sm:p-12">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
        <div className="flex w-full flex-col items-center lg:w-auto">
          <FlowSteps flow={primary} />
        </div>
        {secondary && (
          <div className="flex w-full flex-col items-center lg:w-auto">
            <div className="mb-4 flex items-center gap-2 self-center font-mono text-xs text-foreground-subtle lg:hidden">
              <CornerDownRight size={14} />
              returns via
            </div>
            <FlowSteps flow={secondary} dashed />
          </div>
        )}
      </div>
    </div>
  );
}
