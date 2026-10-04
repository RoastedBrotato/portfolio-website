"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import type { SceneQuality } from "@/lib/sceneTier";
import { SpeakerModel, type Colorway } from "@/components/scene/speaker/SpeakerModel";
import { Studio } from "@/components/scene/speaker/Studio";

/*
 * The launch page's pinned sequence. Scroll is the timeline: the visitor's
 * progress through the pinned section (0 → 1) drives the turn, the exploded
 * view and the camera, so nothing moves unless they move it.
 *
 *   0.00–0.25  turn it    the speaker spins three quarters round
 *   0.25–0.55  open it    the parts separate along the depth axis
 *   0.55–0.80  colour it  the colourway is switched by the page, per step
 *   0.80–1.00  hear it    settles square-on and the camera comes closer
 */

const smooth = (from: number, to: number, x: number) => THREE.MathUtils.smoothstep(x, from, to);

/** Resting angle: a three-quarter view, the way product shots are framed. */
const THREE_QUARTER = -0.6;

function Rig({
  progress,
  colorway,
  still,
  onReady,
}: {
  progress: MotionValue<number>;
  colorway: Colorway;
  still: boolean;
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const explode = useRef(0);
  const eased = useRef(0);
  const ready = useRef(false);
  const { camera, size } = useThree();

  useFrame((_, delta) => {
    const raw = progress.get();
    // A little smoothing on top of Lenis, so a wheel tick never steps the model.
    eased.current = still
      ? raw
      : eased.current + (raw - eased.current) * (1 - Math.exp(-Math.min(delta, 0.05) * 8));
    const p = eased.current;

    // One full turn over the first quarter, landing back on the three-quarter
    // view so the exploded drivers face the camera; then square-on for the
    // last step. One continuous angle, so it never snaps.
    const turned = THREE_QUARTER + smooth(0, 0.25, p) * Math.PI * 2;
    const settle = smooth(0.8, 1, p);
    if (group.current) group.current.rotation.y = THREE.MathUtils.lerp(turned, Math.PI * 2, settle);

    explode.current = smooth(0.28, 0.45, p) * (1 - smooth(0.52, 0.62, p));

    // On a wide screen the captions own the left, so the model sits right of
    // centre; on a phone it stays centred above them.
    const offset = size.width > size.height ? -1.1 : 0;
    const lift = size.width > size.height ? 0 : -0.5;
    camera.position.set(offset, 0.6 - settle * 0.4 + lift, 7.6 - settle * 1.2);
    camera.lookAt(offset, lift, 0);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <group ref={group}>
      <SpeakerModel colorway={colorway} explode={explode} still={still} />
    </group>
  );
}

/** Under frameloop="demand" (reduced motion), render when scroll or colour changes. */
function InvalidateOn({ progress, colorway }: { progress: MotionValue<number>; colorway: Colorway }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => progress.on("change", () => invalidate()), [progress, invalidate]);
  useEffect(() => invalidate(2), [colorway, invalidate]);
  return null;
}

export default function LaunchScene({
  quality,
  progress,
  colorway,
  active,
  onReady,
}: {
  quality: SceneQuality;
  progress: MotionValue<number>;
  colorway: Colorway;
  /** False while the pinned section is off screen: the loop stops. */
  active: boolean;
  onReady: () => void;
}) {
  const still = quality === "still";

  return (
    <Canvas
      dpr={quality === "lite" ? [1, 1.25] : [1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 30, position: [0, 0.6, 7.6], near: 0.1, far: 50 }}
      frameloop={still ? "demand" : active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <Studio />
      <Rig progress={progress} colorway={colorway} still={still} onReady={onReady} />
      {still ? <InvalidateOn progress={progress} colorway={colorway} /> : null}
    </Canvas>
  );
}
