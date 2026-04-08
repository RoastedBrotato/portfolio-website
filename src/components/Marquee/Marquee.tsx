const words = [
  "Motion Design",
  "Creative Engineering",
  "Product Thinking",
  "Interface Development",
  "Real-time Systems",
  "Visual Storytelling",
  "Design Systems",
  "Interactive Prototypes",
  "Creative Coding",
  "Frontend Architecture"
];

// Duplicate so the seamless loop works at any screen width
const items = [...words, ...words];

export function Marquee() {
  return (
    <div className="marquee-band" aria-hidden="true">
      <div className="marquee-track">
        {items.map((word, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
