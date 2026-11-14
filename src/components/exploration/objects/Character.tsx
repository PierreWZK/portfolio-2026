import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { C } from "../scene/palette";

/**
 * Personnage stylisé assis sur la chaise, face au bureau.
 * Animations légères, calculées par quelques sinus : respiration, tête qui bouge un peu,
 * regard qui passe de l'écran à la fenêtre, buste qui oscille. Aucune animation si `animated` est faux.
 * Pour le remplacer : garder la position du groupe et la hauteur d'assise (0,52 m).
 */
export function Character({ animated }: { animated: boolean }) {
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!animated || !torso.current || !head.current) return;
    const t = clock.elapsedTime;
    const breath = Math.sin(t * 1.6);
    torso.current.scale.set(1 + breath * 0.012, 1 + breath * 0.02, 1 + breath * 0.025);
    torso.current.rotation.z = Math.sin(t * 0.35) * 0.02;
    // Tous les ~12 s, la tête se tourne un instant vers la fenêtre (à gauche).
    const glance = Math.max(0, Math.sin(t * 0.52) - 0.82) * 5.5;
    head.current.rotation.y = Math.sin(t * 0.4) * 0.08 + glance * 0.75;
    head.current.rotation.x = Math.sin(t * 0.7) * 0.03 - 0.06;
  });

  const limb = (
    position: [number, number, number],
    rotation: [number, number, number],
    radius: number,
    length: number,
    color: string,
  ) => (
    <mesh position={position} rotation={rotation} castShadow>
      <capsuleGeometry args={[radius, length, 4, 10]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );

  return (
    <group position={[0, 0, -1.55]}>
      {/* Jambes : cuisses vers le bureau, tibias vers le sol, chaussures */}
      {[-0.11, 0.11].map((x) => (
        <group key={x}>
          {limb([x, 0.58, -0.2], [Math.PI / 2, 0, 0], 0.075, 0.34, C.trousers)}
          {limb([x, 0.32, -0.42], [0, 0, 0], 0.065, 0.36, C.trousers)}
          <mesh position={[x, 0.05, -0.47]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.22]} />
            <meshStandardMaterial color={C.metal} roughness={0.6} />
          </mesh>
        </group>
      ))}

      <group ref={torso} position={[0, 0.56, 0.02]}>
        {/* Buste */}
        <mesh position={[0, 0.33, 0]} castShadow>
          <capsuleGeometry args={[0.185, 0.34, 6, 14]} />
          <meshStandardMaterial color={C.sweater} roughness={0.9} />
        </mesh>
        {/* Bras : épaules vers le clavier */}
        {[-1, 1].map((side) => (
          <group key={side}>
            {limb([side * 0.23, 0.4, -0.1], [0.75, 0, side * 0.12], 0.06, 0.26, C.sweater)}
            {limb([side * 0.2, 0.26, -0.38], [1.45, 0, side * -0.25], 0.05, 0.26, C.sweater)}
            <mesh position={[side * 0.15, 0.25, -0.56]} castShadow>
              <sphereGeometry args={[0.055, 10, 10]} />
              <meshStandardMaterial color={C.skin} roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Cou */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 10]} />
          <meshStandardMaterial color={C.skin} roughness={0.8} />
        </mesh>
        {/* Tête : le pivot est à la base du cou */}
        <group ref={head} position={[0, 0.66, 0]}>
          <mesh position={[0, 0.16, 0]} castShadow>
            <sphereGeometry args={[0.165, 20, 16]} />
            <meshStandardMaterial color={C.skin} roughness={0.8} />
          </mesh>
          {/* Cheveux : calotte sur le haut et l'arrière du crâne */}
          <mesh position={[0, 0.18, 0.03]} rotation-x={0.55} castShadow>
            <sphereGeometry args={[0.175, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={C.hair} roughness={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
