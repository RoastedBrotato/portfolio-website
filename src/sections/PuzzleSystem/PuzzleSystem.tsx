import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PuzzlePiece } from "../../components/PuzzlePiece/PuzzlePiece";

type PuzzleDatum = {
  label: string;
  row: number;
  column: number;
  edges: { top: -1 | 0 | 1; right: -1 | 0 | 1; bottom: -1 | 0 | 1; left: -1 | 0 | 1 };
  scatter: { x: number; y: number; rotate: number };
  accent: string;
  tone: string;
};

type PieceOffset = { x: number; y: number; rotate: number };

const puzzlePieces: PuzzleDatum[] = [
  {
    label: "Business context",
    row: 0,
    column: 0,
    edges: { top: 0, right: 1, bottom: -1, left: 0 },
    scatter: { x: -96, y: -74, rotate: -16 },
    accent: "var(--accent-secondary)",
    tone: "rgba(111, 119, 201, 0.2)"
  },
  {
    label: "User behavior",
    row: 0,
    column: 1,
    edges: { top: 0, right: -1, bottom: 1, left: -1 },
    scatter: { x: 0, y: -92, rotate: 10 },
    accent: "var(--accent)",
    tone: "rgba(184, 131, 77, 0.18)"
  },
  {
    label: "Technical constraints",
    row: 0,
    column: 2,
    edges: { top: 0, right: 0, bottom: -1, left: 1 },
    scatter: { x: 98, y: -70, rotate: 14 },
    accent: "var(--accent-tertiary)",
    tone: "rgba(147, 164, 184, 0.18)"
  },
  {
    label: "Interface clarity",
    row: 1,
    column: 0,
    edges: { top: 1, right: -1, bottom: 0, left: 0 },
    scatter: { x: -88, y: 84, rotate: 12 },
    accent: "var(--accent)",
    tone: "rgba(184, 131, 77, 0.2)"
  },
  {
    label: "Speed to ship",
    row: 1,
    column: 1,
    edges: { top: -1, right: 1, bottom: 0, left: 1 },
    scatter: { x: 0, y: 102, rotate: -10 },
    accent: "var(--accent-secondary)",
    tone: "rgba(111, 119, 201, 0.18)"
  },
  {
    label: "Visual direction",
    row: 1,
    column: 2,
    edges: { top: 1, right: 0, bottom: 0, left: -1 },
    scatter: { x: 92, y: 76, rotate: -12 },
    accent: "var(--accent-tertiary)",
    tone: "rgba(147, 164, 184, 0.22)"
  }
];

