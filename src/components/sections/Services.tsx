import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-t border-border py-28 sm:py-40">
      <Container>
        <SectionHeading
          eyebrow="What I Build"
          title="Software for teams that need to move fast"
          description="If you're a founder or engineering lead trying to figure out what you could hand off — this is the shape of it."
        />
        <Reveal delay={0.1} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
