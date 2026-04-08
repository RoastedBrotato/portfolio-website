type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  r: number;
  pulsePhase: number;
};

function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    bg: s.getPropertyValue("--bg").trim() || "#09090d",
    node: s.getPropertyValue("--accent-secondary").trim() || "#9b7cff",
    text: s.getPropertyValue("--text").trim() || "#f5efe8",
    muted: s.getPropertyValue("--muted").trim() || "#b6ab9b",
    line: s.getPropertyValue("--line").trim() || "rgba(245,239,232,0.12)"
  };
}

export function startSkillsNetwork(
  canvas: HTMLCanvasElement,
  skills: string[]
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let nodes: Node[] = [];
  let raf = 0;
  const mouse = { x: -9999, y: -9999, radius: 110 };

  const scatter = (w: number, h: number) => {
    const margin = 96;
    nodes = skills.map((label) => ({
      x: margin + Math.random() * (w - margin * 2),
      y: margin + Math.random() * (h - margin * 2),
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      label,
      r: 4.5 + Math.random() * 2,
      pulsePhase: Math.random() * Math.PI * 2
    }));
  };

  const resize = () => {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth ?? 800;
    const h = parent?.clientHeight ?? 420;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scatter(w, h);
  };

  let tick = 0;

  const draw = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const c = readColors();
    tick += 0.012;

    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const maxDist = 190;
        if (dist > maxDist) continue;

        const alpha = (1 - dist / maxDist) * 0.38;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(155, 124, 255, ${alpha})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }

    // Nodes
    for (const node of nodes) {
      node.pulsePhase += 0.018;

      // Drift
      node.x += node.vx;
      node.y += node.vy;

      // Soft boundary
      const pad = 88;
      if (node.x < pad) node.vx = Math.abs(node.vx) * 0.98;
      if (node.x > w - pad) node.vx = -Math.abs(node.vx) * 0.98;
      if (node.y < pad * 0.6) node.vy = Math.abs(node.vy) * 0.98;
      if (node.y > h - pad * 0.6) node.vy = -Math.abs(node.vy) * 0.98;

      // Mouse repulsion
      const mdx = node.x - mouse.x;
      const mdy = node.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < mouse.radius && md > 0) {
        const f = ((mouse.radius - md) / mouse.radius) * 3.5;
        node.x += (mdx / md) * f;
        node.y += (mdy / md) * f;
      }

      // Pulse scale
      const pulse = 1 + Math.sin(node.pulsePhase) * 0.18;
      const r = node.r * pulse;

      // Glow halo
      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4.5);
      glow.addColorStop(0, "rgba(155, 124, 255, 0.28)");
      glow.addColorStop(1, "rgba(155, 124, 255, 0)");
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = c.node;
      ctx.fill();

      // Label
      ctx.font = "12px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = c.muted;
      ctx.fillText(node.label, node.x, node.y + r + 7);
    }

    raf = requestAnimationFrame(draw);
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };
  const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

  resize();
  draw();
  window.addEventListener("resize", resize);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onMouseLeave);
  };
}
