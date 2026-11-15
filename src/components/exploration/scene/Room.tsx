import { useMemo } from "react";
import * as THREE from "three";
import { C } from "./palette";

/** Vue derrière la fenêtre : ciel, étoiles, lune, montagnes. Dessinée en code. dawn : le jour se lève. */
function useWindowView(dawn: boolean) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 320;
    const c = canvas.getContext("2d")!;
    const sky = c.createLinearGradient(0, 0, 0, 320);
    sky.addColorStop(0, dawn ? "#3b4a78" : "#0b1020");
    sky.addColorStop(1, dawn ? "#e8a878" : "#27324d");
    c.fillStyle = sky;
    c.fillRect(0, 0, 256, 320);
    // Étoiles à positions fixes (pseudo-hasard stable).
    c.fillStyle = "#edeae3";
    for (let i = 0; i < (dawn ? 12 : 60); i++) {
      const x = (Math.sin(i * 127.1) * 43758.5453) % 1;
      const y = (Math.sin(i * 311.7) * 43758.5453) % 1;
      c.fillRect(Math.abs(x) * 256, Math.abs(y) * 200, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1);
    }
    c.fillStyle = "#d9c28f";
    c.beginPath();
    // Nuit : la lune en haut. Aube : le soleil qui pointe derrière les crêtes.
    c.arc(dawn ? 120 : 190, dawn ? 200 : 70, dawn ? 30 : 20, 0, Math.PI * 2);
    c.fill();
    const ridge = (color: string, base: number, peaks: [number, number][]) => {
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, 320);
      c.lineTo(0, base);
      for (const [x, y] of peaks) c.lineTo(x, y);
      c.lineTo(256, base);
      c.lineTo(256, 320);
      c.fill();
    };
    ridge("#1a2238", 230, [[50, 170], [95, 215], [150, 150], [205, 210], [240, 185]]);
    ridge("#0e1322", 270, [[30, 240], [80, 205], [130, 255], [180, 215], [230, 250]]);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [dawn]);
}

/** La pièce : sol, deux murs, plinthes, tapis, fenêtre sur le mur de gauche. */
export function Room({ dawn = false }: { dawn?: boolean }) {
  const view = useWindowView(dawn);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color={C.floor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, -1.4]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[1.5, 40]} />
        <meshStandardMaterial color={C.rug} roughness={1} />
      </mesh>

      {/* Mur du fond */}
      <mesh position={[0, 1.6, -3.05]} receiveShadow>
        <boxGeometry args={[6.2, 3.2, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>
      {/* Mur de gauche, en trois morceaux autour de la fenêtre */}
      <mesh position={[-3.05, 0.45, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.9, 6]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.05, 2.85, 0]}>
        <boxGeometry args={[0.1, 0.7, 6]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.05, 1.7, 1.45]}>
        <boxGeometry args={[0.1, 1.6, 3.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.05, 1.7, -2.3]}>
        <boxGeometry args={[0.1, 1.6, 1.4]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>

      {/* Plinthes */}
      <mesh position={[0, 0.06, -2.98]}>
        <boxGeometry args={[6, 0.12, 0.04]} />
        <meshStandardMaterial color={C.wallTrim} />
      </mesh>
      <mesh position={[-2.98, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.12, 6]} />
        <meshStandardMaterial color={C.wallTrim} />
      </mesh>

      {/* Fenêtre : la vue, le cadre, le croisillon */}
      <group position={[-3.05, 1.7, -0.85]}>
        <mesh position={[-0.06, 0, 0]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[1.5, 1.6]} />
          <meshBasicMaterial map={view} toneMapped={false} />
        </mesh>
        {[
          [0, 0.84, 0, 0.14, 0.08, 1.66],
          [0, -0.84, 0, 0.18, 0.08, 1.74],
          [0, 0, 0.79, 0.14, 1.6, 0.08],
          [0, 0, -0.79, 0.14, 1.6, 0.08],
          [0, 0, 0, 0.06, 1.6, 0.04],
          [0, 0, 0, 0.06, 0.04, 1.5],
        ].map(([x, y, z, w, h, d], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color={C.woodDark} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
