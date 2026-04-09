import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { animate, set, stagger } from "animejs";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const NODE_W = 220;
const NODE_H = 116;
const BASE_CANVAS_W = 1240 + NODE_W + 60;
const BASE_CANVAS_H = 210 + NODE_H + 55;

type NodeDef = {
  id: string;
  label: string;
  title: string;
  desc: string;
  accent: string;
  icon: JSX.Element;
  initPos: { x: number; y: number };
};

function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

function IconGitBranch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15"/>
      <circle cx="18" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

const NODES: NodeDef[] = [
  {
    id: "n1",
    label: "Discovery",
    title: "Brief & Research",
    desc: "Understand the problem, users, and constraints before touching anything.",
    accent: "var(--accent)",
    icon: <IconCompass />,
    initPos: { x: 40, y: 50 },
  },
  {
    id: "n2",
    label: "Design",
    title: "Product Design",
    desc: "User flows, interface structure, and visual direction — all in one pass.",
    accent: "var(--accent-secondary)",
    icon: <IconLayers />,
    initPos: { x: 340, y: 210 },
  },
  {
    id: "n3",
    label: "Strategy",
    title: "Technical Direction",
    desc: "Architecture, stack choices, and engineering decisions that won't bite you later.",
    accent: "var(--accent-tertiary)",
    icon: <IconGitBranch />,
    initPos: { x: 640, y: 46 },
  },
  {
    id: "n4",
    label: "Build",
    title: "Development",
    desc: "Clean, performant code. Shipped on time, not just on spec.",
    accent: "var(--accent-secondary)",
    icon: <IconCode />,
    initPos: { x: 940, y: 206 },
  },
  {
    id: "n5",
    label: "Deliver",
    title: "Launch & Iterate",
    desc: "Get it live. Measure real signal. Make the next version better.",
    accent: "var(--accent)",
    icon: <IconTrendingUp />,
    initPos: { x: 1240, y: 48 },
  },
];

const CONNECTIONS = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4" },
  { from: "n4", to: "n5" },
];

type Positions = Record<string, { x: number; y: number }>;

const initPositions = (): Positions =>
  Object.fromEntries(NODES.map((n) => [n.id, { ...n.initPos }]));

function ConnectionLine({ from, to, positions }: { from: string; to: string; positions: Positions }) {
  const a = positions[from];
  const b = positions[to];
  if (!a || !b) return null;

  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const cx = (x1 + x2) / 2;

  return (
    <path
      d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
      fill="none"
      style={{ stroke: "var(--muted)" }}
      strokeWidth={1.5}
      strokeDasharray="6 5"
      strokeLinecap="round"
      opacity={0.45}
    />
  );
}

export function WorkflowBuilder() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const [positions, setPositions] = useState<Positions>(initPositions);
  const [canvasW, setCanvasW] = useState(BASE_CANVAS_W);
  const [canvasH, setCanvasH] = useState(BASE_CANVAS_H);
  const hasDraggedRef = useRef(false);

  const drag = useRef<{
    id: string;
    startClientX: number;
    startClientY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Entrance animation
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = root.querySelectorAll(".wf-node");
    if (!reduceMotion) {
      set(nodes, { opacity: 0, translateY: 24 });

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            animate(nodes, {
              opacity: [0, 1],
              translateY: [24, 0],
              duration: 600,
              easing: "outCubic",
              delay: stagger(90),
            });
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(root);
      return () => observer.disconnect();
    }
  }, [reduceMotion]);

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    hasDraggedRef.current = true;
    drag.current = {
      id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: positions[id].x,
      origY: positions[id].y,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const { id, startClientX, startClientY, origX, origY } = drag.current;
    const nx = Math.max(0, origX + e.clientX - startClientX);
    const ny = Math.max(0, origY + e.clientY - startClientY);
    setPositions((p) => ({ ...p, [id]: { x: nx, y: ny } }));
    setCanvasW((w) => Math.max(w, nx + NODE_W + 60));
    setCanvasH((h) => Math.max(h, ny + NODE_H + 60));
  };

  const onPointerUp = () => { drag.current = null; };

  useEffect(() => {
    const wrap = canvasRef.current;
    if (!wrap) return;

    const applyWidth = (width: number) => {
      const nextW = Math.max(BASE_CANVAS_W, Math.floor(width));
      setCanvasW((currentW) => {
        if (currentW === nextW) {
          return currentW;
        }

        if (!hasDraggedRef.current) {
          const ratio = nextW / BASE_CANVAS_W;
          setPositions(
            Object.fromEntries(
              NODES.map((node) => [
                node.id,
                { x: Math.round(node.initPos.x * ratio), y: node.initPos.y }
              ])
            )
          );
        }

        return nextW;
      });
    };

    applyWidth(wrap.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      applyWidth(entry.contentRect.width);
    });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="wf-root" ref={rootRef}>
      <div className="wf-header">
        <div className="wf-header-left">
          <span className="wf-status-dot" aria-hidden="true" />
          <span className="meta">How I work</span>
        </div>
        <p className="wf-hint">Drag nodes to explore</p>
      </div>

      <div
        className="wf-canvas-wrap"
        ref={canvasRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="region"
        aria-label="Workflow diagram"
      >
        <div className="wf-canvas" style={{ width: canvasW, height: canvasH }}>
          {/* SVG connection lines */}
          <svg
            className="wf-svg"
            width={canvasW}
            height={canvasH}
            aria-hidden="true"
          >
            {CONNECTIONS.map((c) => (
              <ConnectionLine key={`${c.from}-${c.to}`} from={c.from} to={c.to} positions={positions} />
            ))}
          </svg>

          {/* Nodes */}
          {NODES.map((node) => {
            const pos = positions[node.id];
            return (
              <div
                key={node.id}
                className="wf-node"
                style={{
                  "--node-accent": node.accent,
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                } as CSSProperties}
                onPointerDown={(e) => onPointerDown(e, node.id)}
              >
                <div className="wf-node-top">
                  <div className="wf-node-icon" aria-hidden="true">
                    {node.icon}
                  </div>
                  <span className="wf-node-label">{node.label}</span>
                </div>
                <h4 className="wf-node-title">{node.title}</h4>
                <p className="wf-node-desc">{node.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wf-footer">
        <span>{NODES.length} stages</span>
        <span>{CONNECTIONS.length} connections</span>
      </div>
    </div>
  );
}