const zeroOffsets = (): PieceOffset[] =>
  puzzlePieces.map(() => ({ x: 0, y: 0, rotate: 0 }));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function PuzzleSystem() {
  const rootRef = useRef<HTMLElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const assembledOverrideRef = useRef(false);
  const dragState = useRef<{
    index: number;
    pointerId: number;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    minLeft: number;
    maxLeft: number;
    minTop: number;
    maxTop: number;
    originX: number;
    originY: number;
    originRotate: number;
  } | null>(null);

  const [progress, setProgress] = useState(0);
  const [offsets, setOffsets] = useState<PieceOffset[]>(() => zeroOffsets());
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [assembledOverride, setAssembledOverride] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.9;
      const end = -rect.height * 0.15;
      const next = clamp((start - rect.top) / (start - end), 0, 1);

      if (assembledOverrideRef.current) {
        assembledOverrideRef.current = false;
        setAssembledOverride(false);
      }

      setProgress(next);
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const hasDisplacedPieces = useMemo(() => {
    const hasDraggedOffsets = offsets.some(
      (offset) => Math.abs(offset.x) > 1 || Math.abs(offset.y) > 1 || Math.abs(offset.rotate) > 0.5
    );

    return hasDraggedOffsets || progress < 0.995;
  }, [offsets, progress]);

  const handlePointerDown = (index: number, event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    assembledOverrideRef.current = false;
    setAssembledOverride(false);

    const board = boardRef.current;
    const piece = pieceRefs.current[index];
    const boardRect = board?.getBoundingClientRect();
    const pieceRect = piece?.getBoundingClientRect();

    if (!boardRect || !pieceRect) {
      return;
    }

    dragState.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: pieceRect.left - boardRect.left,
      startTop: pieceRect.top - boardRect.top,
      minLeft: 0,
      maxLeft: Math.max(0, boardRect.width - pieceRect.width),
      minTop: 0,
      maxTop: Math.max(0, boardRect.height - pieceRect.height),
      originX: offsets[index]?.x ?? 0,
      originY: offsets[index]?.y ?? 0,
      originRotate: offsets[index]?.rotate ?? 0
    };

    setDraggingIndex(index);
  };

  const handlePointerMove = (index: number, event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;

    if (!drag || drag.index !== index || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const clampedLeft = clamp(drag.startLeft + deltaX, drag.minLeft, drag.maxLeft);
    const clampedTop = clamp(drag.startTop + deltaY, drag.minTop, drag.maxTop);
    const nextX = drag.originX + (clampedLeft - drag.startLeft);
    const nextY = drag.originY + (clampedTop - drag.startTop);
    const nextRotate = clamp(drag.originRotate + (event.clientX - drag.startX) * 0.045, -26, 26);

    setOffsets((current) =>
      current.map((offset, currentIndex) =>
        currentIndex === index
          ? { x: nextX, y: nextY, rotate: nextRotate }
          : offset
      )
    );
  };

  const finishDrag = (index: number, event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;

    if (!drag || drag.index !== index || drag.pointerId !== event.pointerId) {
      return;
    }

    dragState.current = null;
    setDraggingIndex((current) => (current === index ? null : current));

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleReset = () => {
    setOffsets(zeroOffsets());
    setDraggingIndex(null);
    assembledOverrideRef.current = true;
    setAssembledOverride(true);
  };

  return (
    <section className="content-section scene scene-puzzle" id="approach" ref={rootRef}>
      <div className="puzzle-shell">
        <div className="puzzle-copy">
          <p className="meta" data-reveal>Approach</p>
          <h2 data-reveal>Move the pieces. Keep the shape.</h2>
          <p data-reveal>
            Strategy, speed, interface clarity, and visual direction never arrive in order. The work is
            organizing pressure until the product locks together.
          </p>
        </div>

        <div className="puzzle-board" aria-label="Interactive puzzle board" ref={boardRef}>
          <div className="puzzle-actions">
            <button
              type="button"
              className="puzzle-reset"
              onClick={handleReset}
              disabled={!hasDisplacedPieces}
            >
              Sort pieces back together
            </button>
          </div>
          {puzzlePieces.map((piece, index) => {
            const offset = offsets[index];
            const displayProgress = assembledOverride ? 1 : progress;
            const x = piece.scatter.x * (1 - displayProgress) + offset.x;
            const y = piece.scatter.y * (1 - displayProgress) + offset.y;
            const rotate = piece.scatter.rotate * (1 - displayProgress) + offset.rotate;
            const lifted = draggingIndex === index;

            return (
              <PuzzlePiece
                key={piece.label}
                ref={(element) => {
                  pieceRefs.current[index] = element;
                }}
                className={`puzzle-piece${lifted ? " is-dragging" : ""}`}
                label={piece.label}
                top={piece.edges.top}
                right={piece.edges.right}
                bottom={piece.edges.bottom}
                left={piece.edges.left}
                onPointerDown={(event) => handlePointerDown(index, event)}
                onPointerMove={(event) => handlePointerMove(index, event)}
                onPointerUp={(event) => finishDrag(index, event)}
                onPointerCancel={(event) => finishDrag(index, event)}
                style={
                  {
                    "--piece-column": piece.column,
                    "--piece-row": piece.row,
                    "--piece-x": `${x}px`,
                    "--piece-y": `${y}px`,
                    "--piece-rotate": `${rotate}deg`,
                    "--piece-z": lifted ? 12 : index + 1,
                    "--piece-accent": piece.accent,
                    "--piece-tone": piece.tone
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
