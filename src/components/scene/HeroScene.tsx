"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneQuality } from "@/lib/sceneTier";

/*
 * The hero scene: the site's 48px grid taken literally. A field of black slabs
 * on a plane, lit by one red light that follows the pointer. Slabs near the
 * light rise and catch it on their edges; as the page scrolls, the field tilts
 * and the camera pulls back, so the headline turns out to have been sitting on
 * a surface.
 *
 * Budget, per the audit (6.1): one instanced mesh, one material, one draw call
 * for the whole field; one point light plus two cheap fills; no
 * post-processing; fog instead of extra geometry to lose the field's edges.
 */

const FIELD: Record<SceneQuality, { cols: number; rows: number }> = {
  full: { cols: 34, rows: 22 },
  lite: { cols: 26, rows: 18 },
  still: { cols: 34, rows: 22 },
};

/** How far the light's lift reaches, in cells. */
const REACH = 3.2;
/** Height a slab under the light rises to, in cells. */
const LIFT = 0.55;
const SLAB_HEIGHT = 0.4;

const BASE = new THREE.Color("#121212");
const ORIGIN = new THREE.Vector3(0, 0, 0);
const HOT = new THREE.Color("#3d0904");

export type SceneInputs = {
  /** Pointer in normalised device coordinates over the hero; null when it isn't there. */
  pointer: { x: number; y: number } | null;
  /** 0 at the top of the page, 1 when the hero has scrolled its own height. */
  scroll: number;
};

function makeScratch(count: number, cols: number, still: boolean) {
  return {
    object: new THREE.Object3D(),
    color: new THREE.Color(),
    ray: new THREE.Raycaster(),
    ndc: new THREE.Vector2(),
    plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    hit: new THREE.Vector3(),
    target: new THREE.Vector3(),
    // Under reduced motion the light is placed once, right of the headline.
    lightAt: new THREE.Vector3(still ? cols * 0.18 : 0, 0, still ? -1.5 : 0),
    heights: new Float32Array(count),
  };
}

function Field({
  quality,
  inputs,
  onReady,
}: {
  quality: SceneQuality;
  inputs: React.RefObject<SceneInputs>;
  onReady: () => void;
}) {
  const { cols, rows } = FIELD[quality];
  const count = cols * rows;
  const still = quality === "still";

  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const group = useRef<THREE.Group>(null);
  const ready = useRef(false);
  const { camera } = useThree();

  // Per-frame working objects, created on the first frame and mutated in place
  // (a ref, not useMemo: render-time values must not be mutated).
  const scratch = useRef<ReturnType<typeof makeScratch> | null>(null);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m || !light.current || !group.current) return;
    const s = (scratch.current ??= makeScratch(count, cols, still));
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const input = inputs.current;

    // Where the light wants to be: under the pointer, or on a slow figure-of-
    // eight when there's no pointer (touch, or the cursor is elsewhere), so
    // the field still reads as alive on a phone.
    if (!still) {
      if (input.pointer) {
        s.ndc.set(input.pointer.x, input.pointer.y);
        s.ray.setFromCamera(s.ndc, camera);
        if (s.ray.ray.intersectPlane(s.plane, s.hit)) {
          // Into the field's own space, which tilts with scroll.
          group.current.worldToLocal(s.target.copy(s.hit));
        }
      } else {
        // Sized to what's actually on screen, so on a narrow phone the light
        // stays in view instead of wandering off the sides.
        const view = state.viewport.getCurrentViewport(camera, ORIGIN);
        const ax = Math.min(cols * 0.22, view.width * 0.32);
        const az = Math.min(rows * 0.18, view.height * 0.22);
        s.target.set(Math.sin(t * 0.32) * ax, 0, Math.sin(t * 0.54) * az - az * 0.4);
      }
      s.lightAt.lerp(s.target, 1 - Math.exp(-dt * 5));
    }
    light.current.position.set(s.lightAt.x, 1.6, s.lightAt.z);

    for (let i = 0; i < count; i++) {
      const x = (i % cols) - (cols - 1) / 2;
      const z = Math.floor(i / cols) - (rows - 1) / 2;
      const d = Math.hypot(x - s.lightAt.x, z - s.lightAt.z);
      const falloff = Math.max(0, 1 - d / REACH);
      const want = falloff * falloff * LIFT;
      const h = s.heights[i];
      // Rise quickly, settle slowly — it reads as mass, not as a hover state.
      const rate = still ? 1 : 1 - Math.exp(-dt * (want > h ? 9 : 2.2));
      const next = h + (want - h) * rate;
      s.heights[i] = next;

      s.object.position.set(x, next - SLAB_HEIGHT / 2, z);
      s.object.updateMatrix();
      m.setMatrixAt(i, s.object.matrix);
      m.setColorAt(i, s.color.copy(BASE).lerp(HOT, Math.min(1, next / LIFT)));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    // Scroll: tilt the field away and pull the camera back and up.
    const p = Math.min(input.scroll, 1.6);
    group.current.rotation.x = p * 0.32;
    camera.position.set(0, 9 + p * 5, 7.5 + p * 6);
    camera.lookAt(0, 0, 0.6);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[0.92, SLAB_HEIGHT, 0.92]} />
        <meshStandardMaterial color="#ffffff" roughness={0.55} metalness={0.25} />
      </instancedMesh>
      <pointLight ref={light} color="#ff2b1f" intensity={28} distance={9} decay={1.6} />
    </group>
  );
}

/**
 * Mounted by HeroBackdrop once it has picked a tier. Fills its parent; the
 * pointer is read from the parent (the hero section) rather than the canvas,
 * which stays pointer-events: none so it never sits between a visitor and the
 * buttons.
 */
export default function HeroScene({
  quality,
  onReady,
}: {
  quality: SceneQuality;
  onReady: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inputs = useRef<SceneInputs>({ pointer: null, scroll: 0 });
  const [onScreen, setOnScreen] = useState(true);
  const still = quality === "still";

  useEffect(() => {
    const el = wrapper.current;
    const host = el?.closest("section") ?? el?.parentElement;
    if (!el || !host) return;

    function onMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const rect = host!.getBoundingClientRect();
      inputs.current.pointer = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      };
    }
    function onLeave() {
      inputs.current.pointer = null;
    }
    function onScroll() {
      // The hero is the first thing on the page, so its own height is the
      // scale; it keeps counting while the next section slides over it.
      inputs.current.scroll = window.scrollY / Math.max(host!.offsetHeight, 1);
    }

    // Off screen, the render loop stops entirely.
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);

    onScroll();
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        // Lite renders under native resolution; the slabs are flat-shaded
        // enough that nobody sees it, and it halves the fill cost.
        dpr={quality === "lite" ? [0.75, 1] : [1, 1.75]}
        gl={{ antialias: quality !== "lite", alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 40, position: [0, 9, 7.5], near: 0.1, far: 60 }}
        frameloop={still ? "demand" : onScreen ? "always" : "never"}
        style={{ pointerEvents: "none" }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog("#000000", 11, 26);
        }}
      >
        <hemisphereLight args={["#8a9bb0", "#000000", 0.3]} />
        <directionalLight position={[-6, 8, -10]} intensity={0.35} color="#8a9bb0" />
        <Field quality={quality} inputs={inputs} onReady={onReady} />
      </Canvas>
    </div>
  );
}
