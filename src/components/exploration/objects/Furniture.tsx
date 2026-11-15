import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotion } from "@/lib/motion";
import { Hotspot } from "../scene/Hotspot";
import { ANCHORS, FRAMES, bookAt, bookHeight } from "../scene/layout";
import { Box, Gem, Mat, Prism } from "../scene/lowpoly";
import { BOOK_COLORS, C, NOTE_COLORS } from "../scene/palette";
import { projects } from "@/content";
import { ComputerScreen } from "../scene/ComputerScreen";
import { setProject, useExploration } from "../scene/store";

// Meubles et objets de la pièce, en low poly : formes à peu de faces, éclairées à plat.
// Les objets cliquables sont enveloppés dans <Hotspot> ; la pièce évolue avec les découvertes.

/** Bureau contre le mur du fond. Le plateau est à 0,79 m. */
export function Desk() {
  return (
    <group position={[0, 0, -2.45]}>
      {/* Plateau épais, avec un chant plus sombre */}
      <Box size={[2.3, 0.06, 0.95]} position={[0, 0.76, 0]} color={C.wood} rough={0.6} />
      <Box size={[2.24, 0.04, 0.89]} position={[0, 0.715, 0]} color={C.woodDark} />
      {/* Pieds fuselés */}
      {[
        [-1.02, -0.36],
        [-1.02, 0.36],
        [0.28, 0.36],
      ].map(([x, z], i) => (
        <Prism
          key={i}
          top={0.05}
          bottom={0.03}
          height={0.7}
          sides={4}
          position={[x, 0.35, z]}
          rotation={[0, Math.PI / 4, 0]}
          color={C.woodDark}
        />
      ))}
      {/* Caisson à deux tiroirs, côté droit */}
      <Box size={[0.66, 0.66, 0.84]} position={[0.75, 0.365, 0]} color={C.wood} rough={0.7} />
      {[0.52, 0.22].map((y) => (
        <group key={y}>
          <Box size={[0.58, 0.26, 0.02]} position={[0.75, y, 0.43]} color={C.woodDark} />
          <Prism
            top={0.02}
            bottom={0.02}
            height={0.14}
            sides={6}
            position={[0.75, y, 0.455]}
            rotation={[0, 0, Math.PI / 2]}
            color={C.gold}
            rough={0.4}
          />
        </group>
      ))}
      {/* Sous-main */}
      <Box size={[0.95, 0.008, 0.42]} position={[0, 0.794, 0.2]} color={C.trousers} rough={1} shadow={false} />
    </group>
  );
}

/** Ordinateur : écran (dessiné par ComputerScreen), pied, clavier à rangées, souris. */
export function Computer() {
  const { project } = useExploration();
  return (
    <Hotspot
      focus={{ kind: "computer" }}
      at={ANCHORS.computer.at}
      radius={ANCHORS.computer.radius}
      label="Ordinateur · mes projets"
      onActiveClick={() => setProject((project + 1) % projects.length)}
    >
      <group position={[0, 0.79, -2.6]}>
        <Prism top={0.11} bottom={0.15} height={0.025} sides={6} position={[0, 0.012, 0]} color={C.metal} rough={0.4} />
        <Box size={[0.06, 0.22, 0.04]} position={[0, 0.12, -0.02]} rotation={[0.12, 0, 0]} color={C.metal} rough={0.4} />
        <Box size={[1.0, 0.62, 0.04]} position={[0, 0.5, 0]} color={C.metal} rough={0.4} />
        <ComputerScreen position={[0, 0.5, 0.022]} />
        {/* Clavier : socle et trois rangées de touches */}
        <Box size={[0.5, 0.018, 0.17]} position={[0, 0.013, 0.4]} color={C.metal} rough={0.5} />
        {[-0.05, 0, 0.05].map((z) => (
          <Box
            key={z}
            size={[0.44, 0.01, 0.036]}
            position={[0, 0.027, 0.4 + z]}
            color={C.metalLight}
            rough={0.6}
            shadow={false}
          />
        ))}
        <Prism top={0.03} bottom={0.036} height={0.028} sides={6} position={[0.42, 0.018, 0.4]} color={C.metal} rough={0.5} />
      </group>
    </Hotspot>
  );
}

