"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import type { SceneQuality } from "@/lib/sceneTier";
import { SpeakerModel, type Colorway } from "@/components/scene/speaker/SpeakerModel";
import { Studio } from "@/components/scene/speaker/Studio";

/** The scripted camera move: from behind-left and high, round to a front three-quarter. */
const TOUR_SECONDS = 2.8;
const TOUR_FROM = { theta: -2.4, radius: 7.5, y: 3.2 };
const TOUR_TO = { theta: 0.6, radius: 5.4, y: 0.9 };

/** The site's entrance ease, [0.16, 1, 0.3, 1], as a closed form close enough for a camera. */
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function CameraTour({
  tour,
  still,
  onReady,
}: {
  tour: number;
  still: boolean;
  onReady: () => void;
}) {
  const { camera } = useThree();
  const started = useRef<number | null>(null);
  const ready = useRef(false);

  // Each new `tour` value restarts the move.
  useEffect(() => {
    started.current = null;
  }, [tour]);

  useFrame((state) => {
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    // OrbitControls registers itself on the R3F state via makeDefault.
    const c = state.controls as OrbitControlsImpl | null;
    if (still) {
      const { theta, radius, y } = TOUR_TO;
      camera.position.set(Math.sin(theta) * radius, y, Math.cos(theta) * radius);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (started.current === null) started.current = state.clock.elapsedTime;
    const t = (state.clock.elapsedTime - started.current) / TOUR_SECONDS;
    if (t > 1) {
      if (c && !c.enabled) c.enabled = true;
      return;
    }
    if (c) c.enabled = false;
    const k = easeOutExpo(Math.min(t, 1));
    const theta = THREE.MathUtils.lerp(TOUR_FROM.theta, TOUR_TO.theta, k);
    const radius = THREE.MathUtils.lerp(TOUR_FROM.radius, TOUR_TO.radius, k);
    const y = THREE.MathUtils.lerp(TOUR_FROM.y, TOUR_TO.y, k);
    camera.position.set(Math.sin(theta) * radius, y, Math.cos(theta) * radius);
    camera.lookAt(0, 0, 0);
    if (c) {
      c.target.set(0, 0, 0);
      c.update();
    }
  });

  return null;
}

/** Under frameloop="demand", asks for a frame whenever the visible state changes. */
function Invalidate({ deps }: { deps: unknown[] }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    // A handful of frames, so the eased values (instant when still) settle.
    invalidate(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return null;
}

/** Mounted by Configurator.tsx once it has picked a tier. */
export default function ConfiguratorScene({
  quality,
  colorway,
  exploded,
  tour,
  onReady,
}: {
  quality: SceneQuality;
  colorway: Colorway;
  exploded: boolean;
  tour: number;
  onReady: () => void;
}) {
  const explode = useRef(0);
  const still = quality === "still";

  useEffect(() => {
    explode.current = exploded ? 1 : 0;
  }, [exploded]);

  return (
    <Canvas
      dpr={quality === "lite" ? [1, 1.25] : [1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 32, position: [0, 1, 6], near: 0.1, far: 50 }}
      // Under reduced motion it renders when something changes, not every frame.
      frameloop={still ? "demand" : "always"}
    >
      <Studio />
      <SpeakerModel colorway={colorway} explode={explode} still={still} />
      <OrbitControls
        makeDefault
        enableDamping
        enablePan={false}
        // No zoom: on a phone, a pinch should scroll the page, not trap it.
        enableZoom={false}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.55}
        enabled={!still}
      />
      <CameraTour tour={tour} still={still} onReady={onReady} />
      {still ? <Invalidate deps={[colorway, exploded]} /> : null}
    </Canvas>
  );
}
