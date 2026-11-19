import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { Box, Gem, Prism } from "../scene/lowpoly";
import { C } from "../scene/palette";

// Objets personnels, décor non cliquable : un Rubik's cube et une plante sur le bureau, un chien sur le tapis.

const CUBE_COLORS = ["#c8473b", "#e8e4da", "#3f6fb0", "#e8a33c", "#4d8f55", "#e0c64a"];

/** Rubik's cube 3 × 3, un peu mélangé : les trois faces visibles portent leurs neuf carrés. */
function RubiksCube() {
  const size = 0.066;
  const cell = size / 3;
  const half = size / 2 + 0.001;
  const faces: { rot: [number, number, number]; pos: (a: number, b: number) => [number, number, number] }[] = [
    { rot: [-Math.PI / 2, 0, 0], pos: (a, b) => [a, half, b] }, // dessus
    { rot: [0, 0, 0], pos: (a, b) => [a, b, half] }, // face
    { rot: [0, Math.PI / 2, 0], pos: (a, b) => [half, b, a] }, // côté droit
  ];
  return (
    <group position={[0.98, 0.79 + size / 2, -2.1]} rotation-y={0.55}>
      <Box size={[size, size, size]} color="#18181b" rough={0.5} />
      {faces.map((face, f) =>
        [-1, 0, 1].flatMap((i) =>
          [-1, 0, 1].map((j) => (
            <mesh key={`${f}-${i}-${j}`} position={face.pos(i * cell, j * cell)} rotation={face.rot}>
              <planeGeometry args={[cell * 0.84, cell * 0.84]} />
              <meshStandardMaterial color={CUBE_COLORS[(f * 4 + i * 3 + j * 5 + 9) % 6]} roughness={0.45} flatShading />
            </mesh>
          )),
        ),
      )}
    </group>
  );
}

/** Petite plante grasse en pot, dans le coin du bureau. */
function DeskPlant() {
  const leaves = [0, 1, 2, 3, 4, 5, 6];
  return (
    <group position={[1.02, 0.79, -2.78]}>
      <Prism top={0.05} bottom={0.038} height={0.08} sides={6} position={[0, 0.04, 0]} color={C.pot} />
      {leaves.map((i) => {
        const a = (i / leaves.length) * Math.PI * 2;
        const tilt = i % 2 ? 0.55 : 0.85;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.02, 0.1, Math.sin(a) * 0.02]} rotation={[Math.sin(a) * tilt, 0, -Math.cos(a) * tilt]} castShadow>
            <coneGeometry args={[0.018, 0.09, 4]} />
            <meshStandardMaterial color={i % 2 ? C.plantDark : C.plant} roughness={0.9} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

const FUR = "#a8743f";
const FUR_DARK = "#5e3e24";

/** Chien couché sur le tapis. Il respire et remue la queue ; immobile si les animations sont coupées. */
function Dog({ animated }: { animated: boolean }) {
  const body = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!animated || !body.current || !tail.current || !head.current) return;
    const t = clock.elapsedTime;
    body.current.scale.y = 1 + Math.sin(t * 2.2) * 0.03;
    tail.current.rotation.y = Math.sin(t * 7) * 0.45;
    // De temps en temps, il lève la tête vers la personne au bureau.
    head.current.rotation.x = -Math.max(0, Math.sin(t * 0.4) - 0.7) * 1.2;
  });

  return (
    <group position={[1.05, 0, -0.85]} rotation-y={-0.75}>
      <group ref={body}>
        {/* Corps allongé, arrière-train et pattes */}
        <Gem radius={0.16} scale={[0.72, 0.55, 1.35]} position={[0, 0.12, 0]} color={FUR} rough={1} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Gem radius={0.085} position={[s * 0.085, 0.085, -0.13]} color={FUR} rough={1} />
            <Box size={[0.05, 0.035, 0.15]} position={[s * 0.06, 0.02, 0.25]} color={FUR} rough={1} />
          </group>
        ))}
      </group>

      {/* Tête : pivot à la base du cou */}
      <group ref={head} position={[0, 0.17, 0.22]}>
        <Gem radius={0.095} scale={[1, 0.92, 1.1]} position={[0, 0.05, 0.04]} color={FUR} rough={1} />
        <Box size={[0.07, 0.055, 0.09]} position={[0, 0.02, 0.14]} color={FUR} rough={1} />
        <Box size={[0.032, 0.026, 0.02]} position={[0, 0.04, 0.19]} color="#1c1714" rough={0.4} shadow={false} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Prism top={0.004} bottom={0.034} height={0.08} sides={3} position={[s * 0.06, 0.13, 0.02]} rotation={[0, 0, s * -0.35]} color={FUR_DARK} />
            <Box size={[0.014, 0.014, 0.01]} position={[s * 0.035, 0.07, 0.125]} color="#1c1714" rough={0.4} shadow={false} />
          </group>
        ))}
      </group>

      {/* Queue */}
      {/* Queue : posée presque à plat derrière le chien, elle balaie le tapis */}
      <group ref={tail} position={[0, 0.1, -0.24]}>
        <Prism top={0.014} bottom={0.03} height={0.16} sides={5} position={[0, 0.012, -0.075]} rotation={[-1.4, 0, 0]} color={FUR} />
      </group>
    </group>
  );
}

export function Companions({ animated }: { animated: boolean }) {
  return (
    <>
      <RubiksCube />
      <DeskPlant />
      <Dog animated={animated} />
    </>
  );
}