/** Téléphone posé à plat sur le bureau. Ouvert, son écran s'allume. */
export function Phone() {
  const { focus } = useExploration();
  const lit = focus?.kind === "phone";
  return (
    <Hotspot
      focus={{ kind: "phone" }}
      at={ANCHORS.phone.at}
      radius={ANCHORS.phone.radius}
      label="Téléphone · me contacter"
      float
    >
      <group position={[-0.55, 0.79, -2.2]} rotation-y={0.35}>
        <Box size={[0.09, 0.014, 0.18]} position={[0, 0.011, 0]} color={C.metal} rough={0.3} />
        <mesh position={[0, 0.0185, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.078, 0.165]} />
          <meshBasicMaterial color={lit ? C.gold : C.screen} toneMapped={false} />
        </mesh>
      </group>
    </Hotspot>
  );
}

/** Lampe d'architecte. Éteinte au départ ; elle s'allume à la première découverte. */
export function Lamp() {
  const { seen } = useExploration();
  const on = seen.length > 0;
  return (
    <group position={[-0.92, 0.79, -2.62]}>
      <Prism top={0.085} bottom={0.1} height={0.03} sides={6} position={[0, 0.015, 0]} color={C.metal} rough={0.4} />
      {/* Deux segments de bras, articulés */}
      <Box size={[0.022, 0.34, 0.022]} position={[-0.04, 0.19, 0]} rotation={[0, 0, 0.22]} color={C.metal} rough={0.4} />
      <Box size={[0.022, 0.3, 0.022]} position={[0.02, 0.44, 0.04]} rotation={[0.3, 0, -0.75]} color={C.metal} rough={0.4} />
      <Gem radius={0.022} position={[-0.075, 0.355, 0]} color={C.gold} rough={0.4} />
      {/* Abat-jour à six pans */}
      <mesh position={[0.15, 0.5, 0.09]} rotation={[0.45, 0, -0.55]} castShadow>
        <coneGeometry args={[0.13, 0.16, 6, 1, true]} />
        <meshStandardMaterial color={C.gold} roughness={0.5} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.17, 0.47, 0.1]}>
        <icosahedronGeometry args={[0.035, 0]} />
        <meshBasicMaterial color={on ? C.lampLight : "#4a4a52"} toneMapped={false} />
      </mesh>
      <pointLight
        position={[0.2, 0.42, 0.16]}
        color={C.lampLight}
        intensity={on ? 6 : 0}
        distance={5}
        decay={1.5}
      />
    </group>
  );
}

/** Une formation = un livre. Ouvert, il laisse sa place au livre 3D (OpenBook), qui sort de l'étagère. */
function Book({ index, color }: { index: number; color: string }) {
  const at = bookAt(index);
  const h = bookHeight(index);
  const { focus } = useExploration();
  const open = focus?.kind === "books" && focus.index === index;
  return (
    <Hotspot focus={{ kind: "books", index }} at={at} radius={0.13} label="Livre · une formation">
      <group visible={!open}>
        <Box size={[0.075, h, 0.2]} position={at} color={color} />
        {/* Filet doré sur le dos */}
        <Box
          size={[0.077, 0.014, 0.202]}
          position={[at[0], at[1] + h * 0.28, at[2]]}
          color={C.gold}
          rough={0.5}
          shadow={false}
        />
      </group>
    </Hotspot>
  );
}

