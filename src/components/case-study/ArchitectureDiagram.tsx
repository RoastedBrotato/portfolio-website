"use client";

import { motion } from "framer-motion";
import { ArrowDown, CornerDownRight } from "lucide-react";
import { ArchitectureFlow } from "@/types";

function FlowSteps({ flow, dashed = false }: { flow: ArchitectureFlow; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-stretch">
      {flow.label && (
        <span className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent">
          {flow.label}
        </span>
      )}
      {flow.steps.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="flex flex-col items-center"
        >
          <div className="w-full border-2 border-border-strong bg-background-elevated px-5 py-3.5 text-center font-mono text-xs font-bold uppercase tracking-[0.08em] text-foreground sm:w-auto sm:min-w-[280px]">
            {step}
          </div>
          {i < flow.steps.length - 1 && (
            <ArrowDown
              size={16}
              strokeWidth={1.5}
              className={dashed ? "my-2 text-foreground-subtle/50" : "my-2 text-accent"}
            />
          )}
        </motion.div>
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
