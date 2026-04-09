import { useCallback, useEffect, useRef, useState } from "react";
import { animate, remove } from "animejs";
import { projectList } from "../../data/narrative";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const AUTO_PLAY_INTERVAL = 3600;
const ITEM_HEIGHT = 74;

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = usePrefersReducedMotion();

  const currentIndex = ((step % projectList.length) + projectList.length) % projectList.length;

  const nextStep = useCallback(() => {
    setStep((current) => current + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + projectList.length) % projectList.length;
    if (diff > 0) {
      setStep((current) => current + diff);
    }
  };

  useEffect(() => {
    if (isPaused || reduceMotion) {
      return;
    }

    const interval = window.setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(interval);
  }, [isPaused, nextStep, reduceMotion]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const length = projectList.length;

    let normalizedDiff = diff;
    if (diff > length / 2) normalizedDiff -= length;
    if (diff < -length / 2) normalizedDiff += length;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  useEffect(() => {
    projectList.forEach((_, index) => {
      const chip = chipRefs.current[index];
      if (!chip) {
        return;
      }

      const distance = index - currentIndex;
      const wrappedDistance = wrap(-(projectList.length / 2), projectList.length / 2, distance);

      remove(chip);
      animate(
        chip,
        {
          translateY: wrappedDistance * ITEM_HEIGHT,
          opacity: 1 - Math.abs(wrappedDistance) * 0.22,
          scale: index === currentIndex ? 1 : 0.94,
          duration: reduceMotion ? 0 : 700,
          ease: "outElastic(1, .8)"
        }
      );
    });

    projectList.forEach((_, index) => {
      const card = cardRefs.current[index];
      const overlay = overlayRefs.current[index];

      if (!card) {
        return;
      }

      const status = getCardStatus(index);
      const isActive = status === "active";
      const isPrev = status === "prev";
      const isNext = status === "next";

      remove(card);
      animate(
        card,
        {
          translateX: isActive ? 0 : isPrev ? -112 : isNext ? 112 : 0,
          scale: isActive ? 1 : isPrev || isNext ? 0.88 : 0.74,
          opacity: isActive ? 1 : isPrev || isNext ? 0.38 : 0,
          rotate: isPrev ? -4 : isNext ? 4 : 0,
          duration: reduceMotion ? 0 : 650,
          ease: "outExpo"
        }
      );

      if (overlay) {
        remove(overlay);
        animate(
          overlay,
          {
            opacity: isActive ? 1 : 0,
            translateY: isActive ? 0 : 18,
            duration: reduceMotion ? 0 : 420,
            ease: "outQuad"
          }
        );
      }
    });
  }, [currentIndex, reduceMotion]);

  return (
    <div className="feature-carousel">
      <div className="feature-carousel-shell">
        <div className="feature-carousel-rail">
          <div className="feature-carousel-rail-fade feature-carousel-rail-fade-top" />
          <div className="feature-carousel-rail-fade feature-carousel-rail-fade-bottom" />

          <div className="feature-carousel-rail-track">
            {projectList.map((project, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  key={project.name}
                  ref={(element) => {
                    chipRefs.current[index] = element;
                  }}
                  type="button"
                  className={`feature-chip${isActive ? " is-active" : ""}`}
                  style={{ height: ITEM_HEIGHT }}
                  onClick={() => handleChipClick(index)}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  aria-pressed={isActive}
                >
                  <span className="feature-chip-index">0{index + 1}</span>
                  <span className="feature-chip-copy">
                    <span className="feature-chip-label">{project.name}</span>
                    <span className="feature-chip-meta">{project.type}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="feature-carousel-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="feature-carousel-stack">
            {projectList.map((project, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <article
                  key={project.name}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className="feature-card"
                  style={{
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none"
                  }}
                >
                  <img src={project.image} alt={project.name} className="feature-card-image" />

                  <div
                    ref={(element) => {
                      overlayRefs.current[index] = element;
                    }}
                    className="feature-card-overlay"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <p className="feature-card-kicker">Project 0{index + 1}</p>
                    <h3>{project.name}</h3>
                    <p className="feature-card-description">{project.summary}</p>
                    <p className="feature-card-stack">{project.stack.join(" · ")}</p>
                    <a href={project.link} className="feature-card-link">
                      View project
                    </a>
                  </div>

                  <div className={`feature-card-status${isActive ? " is-active" : ""}`}>
                    <span className="feature-card-status-dot" />
                    <span>{project.type}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