/** Deux étagères à équerres. Un livre par formation en haut ; en bas, livres de décor et plante. */
export function Shelves({ books }: { books: number }) {
  const { seen } = useExploration();
  const extras = 5;
  return (
    <group>
      {[1.25, 1.8].map((y) => (
        <group key={y}>
          <Box size={[1.4, 0.045, 0.27]} position={[2.15, y, -2.86]} color={C.wood} rough={0.6} />
          {[1.6, 2.7].map((x) => (
            <Box
              key={x}
              size={[0.035, 0.14, 0.2]}
              position={[x, y - 0.09, -2.89]}
              rotation={[0.5, 0, 0]}
              color={C.metal}
              rough={0.5}
            />
          ))}
        </group>
      ))}
      {Array.from({ length: books }, (_, i) => (
        <Book key={i} index={i} color={BOOK_COLORS[i % BOOK_COLORS.length]} />
      ))}
      {/* Serre-livres doré à côté des formations */}
      <Gem radius={0.07} position={[1.6 + books * 0.095 + 0.06, 1.895, -2.86]} color={C.gold} rough={0.35} />
      {Array.from({ length: extras }, (_, i) => {
        const h = 0.24 + (i % 2) * 0.05;
        const lean = i === extras - 1 ? -0.28 : 0;
        return (
          <Box
            key={i}
            size={[0.06, h, 0.19]}
            position={[2.25 + i * 0.075 + (lean ? 0.04 : 0), 1.272 + h / 2, -2.86]}
            rotation={[0, 0, lean]}
            color={BOOK_COLORS[(i + 3) % BOOK_COLORS.length]}
          />
        );
      })}
      {/* Plante : apparaît après trois découvertes. */}
      {seen.length >= 3 && (
        <group position={[1.72, 1.272, -2.86]}>
          <Prism top={0.075} bottom={0.055} height={0.13} sides={6} position={[0, 0.065, 0]} color={C.pot} />
          <Gem radius={0.12} position={[0, 0.22, 0]} scale={[1, 0.9, 1]} color={C.plant} />
          <Gem radius={0.07} position={[0.08, 0.3, 0.02]} color={C.plantDark} />
        </group>
      )}
    </group>
  );
}

/** Petit paysage low poly dans un cadre : ciel, astre, deux montagnes. Quatre variantes selon le cadre. */
function FrameArt({ size, index }: { size: [number, number]; index: number }) {
  const [w, h] = size;
  const skies = ["#27324d", "#d8a66b", "#3f6470", "#7a3f52"];
  const hills = ["#0e1322", "#6e4a32", "#1f3a40", "#3a1f2a"];
  return (
    <group position={[0, 0, 0.021]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={skies[index % 4]} />
      </mesh>
      <mesh position={[w * 0.2, h * 0.2, 0.001]}>
        <circleGeometry args={[Math.min(w, h) * 0.11, 6]} />
        <meshBasicMaterial color={C.gold} />
      </mesh>
      {[
        [-0.2, 0.62],
        [0.16, 0.44],
      ].map(([x, k], i) => (
        <mesh key={i} position={[w * x, -h / 2 + (h * k) / 2, 0.002 + i * 0.001]} scale={[1, 1, 0.01]}>
          <coneGeometry args={[w * 0.3, h * k, 3]} />
          <meshBasicMaterial color={hills[(index + i) % 4]} />
        </mesh>
      ))}
    </group>
  );
}

/** Un cadre par réalisation. */
export function Frames({ count }: { count: number }) {
  return (
    <>
      {FRAMES.slice(0, count).map((s, i) => (
        <Hotspot
          key={i}
          focus={{ kind: "frames", index: i }}
          at={s.position}
          radius={Math.max(...s.size) * 0.75}
          label="Cadre · une réalisation"
        >
          <group position={s.position} rotation-y={s.rotationY}>
            <Box size={[s.size[0] + 0.08, s.size[1] + 0.08, 0.04]} color={C.woodDark} rough={0.7} />
            <FrameArt size={s.size} index={i} />
          </group>
        </Hotspot>
      ))}
    </>
  );
}

/** Post-it collés au mur, à gauche de l'écran : un par catégorie de compétences. Ouverts, ils se décollent et avancent. */
export function PostIts({ count }: { count: number }) {
  const { focus } = useExploration();
  const animated = useMotion();
  const group = useRef<THREE.Group>(null);
  const open = focus?.kind === "postits";

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const k = animated ? 0.1 : 1;
    g.position.z = THREE.MathUtils.lerp(g.position.z, open ? -2.985 + 0.22 : -2.985, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, open ? -0.12 : 0, k);
  });

  return (
    <Hotspot
      focus={{ kind: "postits" }}
      at={ANCHORS.postits.at}
      radius={ANCHORS.postits.radius}
      label="Post-it · mes compétences"
      float
    >
      <group ref={group} position={[-0.95, 1.5, -2.985]}>
        {Array.from({ length: count }, (_, i) => (
          <mesh
            key={i}
            position={[(i % 3) * 0.17, -Math.floor(i / 3) * 0.17, 0.002]}
            rotation={[0.06, 0, ((i * 37) % 11) / 60 - 0.09]}
          >
            <planeGeometry args={[0.14, 0.14]} />
            <meshStandardMaterial color={NOTE_COLORS[i % NOTE_COLORS.length]} roughness={1} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  );
}

/** Horloge murale à douze pans, à l'heure réelle. Au clic, la trotteuse s'emballe. */
export function Clock({ animated }: { animated: boolean }) {
  const hours = useRef<THREE.Group>(null);
  const minutes = useRef<THREE.Group>(null);
  const seconds = useRef<THREE.Group>(null);
  const { focus } = useExploration();
  const spin = useRef(0);
  const set = useRef(false);

  useFrame((_, delta) => {
    if (!hours.current || !minutes.current || !seconds.current) return;
    if (!set.current || animated) {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      hours.current.rotation.z = -(h / 12) * Math.PI * 2;
      minutes.current.rotation.z = -(m / 60) * Math.PI * 2;
      set.current = true;
      // Trotteuse : suit l'heure réelle, sauf quand l'horloge est ouverte et que les animations sont actives.
      if (!(animated && focus?.kind === "clock")) seconds.current.rotation.z = -(s / 60) * Math.PI * 2;
    }
    if (animated && focus?.kind === "clock") {
      spin.current += delta * 14;
      seconds.current.rotation.z = -spin.current;
    }
  });

  const hand = (length: number, width: number, color: string) => (
    <mesh position={[0, length / 2, 0]}>
      <boxGeometry args={[width, length, 0.01]} />
      <Mat color={color} />
    </mesh>
  );
  return (
    <Hotspot focus={{ kind: "clock" }} at={ANCHORS.clock.at} radius={ANCHORS.clock.radius} label="Horloge · le futur">
      <group position={[2.15, 2.5, -2.97]}>
        <Prism top={0.27} bottom={0.27} height={0.05} sides={12} rotation={[Math.PI / 2, 0, 0]} color={C.woodDark} rough={0.6} />
        <mesh position={[0, 0, 0.027]}>
          <circleGeometry args={[0.23, 12]} />
          <Mat color={C.paper} rough={0.9} />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * 0.195, Math.cos(a) * 0.195, 0.03]} rotation={[0, 0, -a]}>
              <boxGeometry args={[i % 3 === 0 ? 0.014 : 0.008, i % 3 === 0 ? 0.04 : 0.022, 0.004]} />
              <Mat color={C.metal} />
            </mesh>
          );
        })}
        <group ref={hours} position={[0, 0, 0.034]}>
          {hand(0.11, 0.02, C.metal)}
        </group>
        <group ref={minutes} position={[0, 0, 0.039]}>
          {hand(0.17, 0.013, C.metal)}
        </group>
        <group ref={seconds} position={[0, 0, 0.044]}>
          {hand(0.19, 0.006, "#b8862f")}
        </group>
        <Gem radius={0.016} position={[0, 0, 0.046]} color={C.gold} rough={0.4} shadow={false} />
      </group>
    </Hotspot>
  );
}

