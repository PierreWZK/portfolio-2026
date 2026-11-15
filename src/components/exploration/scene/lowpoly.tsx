import type { ReactNode } from "react";

// Briques du style low poly : peu de faces, et chaque face éclairée à plat (flatShading).
// C'est la lumière qui dessine les volumes : pas de texture, pas de lissage.

export type Vec3 = [number, number, number];

/** Matériau mat à facettes. */
export function Mat({ color, rough = 0.85, metal = 0 }: { color: string; rough?: number; metal?: number }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={metal} flatShading />;
}

type Common = { position?: Vec3; rotation?: Vec3; color: string; rough?: number; shadow?: boolean; children?: ReactNode };

/** Pavé. */
export function Box({ size, position, rotation, color, rough, shadow = true }: Common & { size: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      <Mat color={color} rough={rough} />
    </mesh>
  );
}

/** Prisme : cylindre à peu de côtés, rayons haut et bas différents pour un tronc de cône. */
export function Prism({
  top,
  bottom,
  height,
  sides = 6,
  position,
  rotation,
  color,
  rough,
  shadow = true,
}: Common & { top: number; bottom: number; height: number; sides?: number }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[top, bottom, height, sides]} />
      <Mat color={color} rough={rough} />
    </mesh>
  );
}

/** Bloc à facettes (icosaèdre) : feuillage, tête, cailloux. scale permet de l'aplatir ou de l'étirer. */
export function Gem({
  radius,
  detail = 0,
  scale,
  position,
  rotation,
  color,
  rough,
  shadow = true,
}: Common & { radius: number; detail?: number; scale?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow={shadow} receiveShadow>
      <icosahedronGeometry args={[radius, detail]} />
      <Mat color={color} rough={rough} />
    </mesh>
  );
}
