import { animate, createTimeline, set, stagger } from "animejs";
import { baseDuration, easeOut } from "./presets";

export function animateHero(root: HTMLElement) {
  const heroChars = root.querySelectorAll(".hero-char");
  const textTargets = root.querySelectorAll("[data-hero-copy]");
  const heroBadge = root.querySelector(".hero-badge");
  const badgeDot = root.querySelector(".hero-badge-dot");
  const heroInner = root.querySelector(".hero-inner");
  const heroVisual = root.querySelector(".hero-visual");

  set(heroChars, { opacity: 0, translateY: 64, rotateZ: 8 });
  set(textTargets, { opacity: 0, translateY: 22, filter: "blur(8px)" });
  if (badgeDot) {
    set(badgeDot, { scale: 0.6, opacity: 0.4 });
  }

  const timeline = createTimeline({ duration: baseDuration });

  timeline
    .add(heroChars, {
      opacity: [0, 1],
      translateY: [64, 0],
      rotateZ: [8, 0],
      duration: 900,
      easing: "outExpo",
      delay: stagger(38, { start: 300 })
    })
    .add(
      textTargets,
      {
        opacity: [0, 1],
        translateY: [22, 0],
        filter: ["blur(8px)", "blur(0px)"],
        easing: easeOut,
        delay: stagger(160, { start: 0 })
      },
      "-=320"
    );

  const pulse = badgeDot
    ? animate(badgeDot, {
        scale: [0.95, 1.2, 0.95],
        opacity: [0.5, 1, 0.5],
        duration: 1800,
        ease: "inOutSine",
        loop: true,
        autoplay: false
      })
    : undefined;

  let floatAnim: ReturnType<typeof animate> | undefined;

  timeline.then(() => {
    pulse?.play();
    if (heroBadge) {
      floatAnim = animate(heroBadge, {
        translateY: [0, -9, 0],
        duration: 3400,
        ease: "inOutSine",
        loop: true
      });
    }
  });

  let frame = 0;

  const applyScrollState = () => {
    frame = 0;
    const rect = root.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height * 0.9, 1), 0), 1);

    if (heroInner) {
      set(heroInner, {
        translateY: progress * 120,
        opacity: 1 - progress * 0.9
      });
    }

    if (heroVisual) {
      set(heroVisual, {
        scale: 1 + progress * 0.08,
        translateY: progress * 72,
        opacity: 1 - progress * 0.45
      });
    }
  };

  const handleScroll = () => {
    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(applyScrollState);
  };

  applyScrollState();
  window.addEventListener("scroll", handleScroll, { passive: true });

  return {
    pause() {
      timeline.pause();
      pulse?.pause();
      floatAnim?.pause();
      window.removeEventListener("scroll", handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    }
  };
}

type AetherParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

