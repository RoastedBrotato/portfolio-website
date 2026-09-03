import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/config";

const items = [
  siteConfig.availability.toUpperCase(),
  "REACT",
  "TYPESCRIPT",
  "PYTHON",
  ".NET",
  "GO",
  "POSTGRESQL",
  "DOCKER",
  "AI / RAG",
];

export function CredibilityStrip() {
  return (
    <Reveal as="section" className="border-y border-border py-7">
      <Marquee
        items={items}
        className="font-display text-xl italic text-foreground-muted sm:text-2xl"
      />
    </Reveal>
  );
}
