import { useMemo } from "react";
import * as THREE from "three";
import { Box, Gem, Prism } from "./lowpoly";
import { C } from "./palette";

/** Vue derrière la fenêtre : ciel, étoiles, lune, montagnes anguleuses. Dessinée en code. dawn : le jour se lève. */
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
    ridge(dawn ? "#5a6390" : "#1a2238", 230, [[50, 170], [95, 215], [150, 150], [205, 210], [240, 185]]);
    ridge(dawn ? "#2c3458" : "#0e1322", 270, [[30, 240], [80, 205], [130, 255], [180, 215], [230, 250]]);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [dawn]);
}

/** Grande plante en pot, au sol : feuilles en cônes aplatis, toutes différentes. */
function FloorPlant() {
  const leaves: [number, number, number, number][] = [
    [0, 0.95, 0, 0.5],
    [0.14, 0.78, 0.06, 0.42],
    [-0.13, 0.82, -0.05, 0.44],
    [0.05, 0.7, -0.15, 0.36],
    [-0.06, 0.66, 0.15, 0.34],
  ];
  return (
    <group position={[-2.35, 0, -2.3]}>
      <Prism top={0.2} bottom={0.14} height={0.34} sides={7} position={[0, 0.17, 0]} color={C.pot} />
      <Prism top={0.215} bottom={0.2} height={0.05} sides={7} position={[0, 0.345, 0]} color={C.pot} />
      {leaves.map(([x, y, z, h], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[z * 2.2, i * 1.3, -x * 2.2]} castShadow>
          <coneGeometry args={[0.13, h, 4]} />
          <meshStandardMaterial color={i % 2 ? C.plantDark : C.plant} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** La pièce : parquet, tapis, deux murs à soubassement, fenêtre avec rideaux, plante. */
export function Room({ dawn = false }: { dawn?: boolean }) {
  const view = useWindowView(dawn);
  const planks = Array.from({ length: 8 }, (_, i) => i);
  return (
    <group>
      {/* Parquet : huit lames, deux tons, hauteurs très légèrement différentes */}
      {planks.map((i) => (
        <Box
          key={i}
          size={[0.75, 0.06, 6]}
          position={[-2.625 + i * 0.75, -0.03 - (i % 3) * 0.004, 0]}
          color={i % 2 ? C.floorB : C.floorA}
          shadow={false}
        />
      ))}
      {/* Tapis à dix côtés, avec sa bordure */}
      <Prism top={1.55} bottom={1.55} height={0.02} sides={10} position={[0, 0.011, -1.4]} color={C.rugBorder} shadow={false} />
      <Prism top={1.38} bottom={1.38} height={0.02} sides={10} position={[0, 0.021, -1.4]} color={C.rug} shadow={false} />

      {/* Mur du fond : soubassement sombre, cimaise, mur clair */}
      <Box size={[6.2, 0.9, 0.1]} position={[0, 0.45, -3.05]} color={C.wainscot} shadow={false} />
      <Box size={[6.2, 2.3, 0.1]} position={[0, 2.05, -3.05]} color={C.wall} shadow={false} />
      <Box size={[6, 0.05, 0.05]} position={[0, 0.92, -2.985]} color={C.wallTrim} />
      <Box size={[6, 0.1, 0.04]} position={[0, 0.05, -2.98]} color={C.wallTrim} />

      {/* Mur de gauche, en morceaux autour de la fenêtre */}
      <Box size={[0.1, 0.9, 6]} position={[-3.05, 0.45, 0]} color={C.wainscot} shadow={false} />
      <Box size={[0.1, 0.7, 6]} position={[-3.05, 2.85, 0]} color={C.wall} shadow={false} />
      <Box size={[0.1, 1.6, 3.1]} position={[-3.05, 1.7, 1.45]} color={C.wall} shadow={false} />
      <Box size={[0.1, 1.6, 1.4]} position={[-3.05, 1.7, -2.3]} color={C.wall} shadow={false} />
      <Box size={[0.05, 0.05, 6]} position={[-2.985, 0.92, 0]} color={C.wallTrim} />
      <Box size={[0.04, 0.1, 6]} position={[-2.98, 0.05, 0]} color={C.wallTrim} />

      {/* Fenêtre : la vue, le cadre, le croisillon, l'appui */}
      <group position={[-3.05, 1.7, -0.85]}>
        <mesh position={[-0.06, 0, 0]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[1.5, 1.6]} />
          <meshBasicMaterial map={view} toneMapped={false} />
        </mesh>
        <Box size={[0.14, 0.08, 1.66]} position={[0, 0.84, 0]} color={C.woodDark} />
        <Box size={[0.14, 1.6, 0.08]} position={[0, 0, 0.79]} color={C.woodDark} />
        <Box size={[0.14, 1.6, 0.08]} position={[0, 0, -0.79]} color={C.woodDark} />
        <Box size={[0.06, 1.6, 0.04]} position={[0, 0, 0]} color={C.woodDark} />
        <Box size={[0.06, 0.04, 1.5]} position={[0, 0, 0]} color={C.woodDark} />
        <Box size={[0.26, 0.06, 1.86]} position={[0.07, -0.85, 0]} color={C.wood} />
        {/* Tringle et rideaux : trois plis de chaque côté */}
        <Prism top={0.018} bottom={0.018} height={2.3} sides={6} position={[0.14, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} color={C.metal} />
        {[-1, 1].map((side) =>
          [0, 1, 2].map((fold) => (
            <Prism
              key={`${side}${fold}`}
              top={0.07}
              bottom={0.085}
              height={1.95}
              sides={5}
              position={[0.14, -0.02, side * (0.86 + fold * 0.1)]}
              rotation={[0, fold * 0.7, 0]}
              color={C.curtain}
              rough={1}
            />
          )),
        )}
      </group>

      <FloorPlant />
      {/* Petit caillou décoratif dans le pot, pour casser la symétrie */}
      <Gem radius={0.05} position={[-2.27, 0.39, -2.22]} color={C.metalLight} />
    </group>
  );
}