type SafeZone = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export function startHeroCanvas(canvas: HTMLCanvasElement, interactionRoot?: HTMLElement) {
  const context = canvas.getContext("2d");

  if (!context) {
    return undefined;
  }

  let animationFrame = 0;
  let particles: AetherParticle[] = [];
  const mouse = { x: -9999, y: -9999, active: false, radius: 200 };
  let safeZone: SafeZone | null = null;

  const updateSafeZone = () => {
    const copyBlock = interactionRoot?.querySelector<HTMLElement>(".hero-copy");

    if (!copyBlock) {
      safeZone = null;
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const copyRect = copyBlock.getBoundingClientRect();
    const padX = Math.max(48, copyRect.width * 0.08);
    const padY = Math.max(40, copyRect.height * 0.12);

    safeZone = {
      left: Math.max(0, copyRect.left - canvasRect.left - padX),
      right: Math.min(canvasRect.width, copyRect.right - canvasRect.left + padX),
      top: Math.max(0, copyRect.top - canvasRect.top - padY),
      bottom: Math.min(canvasRect.height, copyRect.bottom - canvasRect.top + padY)
    };
  };

  const isInsideSafeZone = (x: number, y: number) =>
    safeZone
      ? x > safeZone.left && x < safeZone.right && y > safeZone.top && y < safeZone.bottom
      : false;

  const pushParticleOutOfSafeZone = (particle: AetherParticle) => {
    if (!safeZone || !isInsideSafeZone(particle.x, particle.y)) {
      return;
    }

    const distanceToLeft = Math.abs(particle.x - safeZone.left);
    const distanceToRight = Math.abs(safeZone.right - particle.x);
    const distanceToTop = Math.abs(particle.y - safeZone.top);
    const distanceToBottom = Math.abs(safeZone.bottom - particle.y);
    const escapeDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    if (escapeDistance === distanceToLeft) {
      particle.x = safeZone.left - particle.size * 2;
      particle.vx = -Math.abs(particle.vx || 0.12);
      return;
    }

    if (escapeDistance === distanceToRight) {
      particle.x = safeZone.right + particle.size * 2;
      particle.vx = Math.abs(particle.vx || 0.12);
      return;
    }

    if (escapeDistance === distanceToTop) {
      particle.y = safeZone.top - particle.size * 2;
      particle.vy = -Math.abs(particle.vy || 0.12);
      return;
    }

    particle.y = safeZone.bottom + particle.size * 2;
    particle.vy = Math.abs(particle.vy || 0.12);
  };

  const segmentIntersectsSafeZone = (a: AetherParticle, b: AetherParticle) => {
    if (!safeZone) {
      return false;
    }

    if (isInsideSafeZone(a.x, a.y) || isInsideSafeZone(b.x, b.y)) {
      return true;
    }

    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);

    if (
      maxX < safeZone.left ||
      minX > safeZone.right ||
      maxY < safeZone.top ||
      minY > safeZone.bottom
    ) {
      return false;
    }

    const corners = [
      [safeZone.left, safeZone.top, safeZone.right, safeZone.top],
      [safeZone.right, safeZone.top, safeZone.right, safeZone.bottom],
      [safeZone.right, safeZone.bottom, safeZone.left, safeZone.bottom],
      [safeZone.left, safeZone.bottom, safeZone.left, safeZone.top]
    ] as const;

    const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) =>
      (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);

    const intersectsLine = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      cx: number,
      cy: number,
      dx: number,
      dy: number
    ) => ccw(ax, ay, cx, cy, dx, dy) !== ccw(bx, by, cx, cy, dx, dy) &&
      ccw(ax, ay, bx, by, cx, cy) !== ccw(ax, ay, bx, by, dx, dy);

    return corners.some(([x1, y1, x2, y2]) => intersectsLine(a.x, a.y, b.x, b.y, x1, y1, x2, y2));
  };

  const createParticles = (width: number, height: number) => {
    const list: AetherParticle[] = [];
    const count = Math.floor((width * height) / 9000);

    for (let i = 0; i < count; i += 1) {
      const size = Math.random() * 2 + 1;
      let x = 0;
      let y = 0;
      let attempts = 0;

      do {
        x = Math.random() * (width - size * 4) + size * 2;
        y = Math.random() * (height - size * 4) + size * 2;
        attempts += 1;
      } while (attempts < 40 && isInsideSafeZone(x, y));

      list.push({
        x,
        y,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        size
      });
    }

    return list;
  };

  const resize = () => {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth ?? window.innerWidth;
    const height = parent?.clientHeight ?? window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    updateSafeZone();
    particles = createParticles(width, height);
  };

  const draw = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const styles = getComputedStyle(document.documentElement);
    const canvasBg = styles.getPropertyValue("--canvas-bg").trim() || "#09090d";
    const canvasNode = styles.getPropertyValue("--canvas-node").trim() || "rgba(232, 220, 255, 0.98)";
    const canvasLink = styles.getPropertyValue("--canvas-link").trim() || "rgba(201, 154, 255, 0.72)";
    const canvasLinkActive =
      styles.getPropertyValue("--canvas-link-active").trim() || "rgba(255, 255, 255, 0.82)";

    updateSafeZone();
    context.fillStyle = canvasBg;
    context.fillRect(0, 0, width, height);

    for (const p of particles) {
      if (p.x > width || p.x < 0) p.vx = -p.vx;
      if (p.y > height || p.y < 0) p.vy = -p.vy;

      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius + p.size && dist > 0.001) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      pushParticleOutOfSafeZone(p);

      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      context.fillStyle = canvasNode;
      context.fill();
    }

    const distThresholdSq = (width / 7) * (height / 7);

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (distSq >= distThresholdSq) {
          continue;
        }

        if (segmentIntersectsSafeZone(a, b)) {
          continue;
        }

        const opacity = Math.max(0, 1 - distSq / 20000);

        let nearMouse = false;
        if (mouse.active) {
          const dax = a.x - mouse.x;
          const day = a.y - mouse.y;
          nearMouse = Math.hypot(dax, day) < mouse.radius;
        }

        context.strokeStyle = nearMouse
          ? applyOpacity(canvasLinkActive, opacity)
          : applyOpacity(canvasLink, opacity);
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    animationFrame = window.requestAnimationFrame(draw);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
  };

  const handlePointerLeave = () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  };

  const pointerTarget = interactionRoot ?? canvas;

  resize();
  draw();

  window.addEventListener("resize", resize);
  pointerTarget.addEventListener("pointermove", handlePointerMove);
  pointerTarget.addEventListener("pointerleave", handlePointerLeave);

  return () => {
    window.removeEventListener("resize", resize);
    pointerTarget.removeEventListener("pointermove", handlePointerMove);
    pointerTarget.removeEventListener("pointerleave", handlePointerLeave);
    window.cancelAnimationFrame(animationFrame);
  };
}

function applyOpacity(color: string, opacity: number) {
  const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);

  if (!rgbaMatch) {
    return color;
  }

  const channels = rgbaMatch[1].split(",").slice(0, 3).map((channel) => channel.trim());
  return `rgba(${channels.join(", ")}, ${opacity})`;
}
