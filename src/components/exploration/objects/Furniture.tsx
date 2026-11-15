import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotion } from "@/lib/motion";
import { BOOK_COLORS, C, NOTE_COLORS } from "../scene/palette";
import { ANCHORS, FRAMES, bookAt, bookHeight } from "../scene/layout";
import { Hotspot } from "../scene/Hotspot";
import { useExploration } from "../scene/store";

// Meubles et objets de la pièce, en formes simples écrites en code.
// Les objets cliquables sont enveloppés dans <Hotspot> ; la pièce évolue avec les découvertes.

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

/** Ordinateur : écran (l'interface est posée par ComputerScreen), pied, clavier, souris. */
export function Computer() {
  return (
    <Hotspot focus={{ kind: "computer" }} at={ANCHORS.computer.at} radius={ANCHORS.computer.radius} label="Ordinateur · mes projets">
      <group position={[0, 0.79, -2.6]}>
        <Box size={[0.3, 0.02, 0.2]} position={[0, 0.01, 0]} color={C.metal} rough={0.4} />
        <Box size={[0.05, 0.22, 0.04]} position={[0, 0.12, -0.02]} color={C.metal} rough={0.4} />
        <Box size={[1.0, 0.62, 0.04]} position={[0, 0.5, 0]} color={C.metal} rough={0.4} />
        <mesh position={[0, 0.5, 0.022]}>
          <planeGeometry args={[0.94, 0.56]} />
          <meshBasicMaterial color={C.screen} />
        </mesh>
        <Box size={[0.5, 0.02, 0.16]} position={[0, 0.01, 0.4]} color={C.metal} rough={0.5} />
        <Box size={[0.07, 0.025, 0.11]} position={[0.42, 0.012, 0.4]} color={C.metal} rough={0.5} />
      </group>
    </Hotspot>
  );
}

/** Téléphone posé à plat sur le bureau. */
export function Phone() {
  const { focus } = useExploration();
  const lit = focus?.kind === "phone";
  return (
    <Hotspot focus={{ kind: "phone" }} at={ANCHORS.phone.at} radius={ANCHORS.phone.radius} label="Téléphone · me contacter" float>
      <group position={[-0.55, 0.79, -2.2]} rotation-y={0.35}>
        <Box size={[0.09, 0.012, 0.18]} position={[0, 0.006, 0]} color={C.metal} rough={0.3} />
        <mesh position={[0, 0.0125, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.078, 0.165]} />
          <meshBasicMaterial color={lit ? C.gold : C.screen} toneMapped={false} />
        </mesh>
      </group>
    </Hotspot>
  );
}

/** Lampe de bureau. Éteinte au départ ; elle s'allume à la première découverte. */
export function Lamp() {
  const { seen } = useExploration();
  const on = seen.length > 0;
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
        <meshBasicMaterial color={on ? C.lampLight : "#3a3a40"} toneMapped={false} />
      </mesh>
      <pointLight position={[0.12, 0.4, 0.14]} color={C.lampLight} intensity={on ? 5 : 0} distance={5} decay={1.5} />
    </group>
  );
}

/** Une formation = un livre. Ouvert, il laisse sa place au livre 3D (OpenBook), qui sort de l'étagère. */
function Book({ index, color }: { index: number; color: string }) {
  const at = bookAt(index);
  const { focus } = useExploration();
  const open = focus?.kind === "books" && focus.index === index;
  return (
    <Hotspot focus={{ kind: "books", index }} at={at} radius={0.13} label="Livre · une formation">
      <group visible={!open}>
        <Box size={[0.075, bookHeight(index), 0.2]} position={at} color={color} />
      </group>
    </Hotspot>
  );
}

/** Étagères contre le mur de droite du fond. Un livre par formation, plus des livres de décor et une plante. */
export function Shelves({ books }: { books: number }) {
  const { seen } = useExploration();
  const extras = 5;
  return (
    <group>
      {[1.25, 1.8].map((y) => (
        <Box key={y} size={[1.4, 0.04, 0.26]} position={[2.15, y, -2.86]} color={C.wood} rough={0.6} />
      ))}
      {Array.from({ length: books }, (_, i) => (
        <Book key={i} index={i} color={BOOK_COLORS[i % BOOK_COLORS.length]} />
      ))}
      {Array.from({ length: extras }, (_, i) => {
        const h = 0.24 + (i % 2) * 0.05;
        return (
          <Box
            key={`d${i}`}
            size={[0.06, h, 0.19]}
            position={[2.25 + i * 0.08, 1.27 + h / 2, -2.86]}
            color={BOOK_COLORS[(i + 3) % BOOK_COLORS.length]}
          />
        );
      })}
      {/* Plante : apparaît après trois découvertes. */}
      {seen.length >= 3 && (
        <group>
          <mesh position={[1.7, 1.34, -2.86]} castShadow>
            <cylinderGeometry args={[0.07, 0.055, 0.14, 12]} />
            <meshStandardMaterial color={C.paper} roughness={0.7} />
          </mesh>
          <mesh position={[1.7, 1.52, -2.86]} castShadow>
            <icosahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color={C.plant} roughness={0.9} flatShading />
          </mesh>
        </group>
      )}
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
            <mesh castShadow>
              <boxGeometry args={[s.size[0] + 0.06, s.size[1] + 0.06, 0.04]} />
              <meshStandardMaterial color={C.woodDark} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.021]}>
              <planeGeometry args={s.size} />
              <meshStandardMaterial color={i % 2 ? C.paper : C.gold} roughness={0.9} />
            </mesh>
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
    <Hotspot focus={{ kind: "postits" }} at={ANCHORS.postits.at} radius={ANCHORS.postits.radius} label="Post-it · mes compétences" float>
      <group ref={group} position={[-0.95, 1.5, -2.985]}>
        {Array.from({ length: count }, (_, i) => (
          <mesh key={i} position={[(i % 3) * 0.17, -Math.floor(i / 3) * 0.17, 0]} rotation-z={((i * 37) % 11) / 60 - 0.09}>
            <planeGeometry args={[0.14, 0.14]} />
            <meshStandardMaterial color={NOTE_COLORS[i % NOTE_COLORS.length]} roughness={1} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  );
}

/** Horloge murale à l'heure réelle. Au clic, la trotteuse s'emballe un instant. */
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
      <meshStandardMaterial color={color} />
    </mesh>
  );
  return (
    <Hotspot focus={{ kind: "clock" }} at={ANCHORS.clock.at} radius={ANCHORS.clock.radius} label="Horloge · le futur">
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
    </Hotspot>
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
