import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Configurator } from "@/components/lab/Configurator";

export const metadata: Metadata = pageMetadata({
  title: "Product configurator",
  description:
    "A real-time 3D product configurator: turn it, recolour it, open it up. A demo of the Interactive 3D package, built with React Three Fiber.",
  path: "/lab/configurator",
});

export default function ConfiguratorPage() {
  return (
    <>
      <PageHeader
        label="Lab · Interactive 3D"
        title="Product configurator"
        intro={
          <>
            Turn it, recolour it, look inside. Quarr One is a fictional speaker, modelled from
            primitives and lit without a single image file — the same build a real product would
            get, minus the CAD.
          </>
        }
      />
      <section className="border-border-strong border-b-2">
        <Configurator />
      </section>
    </>
  );
}
