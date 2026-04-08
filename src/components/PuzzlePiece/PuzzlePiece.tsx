import type { HTMLAttributes } from "react";

type Edge = -1 | 0 | 1;

type PuzzlePieceProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  top: Edge;
  right: Edge;
  bottom: Edge;
  left: Edge;
};

const size = 120;
const tab = 18;
const inset = tab;
const viewBoxSize = size + tab * 2;

function topEdge(kind: Edge) {
  const start = inset;
  const y = inset;
  const first = start + size * 0.34;
  const center = start + size * 0.5;
  const second = start + size * 0.66;
  const end = start + size;

  if (kind === 0) {
    return `L ${end} ${y}`;
  }

  const offset = kind === 1 ? -tab : tab;
  return [
    `L ${first} ${y}`,
    `C ${first + 6} ${y} ${first + 6} ${y + offset} ${center} ${y + offset}`,
    `C ${second - 6} ${y + offset} ${second - 6} ${y} ${second} ${y}`,
    `L ${end} ${y}`
  ].join(" ");
}

function rightEdge(kind: Edge) {
  const x = inset + size;
  const start = inset;
  const first = start + size * 0.34;
  const center = start + size * 0.5;
  const second = start + size * 0.66;
  const end = start + size;

  if (kind === 0) {
    return `L ${x} ${end}`;
  }

  const offset = kind === 1 ? tab : -tab;
  return [
    `L ${x} ${first}`,
    `C ${x} ${first + 6} ${x + offset} ${first + 6} ${x + offset} ${center}`,
    `C ${x + offset} ${second - 6} ${x} ${second - 6} ${x} ${second}`,
    `L ${x} ${end}`
  ].join(" ");
}

function bottomEdge(kind: Edge) {
  const y = inset + size;
  const start = inset + size;
  const first = inset + size * 0.66;
  const center = inset + size * 0.5;
  const second = inset + size * 0.34;
  const end = inset;

  if (kind === 0) {
    return `L ${end} ${y}`;
  }

  const offset = kind === 1 ? tab : -tab;
  return [
    `L ${first} ${y}`,
    `C ${first - 6} ${y} ${first - 6} ${y + offset} ${center} ${y + offset}`,
    `C ${second + 6} ${y + offset} ${second + 6} ${y} ${second} ${y}`,
    `L ${end} ${y}`
  ].join(" ");
}

function leftEdge(kind: Edge) {
  const x = inset;
  const start = inset + size;
  const first = inset + size * 0.66;
  const center = inset + size * 0.5;
  const second = inset + size * 0.34;
  const end = inset;

  if (kind === 0) {
    return `L ${x} ${end}`;
  }

  const offset = kind === 1 ? -tab : tab;
  return [
    `L ${x} ${first}`,
    `C ${x} ${first - 6} ${x + offset} ${first - 6} ${x + offset} ${center}`,
    `C ${x + offset} ${second + 6} ${x} ${second + 6} ${x} ${second}`,
    `L ${x} ${end}`
  ].join(" ");
}

function createPath(top: Edge, right: Edge, bottom: Edge, left: Edge) {
  return [
    `M ${inset} ${inset}`,
    topEdge(top),
    rightEdge(right),
    bottomEdge(bottom),
    leftEdge(left),
    "Z"
  ].join(" ");
}

export function PuzzlePiece({
  label,
  top,
  right,
  bottom,
  left,
  className,
  ...rest
}: PuzzlePieceProps) {
  return (
    <div className={className} {...rest}>
      <svg
        className="puzzle-piece-svg"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        aria-hidden="true"
      >
        <path className="puzzle-piece-shadow" d={createPath(top, right, bottom, left)} />
        <path className="puzzle-piece-shape" d={createPath(top, right, bottom, left)} />
      </svg>
      <span>{label}</span>
    </div>
  );
}