/** Chaise de bureau : piètement en étoile à cinq branches, assise, dossier incliné, accoudoirs. */
export function Chair() {
  return (
    <group position={[0, 0, -1.55]}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i}>
            <Box
              size={[0.3, 0.035, 0.05]}
              position={[Math.cos(a) * 0.15, 0.06, Math.sin(a) * 0.15]}
              rotation={[0, -a, 0]}
              color={C.metal}
              rough={0.5}
            />
            <Gem radius={0.035} position={[Math.cos(a) * 0.3, 0.035, Math.sin(a) * 0.3]} color={C.shoe} shadow={false} />
          </group>
        );
      })}
      <Prism top={0.03} bottom={0.04} height={0.38} sides={6} position={[0, 0.26, 0]} color={C.metalLight} rough={0.4} />
      <Box size={[0.54, 0.09, 0.52]} position={[0, 0.485, 0]} color={C.woodDark} />
      <Box size={[0.5, 0.62, 0.08]} position={[0, 0.9, 0.27]} rotation={[0.1, 0, 0]} color={C.woodDark} />
      <Box size={[0.06, 0.3, 0.06]} position={[0, 0.62, 0.27]} color={C.metal} rough={0.5} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box size={[0.04, 0.2, 0.04]} position={[side * 0.28, 0.63, 0.08]} color={C.metal} rough={0.5} />
          <Box size={[0.07, 0.035, 0.3]} position={[side * 0.28, 0.74, 0.02]} color={C.woodDark} />
        </group>
      ))}
    </group>
  );
}
