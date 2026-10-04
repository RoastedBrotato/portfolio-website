"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/**
 * The product-shot lighting shared by both speaker demos. The environment is
 * built from Lightformers rather than an HDR file, so it costs no download:
 * a big soft key, a cool steel strip for the rim (the one scene-only colour
 * from the audit's palette, 4.3) and a thin red strip so the brand colour
 * shows up as light on the clearcoat, not only as paint.
 */
export function Studio({ shadowY = -1.12 }: { shadowY?: number }) {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#8a9bb0" position={[-5, 1, -2]} rotation-y={Math.PI / 2.5} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={1.3} color="#ff2b1f" position={[5, 0.5, -1]} rotation-y={-Math.PI / 2.5} scale={[0.4, 5, 1]} />
        <Lightformer form="rect" intensity={0.6} position={[0, -3, 2]} rotation-x={Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <directionalLight position={[3, 5, 4]} intensity={0.8} />
      <ContactShadows position={[0, shadowY, 0]} opacity={0.65} scale={6} blur={2.4} far={2} frames={1} />
    </>
  );
}
