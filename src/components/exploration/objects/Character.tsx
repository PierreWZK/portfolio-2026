import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { Box, Gem, Prism } from "../scene/lowpoly";
import { C } from "../scene/palette";

/**
 * Personnage low poly assis sur la chaise, face au bureau : volumes à facettes, sans visage détaillé.
 * Animations légères, calculées par quelques sinus : respiration, tête qui bouge un peu,
 * regard qui passe de l'écran à la fenêtre, buste qui oscille. Aucune animation si `animated` est faux.
 * Pour le remplacer : garder la position du groupe et la hauteur d'assise (0,53 m).
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

  return (
    <group position={[0, 0, -1.55]}>
      {/* Jambes : cuisses vers le bureau, tibias vers le sol, chaussures */}
      {[-0.11, 0.11].map((x) => (
        <group key={x}>
          <Prism
            top={0.075}
            bottom={0.085}
            height={0.42}
            sides={6}
            position={[x, 0.585, -0.2]}
            rotation={[Math.PI / 2, 0, 0]}
            color={C.trousers}
          />
          <Prism top={0.07} bottom={0.055} height={0.44} sides={6} position={[x, 0.33, -0.42]} color={C.trousers} />
          <Box size={[0.11, 0.08, 0.24]} position={[x, 0.05, -0.47]} color={C.shoe} rough={0.6} />
        </group>
      ))}

      <group ref={torso} position={[0, 0.56, 0.02]}>
        {/* Buste : tronc de prisme, plus large aux épaules */}
        <Prism top={0.21} bottom={0.17} height={0.5} sides={7} position={[0, 0.32, 0]} color={C.sweater} rough={0.9} />
        {/* Col */}
        <Prism top={0.08} bottom={0.1} height={0.05} sides={7} position={[0, 0.59, 0]} color={C.sweater} rough={0.9} />
        {/* Bras : épaule, avant-bras vers le clavier, main */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <Prism
              top={0.065}
              bottom={0.055}
              height={0.34}
              sides={5}
              position={[side * 0.235, 0.4, -0.1]}
              rotation={[0.75, 0, side * 0.12]}
              color={C.sweater}
              rough={0.9}
            />
            <Prism
              top={0.055}
              bottom={0.045}
              height={0.34}
              sides={5}
              position={[side * 0.2, 0.26, -0.38]}
              rotation={[1.45, 0, side * -0.25]}
              color={C.sweater}
              rough={0.9}
            />
            <Gem radius={0.055} position={[side * 0.15, 0.25, -0.57]} color={C.skin} rough={0.8} />
          </group>
        ))}
        {/* Cou */}
        <Prism top={0.055} bottom={0.065} height={0.1} sides={6} position={[0, 0.64, 0]} color={C.skin} rough={0.8} />
        {/* Tête : le pivot est à la base du cou */}
        <group ref={head} position={[0, 0.68, 0]}>
          <Gem radius={0.17} detail={1} scale={[0.95, 1.05, 1]} position={[0, 0.16, 0]} color={C.skin} rough={0.8} />
          {/* Cheveux : un bloc à facettes sur le haut et l'arrière du crâne, et une mèche */}
          <Gem
            radius={0.165}
            scale={[1.08, 0.78, 1.1]}
            position={[0, 0.25, 0.045]}
            rotation={[0.3, 0.4, 0]}
            color={C.hair}
            rough={1}
          />
          <Gem radius={0.07} position={[0.06, 0.3, -0.1]} rotation={[0.2, 0, 0.5]} color={C.hair} rough={1} />
        </group>
      </group>
    </group>
  );
}
