"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { COLORWAYS, type Colorway } from "@/components/scene/speaker/colorways";

export type { Colorway };

/*
 * "Quarr One" — a fictional bookshelf speaker, built entirely from primitives
 * so the demos ship no model file. Hard-edged on purpose (audit 4.3): a slab
 * of a body, a flat baffle, round drivers.
 *
 * Shared by the configurator (/lab/configurator) and the launch page
 * (/lab/launch). `explode` separates the parts along the depth axis for the
 * launch page's "inside" step and the configurator's exploded view.
 */

/*
 * Module-level materials: there is only ever one speaker on screen, and
 * lerping these in place each frame is cheaper than swapping materials. The
 * module is only imported on the client (dynamic, ssr: false).
 */
const materials = {
  body: new THREE.MeshPhysicalMaterial({ roughness: 0.42, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.35 }),
  baffle: new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
  accent: new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 }),
  metal: new THREE.MeshStandardMaterial({ roughness: 0.28, metalness: 0.9 }),
  cone: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.9, metalness: 0 }),
  rubber: new THREE.MeshStandardMaterial({ color: "#0b0b0b", roughness: 0.75, metalness: 0 }),
  dome: new THREE.MeshPhysicalMaterial({ color: "#2a2a2a", roughness: 0.2, metalness: 0.6, clearcoat: 1 }),
};

const target = new THREE.Color();

function setColorway(colorway: Colorway, rate: number) {
  const c = COLORWAYS[colorway];
  materials.body.color.lerp(target.set(c.body), rate);
  materials.baffle.color.lerp(target.set(c.baffle), rate);
  materials.accent.color.lerp(target.set(c.accent), rate);
  materials.metal.color.lerp(target.set(c.metal), rate);
}

// Start on the first colourway rather than lerping in from white.
setColorway("graphite", 1);

/** Facing +z: cylinders and cones are built along y, so tip them forward. */
const FACE_FORWARD: [number, number, number] = [Math.PI / 2, 0, 0];

function Woofer() {
  return (
    <group>
      <mesh material={materials.rubber} position={[0, 0, 0.01]}>
        <torusGeometry args={[0.4, 0.045, 16, 64]} />
      </mesh>
      <mesh material={materials.cone} rotation={FACE_FORWARD} position={[0, 0, -0.07]}>
        <cylinderGeometry args={[0.37, 0.12, 0.16, 48, 1, true]} />
      </mesh>
      <mesh material={materials.dome} rotation={FACE_FORWARD} position={[0, 0, -0.1]}>
        <sphereGeometry args={[0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh material={materials.accent} position={[0, 0, 0.02]}>
        <torusGeometry args={[0.47, 0.012, 8, 96]} />
      </mesh>
    </group>
  );
}

function Tweeter() {
  return (
    <group>
      <mesh material={materials.metal} position={[0, 0, 0.01]}>
        <torusGeometry args={[0.16, 0.025, 12, 48]} />
      </mesh>
      <mesh material={materials.dome} rotation={FACE_FORWARD}>
        <sphereGeometry args={[0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

export function SpeakerModel({
  colorway,
  explode,
  still = false,
}: {
  colorway: Colorway;
  /** 0 assembled → 1 fully separated. A ref so a scroll value can drive it without re-renders. */
  explode: React.RefObject<number>;
  /** Snap instead of easing (reduced motion). */
  still?: boolean;
}) {
  const baffle = useRef<THREE.Group>(null);
  const woofer = useRef<THREE.Group>(null);
  const tweeter = useRef<THREE.Group>(null);
  const feet = useRef<THREE.Group>(null);
  const eased = useRef(0);

  useFrame((_, delta) => {
    const rate = still ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 6);
    setColorway(colorway, rate);
    eased.current += (explode.current - eased.current) * rate;
    const e = eased.current;
    if (baffle.current) baffle.current.position.z = 0.6 + e * 0.4;
    if (woofer.current) woofer.current.position.z = 0.64 + e * 0.85;
    if (tweeter.current) tweeter.current.position.z = 0.64 + e * 1.05;
    if (feet.current) feet.current.position.y = -1.08 - e * 0.25;
  });

  return (
    <group>
      <RoundedBox args={[1.3, 2.1, 1.2]} radius={0.07} smoothness={4} material={materials.body} />

      <group ref={baffle} position={[0, 0, 0.6]}>
        <RoundedBox args={[1.18, 1.98, 0.04]} radius={0.015} smoothness={2} material={materials.baffle} />
        {/* Bass port: a dark slot under the woofer. */}
        <mesh material={materials.rubber} position={[0, -0.86, 0.022]}>
          <boxGeometry args={[0.62, 0.07, 0.01]} />
        </mesh>
      </group>

      <group ref={woofer} position={[0, -0.28, 0.64]}>
        <Woofer />
      </group>
      <group ref={tweeter} position={[0, 0.58, 0.64]}>
        <Tweeter />
      </group>

      <group ref={feet} position={[0, -1.08, 0]}>
        {[
          [-0.5, -0.45],
          [0.5, -0.45],
          [-0.5, 0.45],
          [0.5, 0.45],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} material={materials.metal} position={[x, 0, z]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
