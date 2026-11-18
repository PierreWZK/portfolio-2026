"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { formations, realisations, skillCategories } from "@/content";
import { useMotion } from "@/lib/motion";
import { Character } from "../objects/Character";
import { Companions } from "../objects/Companions";
import {
  Chair,
  Clock,
  Computer,
  Desk,
  Frames,
  Lamp,
  Phone,
  PostIts,
  Shelves,
} from "../objects/Furniture";
import { DeskItems } from "../objects/DeskItems";
import { OpenBook } from "../objects/OpenBook";
import { CameraRig } from "./CameraRig";
import { HOME_TARGET, htmlLayer, type Vec3 } from "./layout";
import { C } from "./palette";
import { Room } from "./Room";
import { KINDS, useExploration } from "./store";

/**
 * Scène 3D du mode exploration. Chargée seulement quand le visiteur ouvre /exploration.
 * Animations coupées : rendu à la demande (une image quand quelque chose change), rien ne tourne en continu.
 */
export default function Workspace() {
  const animated = useMotion();
  const { seen } = useExploration();
  // Écran en hauteur (téléphone) : la caméra recule pour garder le sujet entier dans le cadre.
  const [portrait] = useState(() => window.innerHeight > window.innerWidth);
  const back = portrait ? 1.7 : 1;
  // Téléphone ou tablette (pointeur grossier) : moins de pixels et des ombres plus légères.
  const [light] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  const [home] = useState<Vec3>(() => [
    HOME_TARGET[0] + 4.4 * back,
    HOME_TARGET[1] + 1.95 * back,
    HOME_TARGET[2] + 5.2 * back,
  ]);

  // Le calque des éléments HTML doit exister avant la scène (voir htmlLayer).
  const [layer, setLayer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="absolute inset-0">
      <div
        ref={(el) => {
          htmlLayer.current = el;
          setLayer(el);
        }}
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      />
      {layer && (
        <Canvas
          shadows
          dpr={light ? [1, 1.5] : [1, 1.75]}
          frameloop={animated ? "always" : "demand"}
          camera={{ position: home, fov: 40, near: 0.1, far: 60 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl, scene, camera }) => {
            scene.background = null;
            // Compteurs de rendu lisibles par les tests de performance (développement seulement).
            if (process.env.NODE_ENV !== "production")
              Object.assign(window, { __gl: gl, __cam: camera });
          }}
          aria-label="Bureau en 3D : un personnage assis devant son ordinateur, une fenêtre sur la nuit, des étagères de livres, des cadres, des post-it, une lampe, une horloge, un téléphone, un Rubik's cube, des plantes, et un chien couché sur le tapis. Chaque objet s'ouvre aussi depuis la barre de boutons sous la scène."
          role="img"
        >
          {/* Peu de lumière d'ambiance : en low poly, ce sont les contrastes qui dessinent les facettes. */}
          <ambientLight intensity={0.55} />
          <hemisphereLight args={[C.moonLight, C.floorB, 0.75]} />
          {/* Clair de lune qui entre par la fenêtre : la seule lumière qui porte des ombres. */}
          <directionalLight
            position={[-6, 4.5, 0.5]}
            intensity={1.5}
            color={C.moonLight}
            castShadow
            shadow-mapSize={light ? [1024, 1024] : [2048, 2048]}
            shadow-radius={3}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={4}
            shadow-camera-bottom={-2}
            shadow-camera-far={16}
            shadow-bias={-0.0006}
          />
          {/* Appoint chaud venu de la pièce, sans ombre : il débouche les faces tournées vers la caméra. */}
          <pointLight position={[2.4, 2.8, 1.2]} intensity={16} distance={11} decay={1.4} color="#ffdcb0" />
          {/* Lueur de l'écran sur le personnage et le bureau. */}
          <pointLight position={[0, 1.3, -2.25]} intensity={1.6} distance={2.2} decay={1.6} color={C.screenGlow} />

          {/* Tout découvert : le jour se lève derrière la fenêtre. */}
          <Room dawn={seen.length >= KINDS.length} />
          <Desk />
          <Computer />
          <Phone />
          <DeskItems />
          <Companions animated={animated} />
          <Lamp />
          <Chair />
          <Character animated={animated} />
          <Shelves books={formations.length} />
          <OpenBook />
          <Frames count={realisations.length} />
          <PostIts count={skillCategories.length} />
          <Clock animated={animated} />

          {/* Caméra bornée : on tourne devant la pièce, sans passer derrière les murs ni sous le sol. */}
          <OrbitControls
            makeDefault
            target={HOME_TARGET}
            enablePan={false}
            enableDamping={animated}
            minDistance={3.2}
            maxDistance={portrait ? 14 : 9}
            minAzimuthAngle={0.12}
            maxAzimuthAngle={1.2}
            minPolarAngle={0.85}
            maxPolarAngle={1.5}
          />
          <CameraRig home={home} back={back} animated={animated} />
        </Canvas>
      )}
    </div>
  );
}
