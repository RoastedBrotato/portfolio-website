import { animate, random, set, stagger } from "animejs";
import { baseDuration, easeOut } from "./presets";

export function animatePuzzleSystem(root: HTMLElement) {
  const pieces = root.querySelectorAll(".puzzle-piece");
  const labels = root.querySelectorAll(".puzzle-piece span");

  pieces.forEach((piece) => {
    set(piece, {
      opacity: 0,
      scale: 0.88,
      translateX: Number(piece.getAttribute("data-scatter-x") ?? 0),
      translateY: Number(piece.getAttribute("data-scatter-y") ?? 0),
      rotate: Number(piece.getAttribute("data-scatter-rotate") ?? 0)
    });
  });

  set(labels, {
    opacity: 0,
    translateY: 12
  });

  const assemble = animate(pieces, {
    opacity: [0, 1],
    scale: [0.88, 1],
    translateX: 0,
    translateY: 0,
    rotate: 0,
    easing: easeOut,
    duration: baseDuration + 260,
    delay: stagger(120)
  });

  const revealLabels = animate(labels, {
    opacity: [0, 1],
    translateY: [12, 0],
    easing: easeOut,
    duration: 520,
    delay: stagger(90, { start: 440 })
  });

  const shimmer = animate(root.querySelectorAll(".puzzle-piece-shape"), {
    fillOpacity: [
      { to: 1, duration: 0 },
      { to: 0.84, duration: 1200 },
      { to: 1, duration: 1200 }
    ],
    strokeOpacity: [
      { to: 0.75, duration: 0 },
      { to: 1, duration: 1200 },
      { to: 0.75, duration: 1200 }
    ],
    easing: "easeInOutSine",
    delay: stagger(160),
    loop: true,
    autoplay: false
  });

  assemble.then(() => {
    shimmer.play();
  });

  return {
    pause() {
      assemble.pause();
      revealLabels.pause();
      shimmer.pause();
    }
  };
}
