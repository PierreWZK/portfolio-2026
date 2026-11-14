import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BOOK_COLORS, C, NOTE_COLORS } from "../scene/palette";

// Meubles et objets de la pièce, tous en formes simples écrites en code.
// Les quantités (livres, cadres, post-it) viennent des données du portfolio.

type Vec3 = [number, number, number];

function Box({ size, position, color, rough = 0.8 }: { size: Vec3; position: Vec3; color: string; rough?: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={rough} />
    </mesh>
  );
}

/** Bureau contre le mur du fond. Le plateau est à 0,79 m. */
export function Desk() {
  return (
    <group position={[0, 0, -2.45]}>
      <Box size={[2.3, 0.08, 0.95]} position={[0, 0.75, 0]} color={C.wood} rough={0.6} />
      {[
        [-1.05, -0.38],
        [1.05, -0.38],
        [-1.05, 0.38],
        [1.05, 0.38],
      ].map(([x, z], i) => (
        <Box key={i} size={[0.08, 0.71, 0.08]} position={[x, 0.355, z]} color={C.woodDark} />
      ))}
      <Box size={[0.6, 0.3, 0.8]} position={[0.78, 0.55, 0]} color={C.woodDark} />
    </group>
  );
}

/** Texte affiché sur l'écran au repos, dessiné sur un canvas. */
function useScreenTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#0c0c0e";
    c.fillRect(0, 0, 512, 320);
    c.font = "bold 26px monospace";
    c.fillStyle = "#d9c28f";
    c.fillText("> WELCOME TO", 36, 110);
    c.fillText("  MY WORKSPACE_", 36, 150);
    c.font = "16px monospace";
    c.fillStyle = "#a09c92";
    c.fillText("$ ls ~/projets", 36, 210);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/** Ordinateur : écran, pied, clavier, souris. */
export function Computer() {
  const screen = useScreenTexture();
  return (
    <group position={[0, 0.79, -2.6]}>
      <Box size={[0.3, 0.02, 0.2]} position={[0, 0.01, 0]} color={C.metal} rough={0.4} />
      <Box size={[0.05, 0.22, 0.04]} position={[0, 0.12, -0.02]} color={C.metal} rough={0.4} />
      <Box size={[1.0, 0.62, 0.04]} position={[0, 0.5, 0]} color={C.metal} rough={0.4} />
      <mesh position={[0, 0.5, 0.022]}>
        <planeGeometry args={[0.94, 0.56]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <Box size={[0.5, 0.02, 0.16]} position={[0, 0.01, 0.4]} color={C.metal} rough={0.5} />
      <Box size={[0.07, 0.025, 0.11]} position={[0.42, 0.012, 0.4]} color={C.metal} rough={0.5} />
    </group>
  );
}

/** Téléphone posé à plat sur le bureau. */
export function Phone() {
  return (
    <group position={[-0.55, 0.79, -2.2]} rotation-y={0.35}>
      <Box size={[0.09, 0.012, 0.18]} position={[0, 0.006, 0]} color={C.metal} rough={0.3} />
      <mesh position={[0, 0.0125, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.078, 0.165]} />
        <meshStandardMaterial color={C.screen} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Lampe de bureau : pied, bras, abat-jour, ampoule et sa lumière chaude. */
export function Lamp() {
  return (
    <group position={[-0.92, 0.79, -2.62]}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.03, 20]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 8]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} />
      </mesh>
      <mesh position={[0.07, 0.46, 0.06]} rotation={[0.5, 0, -0.5]} castShadow>
        <coneGeometry args={[0.13, 0.17, 20, 1, true]} />
        <meshStandardMaterial color={C.gold} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.09, 0.42, 0.08]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={C.lampLight} toneMapped={false} />
      </mesh>
      <pointLight position={[0.12, 0.4, 0.14]} color={C.lampLight} intensity={5} distance={5} decay={1.5} />
    </group>
  );
}

