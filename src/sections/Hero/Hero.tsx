import { useEffect, useRef } from "react";
import { animateHero, startHeroCanvas } from "../../animations/hero";
import { profile } from "../../data/narrative";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const cleanupCanvas = canvasRef.current
      ? startHeroCanvas(canvasRef.current, rootRef.current)
      : undefined;
    const animation = reduceMotion ? undefined : animateHero(rootRef.current);

    return () => {
      cleanupCanvas?.();
      animation?.pause();
    };
  }, [reduceMotion]);

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-visual" aria-hidden="true">
        <canvas className="hero-canvas" ref={canvasRef} />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-badge" data-hero-copy>
            <span className="hero-badge-dot" />
            Dynamic rendering for product stories
          </div>
          <p className="hero-kicker" data-hero-copy>
            {profile.location} / Creative direction meets engineering
          </p>
          <h1 data-hero-copy>{profile.name}</h1>
          <h2 data-hero-copy>{profile.title}</h2>
          <p className="hero-tagline" data-hero-copy>
            {profile.tagline}
          </p>
          <div className="hero-actions" data-hero-copy>
            <a href="#projects">View work</a>
            <a className="secondary" href="#contact">
              Start a conversation
            </a>
          </div>
          <div className="hero-metadata" data-hero-copy>
            <span>Interfaces that feel alive</span>
            <span>Realtime systems</span>
            <span>Motion with intent</span>
          </div>
        </div>
      </div>
    </section>
  );
}
