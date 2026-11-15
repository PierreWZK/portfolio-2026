import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useMotion } from "@/lib/motion";
import { C } from "./palette";
import { sameFocus, setFocus, setHint, useExploration, type Focus } from "./store";
import type { Vec3 } from "./layout";

// Objet cliquable. Au survol : lueur dorée, curseur « main », léger agrandissement, étiquette.
// Ouvert : la lueur reste. Seuls les objets survolés ou ouverts brillent : la scène ne sature pas.
// Le flottement (option `float`) reste discret et s'arrête si les animations sont coupées.

export function Hotspot({
  at,
  radius,
  focus,
  label,
  float = false,
  children,
}: {
  at: Vec3;
  radius: number;
  focus: Focus;
  label?: string;
  float?: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const { focus: current } = useExploration();
  const animated = useMotion();
  const active = sameFocus(current, focus);
  const lit = hover || active;

  useFrame(({ clock }) => {
    const g = group.current;
    const h = halo.current;
    if (!g || !h) return;
    const t = clock.elapsedTime;
    const k = animated ? 0.12 : 1;
    const scale = THREE.MathUtils.lerp(g.scale.x, lit ? 1.03 : 1, k);
    g.scale.setScalar(scale);
    g.position.y = at[1] + (float && animated ? Math.sin(t * 1.3 + at[0] * 3) * 0.012 : 0);
    const mat = h.material as THREE.MeshBasicMaterial;
    const target = lit ? 0.1 + (animated ? Math.sin(t * 2.2) * 0.025 : 0) : 0;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, k);
  });

  const hitOn = (on: boolean) => (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setHover(on);
    setHint(on && label ? label : null);
    document.body.style.cursor = on ? "pointer" : "";
  };

  return (
    <>
      {/* Le pivot est au centre de l'objet : l'agrandissement ne le déplace pas. */}
      <group ref={group} position={at}>
        <group position={[-at[0], -at[1], -at[2]]}>{children}</group>
      </group>
      <mesh
        ref={halo}
        position={at}
        renderOrder={2}
      >
        <sphereGeometry args={[radius * 1.25, 20, 14]} />
        <meshBasicMaterial
          color={C.gold}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh
        position={at}
        onPointerOver={hitOn(true)}
        onPointerOut={hitOn(false)}
        onClick={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "";
          setFocus(focus);
        }}
      >
        <sphereGeometry args={[radius, 12, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}
