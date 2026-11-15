import { useMemo } from "react";
import * as THREE from "three";
import { deskBooks } from "@/content";
import { Box, Prism } from "../scene/lowpoly";
import { BOOK_COLORS, C } from "../scene/palette";

// Petits objets posés sur le bureau : décor, non cliquables.
// La pile de livres vient des données (src/content/desk.ts) : titre sur le dos, modifiable librement.

/** Dos d'un livre : titre et auteur dessinés sur un canvas, dans la police ASCII du site. */
function useSpineTexture(title: string, author: string | undefined, color: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 72;
    const c = canvas.getContext("2d")!;
    c.fillStyle = color;
    c.fillRect(0, 0, 512, 72);
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-ascii") || "monospace";
    const label = title.toUpperCase();
    c.fillStyle = "#f3e7c9";
    c.textBaseline = "middle";
    // Le titre rétrécit s'il est long, pour tenir sur le dos.
    let size = 30;
    c.font = `700 ${size}px ${family}, monospace`;
    while (c.measureText(label).width > (author ? 320 : 470) && size > 14) {
      size -= 2;
      c.font = `700 ${size}px ${family}, monospace`;
    }
    c.fillText(label, 20, 38);
    if (author) {
      c.font = `400 16px ${family}, monospace`;
      c.textAlign = "right";
      c.fillText(author, 494, 39);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, [title, author, color]);
}

function StackedBook({ index, title, author }: { index: number; title: string; author?: string }) {
  const color = BOOK_COLORS[(index + 1) % BOOK_COLORS.length];
  const spine = useSpineTexture(title, author, color);
  const thick = 0.042;
  const width = 0.3 - (index % 2) * 0.02;
  // Chaque livre est un peu tourné par rapport au précédent : une pile vivante, pas un bloc.
  const turn = [0.06, -0.09, 0.04, -0.05, 0.08][index % 5];
  return (
    <group position={[0, thick / 2 + index * thick, 0]} rotation-y={turn}>
      <Box size={[width, thick, 0.2]} color={color} />
      {/* Tranche des pages, visible sur les côtés */}
      <Box size={[width + 0.002, thick - 0.012, 0.19]} position={[0, 0, -0.008]} color={C.paper} shadow={false} />
      <mesh position={[0, 0, 0.1005]}>
        <planeGeometry args={[width, thick]} />
        <meshBasicMaterial map={spine} toneMapped={false} />
      </mesh>
    </group>
  );
}

const PENS: [number, number, number, string][] = [
  [0.012, 0.14, 0.01, C.gold],
  [-0.015, 0.13, -0.006, C.metalLight],
  [0.002, 0.15, -0.016, C.plant],
];

export function DeskItems() {
  return (
    <group>
      {/* Pile de livres, à droite de l'écran, dos tournés vers la pièce */}
      <group position={[0.84, 0.79, -2.5]} rotation-y={-0.12}>
        {deskBooks.slice(0, 5).map((book, i) => (
          <StackedBook key={book.title} index={i} title={book.title} author={book.author} />
        ))}
      </group>

      {/* Tasse à huit pans, avec son anse et son café */}
      <group position={[0.62, 0.79, -2.17]}>
        <Prism top={0.045} bottom={0.036} height={0.09} sides={8} position={[0, 0.045, 0]} color={C.mug} rough={0.5} />
        <Prism top={0.038} bottom={0.038} height={0.004} sides={8} position={[0, 0.089, 0]} color="#3a2418" shadow={false} />
        <mesh position={[0.052, 0.047, 0]} castShadow>
          <torusGeometry args={[0.024, 0.008, 4, 6]} />
          <meshStandardMaterial color={C.mug} roughness={0.5} flatShading />
        </mesh>
      </group>

      {/* Pot à crayons */}
      <group position={[-0.62, 0.79, -2.72]}>
        <Prism top={0.045} bottom={0.04} height={0.1} sides={6} position={[0, 0.05, 0]} color={C.pot} />
        {PENS.map(([x, h, z, color], i) => (
          <Prism
            key={i}
            top={0.006}
            bottom={0.006}
            height={h}
            sides={5}
            position={[x, 0.05 + h / 2, z]}
            rotation={[z * 6, 0, x * -8]}
            color={color}
            shadow={false}
          />
        ))}
      </group>

      {/* Carnet ouvert et son crayon */}
      <group position={[-0.36, 0.79, -2.5]} rotation-y={0.3}>
        <Box size={[0.26, 0.012, 0.18]} position={[0, 0.006, 0]} color={C.woodDark} />
        <Box size={[0.12, 0.006, 0.17]} position={[-0.062, 0.015, 0]} rotation={[0, 0, 0.04]} color={C.paper} shadow={false} />
        <Box size={[0.12, 0.006, 0.17]} position={[0.062, 0.015, 0]} rotation={[0, 0, -0.04]} color={C.paper} shadow={false} />
        <Prism
          top={0.005}
          bottom={0.005}
          height={0.15}
          sides={5}
          position={[0.07, 0.024, 0.01]}
          rotation={[Math.PI / 2, 0, 0.5]}
          color={C.gold}
          shadow={false}
        />
      </group>
    </group>
  );
}
