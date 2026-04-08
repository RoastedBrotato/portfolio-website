import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { SectionHeading } from "../../components/SectionHeading/SectionHeading";
import { PuzzlePiece } from "../../components/PuzzlePiece/PuzzlePiece";
import { animatePuzzleSystem } from "../../animations/puzzle-system";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const puzzlePieces = [
  {
    label: "Business context",
    row: 0,
    column: 0,
    edges: { top: 0, right: 1, bottom: -1, left: 0 },
    scatter: { x: -168, y: -78, rotate: -19 }
  },
  {
    label: "User behavior",
    row: 0,
    column: 1,
    edges: { top: 0, right: -1, bottom: 1, left: -1 },
    scatter: { x: 78, y: -132, rotate: 16 }
  },
  {
    label: "Technical constraints",
    row: 0,
    column: 2,
    edges: { top: 0, right: 0, bottom: -1, left: 1 },
    scatter: { x: 188, y: -34, rotate: 21 }
  },
  {
    label: "Interface clarity",
    row: 1,
    column: 0,
    edges: { top: 1, right: -1, bottom: 0, left: 0 },
    scatter: { x: -122, y: 126, rotate: 14 }
  },
  {
    label: "Speed to ship",
    row: 1,
    column: 1,
    edges: { top: -1, right: 1, bottom: 0, left: 1 },
    scatter: { x: 38, y: 146, rotate: -14 }
  },
  {
    label: "Visual direction",
    row: 1,
    column: 2,
    edges: { top: 1, right: 0, bottom: 0, left: -1 },
    scatter: { x: 166, y: 102, rotate: -18 }
  }
] as const;

export function PuzzleSystem() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!rootRef.current || reduceMotion) {
      return;
    }

    const section = rootRef.current;
    let animation: ReturnType<typeof animatePuzzleSystem> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || hasAnimated.current) {
          return;
        }

        hasAnimated.current = true;
        animation = animatePuzzleSystem(section);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      animation?.pause();
    };
  }, [reduceMotion]);

  return (
    <section className="content-section puzzle-section" id="approach" ref={rootRef}>
      <div className="puzzle-copy">
        <SectionHeading
          eyebrow="Approach"
          title="Some teams see scattered constraints. I look for the shape that lets them work together."
          description="This section is the one explicit metaphor on the page: not a gimmick, but a visual expression of how product, design, engineering, and business pressure start to make sense when the system is assembled properly."
        />
      </div>

      <div className="puzzle-board" aria-hidden="true">
        {puzzlePieces.map((piece) => (
          <PuzzlePiece
            key={piece.label}
            className="puzzle-piece"
            label={piece.label}
            top={piece.edges.top}
            right={piece.edges.right}
            bottom={piece.edges.bottom}
            left={piece.edges.left}
            style={
              {
                "--piece-column": piece.column,
                "--piece-row": piece.row
              } as CSSProperties
            }
            data-column={piece.column}
            data-row={piece.row}
            data-scatter-rotate={piece.scatter.rotate}
            data-scatter-x={piece.scatter.x}
            data-scatter-y={piece.scatter.y}
          />
        ))}
      </div>
    </section>
  );
}
