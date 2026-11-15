import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as THREE from "three";
import { formations } from "@/content";
import { useMotion } from "@/lib/motion";
import { bookAt, htmlLayer } from "../scene/layout";
import { BOOK_COLORS, C } from "../scene/palette";
import { BOOK_PAGES, setBookPage, useExploration } from "../scene/store";

// Le livre ouvert : un vrai objet 3D. Il sort de l'étagère, se tourne vers la caméra, sa couverture
// pivote autour du dos, puis une feuille se tourne. Le texte est du vrai texte (HTML posé sur les pages).
//
// Repère du livre : dos vertical en x = 0, page de droite en x > 0, face vers +z.
const W = 0.21; // largeur d'une page
const H = 0.3;
const PAGE_PX = 300; // largeur d'une page en pixels HTML
const PAGE_H_PX = Math.round((PAGE_PX * (H - 0.03)) / (W - 0.02));
const SCALE = (W - 0.02) / (PAGE_PX / 40); // Html transform : 1 px = 1/40 d'unité

const pageStyle: CSSProperties = {
  width: PAGE_PX,
  height: PAGE_H_PX,
  fontFamily: "var(--font-hand), cursive",
  color: "#2a2420",
  backfaceVisibility: "hidden",
  padding: "18px 20px",
  lineHeight: 1.15,
};

/** Texte posé sur une page. shown : la page est-elle celle qu'on lit en ce moment. */
function PageText({ x, z, flip = false, shown, children }: { x: number; z: number; flip?: boolean; shown: boolean; children: ReactNode }) {
  return (
    <Html transform portal={htmlLayer as React.RefObject<HTMLElement>} position={[x, 0, z]} rotation-y={flip ? Math.PI : 0} scale={SCALE} zIndexRange={[20, 0]}>
      <div
        style={{ ...pageStyle, opacity: shown ? 1 : 0, transition: "opacity 300ms", pointerEvents: shown ? "auto" : "none" }}
        aria-hidden={!shown}
      >
        {children}
      </div>
    </Html>
  );
}

export function OpenBook() {
  const { focus, bookPage } = useExploration();
  const animated = useMotion();
  const index = focus?.kind === "books" ? (focus.index ?? 0) : null;
  // On garde le dernier livre ouvert pour jouer la fermeture.
  const [shown, setShown] = useState(0);
  if (index !== null && index !== shown) setShown(index);
  const formation = formations[shown];

  const root = useRef<THREE.Group>(null);
  const cover = useRef<THREE.Group>(null);
  const leaf = useRef<THREE.Group>(null);
  // out : 0 sur l'étagère, 1 devant la caméra. open : couverture. turn : feuille.
  const anim = useRef({ out: 0, open: 0, turn: 0 });

  // Animations coupées : la scène ne se redessine qu'à la demande, on la réveille à chaque changement.
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [index, bookPage, invalidate]);

  useFrame(() => {
    const g = root.current;
    if (!g || !cover.current || !leaf.current) return;
    const a = anim.current;
    const k = animated ? 0.1 : 1;
    const isOpen = index !== null;
    a.out = THREE.MathUtils.lerp(a.out, isOpen ? 1 : 0, k);
    // La couverture ne s'ouvre qu'une fois le livre sorti, et se referme avant qu'il rentre.
    a.open = THREE.MathUtils.lerp(a.open, isOpen && a.out > 0.85 ? 1 : 0, k);
    a.turn = THREE.MathUtils.lerp(a.turn, isOpen && bookPage > 0 ? 1 : 0, k);

    const [sx, sy, sz] = bookAt(shown);
    // Sur l'étagère : petit, dos vers la pièce. Ouvert : centré sur le dos, face à la caméra.
    g.position.set(sx, sy + a.out * 0.02, sz + a.out * 0.5);
    g.rotation.y = (1 - a.out) * (Math.PI / 2);
    g.scale.setScalar(THREE.MathUtils.lerp(0.9, 1.25, a.out));
    g.visible = a.out > 0.02;
    cover.current.rotation.y = -a.open * (Math.PI - 0.05);
    // Fermée, la couverture est devant les pages ; ouverte, elle se couche derrière la feuille tournée.
    cover.current.position.z = THREE.MathUtils.lerp(0.022, 0.004, a.open);
    leaf.current.rotation.y = -a.turn * (Math.PI - 0.1);
  });

  if (!formation) return null;
  const color = BOOK_COLORS[shown % BOOK_COLORS.length];
  const reading = index !== null;

  return (
    <group ref={root} visible={false}>
      {/* Dos et quatrième de couverture */}
      <mesh position={[W / 2, 0, -0.004]} castShadow>
        <boxGeometry args={[W, H, 0.008]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Bloc de pages de droite */}
      <mesh position={[W / 2, 0, 0.008]}>
        <boxGeometry args={[W - 0.012, H - 0.02, 0.016]} />
        <meshStandardMaterial color={C.paper} roughness={1} />
      </mesh>
      {/* Page de droite, sous la feuille : compétences acquises */}
      <PageText x={W / 2} z={0.0165} shown={reading && bookPage === 1}>
        <p style={{ fontSize: 22, fontWeight: 700 }}>Ce que j&apos;y ai appris</p>
        <ul style={{ marginTop: 14, fontSize: 24 }}>
          {formation.skills.map((skill) => (
            <li key={skill} style={{ marginTop: 8 }}>
              — {skill}
            </li>
          ))}
        </ul>
        <p style={{ position: "absolute", bottom: 14, right: 20, fontSize: 16 }}>2</p>
      </PageText>

      {/* Feuille qui se tourne : recto = titre, verso = description */}
      <group ref={leaf} position={[0, 0, 0.018]}>
        <mesh position={[W / 2, 0, 0]}>
          <planeGeometry args={[W - 0.014, H - 0.022]} />
          <meshStandardMaterial color="#f4f0e6" roughness={1} side={THREE.DoubleSide} />
        </mesh>
        <PageText x={W / 2} z={0.0008} shown={reading && bookPage === 0}>
          <p style={{ fontSize: 18, letterSpacing: 1 }}>{formation.dates}</p>
          <h2 style={{ marginTop: 26, fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{formation.name}</h2>
          <p style={{ marginTop: 18, fontSize: 24 }}>{formation.school}</p>
          <p style={{ position: "absolute", bottom: 14, right: 20, fontSize: 16 }}>tourner la page →</p>
        </PageText>
        <PageText x={W / 2} z={-0.0008} flip shown={reading && bookPage === 1}>
          <p style={{ fontSize: 22, fontWeight: 700 }}>{formation.name}</p>
          <p style={{ marginTop: 14, fontSize: 23 }}>{formation.description}</p>
          <p style={{ position: "absolute", bottom: 14, left: 20, fontSize: 16 }}>1</p>
        </PageText>
      </group>

      {/* Couverture, articulée sur le dos */}
      <group ref={cover} position={[0, 0, 0.022]}>
        <mesh position={[W / 2, 0, 0]} castShadow>
          <boxGeometry args={[W, H, 0.008]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        <mesh position={[W / 2, 0.06, 0.0045]}>
          <planeGeometry args={[W * 0.6, 0.012]} />
          <meshStandardMaterial color={C.gold} roughness={0.6} />
        </mesh>
      </group>

      {/* Zone de clic sur le livre ouvert : page suivante, puis retour à la première. */}
      <mesh
        position={[0, 0, 0.03]}
        visible={false}
        onClick={(event) => {
          if (!reading) return;
          event.stopPropagation();
          setBookPage((bookPage + 1) % BOOK_PAGES);
        }}
      >
        <planeGeometry args={[W * 2, H]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