/** Étagères à droite du bureau. Un livre par formation, plus quelques livres de décor. */
export function Shelves({ books }: { books: number }) {
  const extras = 5;
  return (
    <group position={[2.15, 0, -2.86]}>
      {[1.25, 1.8].map((y) => (
        <Box key={y} size={[1.4, 0.04, 0.26]} position={[0, y, 0]} color={C.wood} rough={0.6} />
      ))}
      {Array.from({ length: books }, (_, i) => {
        const h = 0.3 + (i % 3) * 0.03;
        return (
          <Box
            key={`f${i}`}
            size={[0.075, h, 0.2]}
            position={[-0.55 + i * 0.095, 1.82 + h / 2, 0]}
            color={BOOK_COLORS[i % BOOK_COLORS.length]}
          />
        );
      })}
      {Array.from({ length: extras }, (_, i) => {
        const h = 0.24 + (i % 2) * 0.05;
        return (
          <Box
            key={`d${i}`}
            size={[0.06, h, 0.19]}
            position={[0.1 + i * 0.08, 1.27 + h / 2, 0]}
            color={BOOK_COLORS[(i + 3) % BOOK_COLORS.length]}
          />
        );
      })}
      {/* Plante en pot */}
      <mesh position={[-0.45, 1.34, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.055, 0.14, 12]} />
        <meshStandardMaterial color={C.paper} roughness={0.7} />
      </mesh>
      <mesh position={[-0.45, 1.52, 0]} castShadow>
        <icosahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color={C.plant} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

/** Cadres accrochés : un par réalisation, répartis entre le mur du fond et le mur de gauche. */
export function Frames({ count }: { count: number }) {
  const spots: { position: Vec3; rotationY: number; size: [number, number] }[] = [
    { position: [-1.75, 2.0, -2.98], rotationY: 0, size: [0.5, 0.65] },
    { position: [-2.45, 1.75, -2.98], rotationY: 0, size: [0.4, 0.4] },
    { position: [-2.98, 1.9, 0.75], rotationY: Math.PI / 2, size: [0.6, 0.45] },
    { position: [-2.98, 1.8, 1.65], rotationY: Math.PI / 2, size: [0.45, 0.6] },
    { position: [-2.98, 1.75, 2.4], rotationY: Math.PI / 2, size: [0.4, 0.4] },
    { position: [1.0, 2.35, -2.98], rotationY: 0, size: [0.45, 0.35] },
  ];
  return (
    <group>
      {spots.slice(0, count).map((s, i) => (
        <group key={i} position={s.position} rotation-y={s.rotationY}>
          <mesh castShadow>
            <boxGeometry args={[s.size[0] + 0.06, s.size[1] + 0.06, 0.04]} />
            <meshStandardMaterial color={C.woodDark} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.021]}>
            <planeGeometry args={s.size} />
            <meshStandardMaterial color={i % 2 ? C.paper : C.gold} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Post-it collés au mur à gauche de l'écran : un par catégorie de compétences. */
export function PostIts({ count }: { count: number }) {
  return (
    <group position={[-0.95, 1.5, -2.985]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[(i % 3) * 0.17, -Math.floor(i / 3) * 0.17, 0]}
          rotation-z={((i * 37) % 11) / 60 - 0.09}
        >
          <planeGeometry args={[0.14, 0.14]} />
          <meshStandardMaterial color={NOTE_COLORS[i % NOTE_COLORS.length]} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Horloge murale à l'heure réelle. */
export function Clock({ animated }: { animated: boolean }) {
  const hours = useRef<THREE.Group>(null);
  const minutes = useRef<THREE.Group>(null);
  const seconds = useRef<THREE.Group>(null);

  const setHands = () => {
    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (hours.current) hours.current.rotation.z = -(h / 12) * Math.PI * 2;
    if (minutes.current) minutes.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (seconds.current) seconds.current.rotation.z = -(s / 60) * Math.PI * 2;
  };
  // Animations coupées : l'heure est posée une fois, à l'affichage.
  useFrame(() => {
    if (animated || (hours.current && hours.current.userData.set !== true)) {
      setHands();
      if (hours.current) hours.current.userData.set = true;
    }
  });

  const hand = (length: number, width: number, color: string) => (
    <mesh position={[0, length / 2, 0]}>
      <boxGeometry args={[width, length, 0.01]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
  return (
    <group position={[2.15, 2.5, -2.97]}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <circleGeometry args={[0.23, 32]} />
        <meshStandardMaterial color={C.paper} roughness={0.9} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[Math.sin((i / 12) * Math.PI * 2) * 0.2, Math.cos((i / 12) * Math.PI * 2) * 0.2, 0.025]}>
          <circleGeometry args={[i % 3 === 0 ? 0.014 : 0.007, 8]} />
          <meshStandardMaterial color={C.metal} />
        </mesh>
      ))}
      <group ref={hours} position={[0, 0, 0.03]}>{hand(0.11, 0.018, C.metal)}</group>
      <group ref={minutes} position={[0, 0, 0.035]}>{hand(0.17, 0.012, C.metal)}</group>
      <group ref={seconds} position={[0, 0, 0.04]}>{hand(0.19, 0.005, "#a8853f")}</group>
    </group>
  );
}

/** Chaise de bureau, tournée vers le bureau. */
export function Chair() {
  return (
    <group position={[0, 0, -1.55]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.04, 5]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.42, 10]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} />
      </mesh>
      <Box size={[0.52, 0.08, 0.5]} position={[0, 0.48, 0]} color={C.woodDark} />
      <Box size={[0.5, 0.6, 0.07]} position={[0, 0.86, 0.26]} color={C.woodDark} />
    </group>
  );
}
