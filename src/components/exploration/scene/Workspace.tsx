"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { formations, realisations, skillCategories } from "@/content";
import { useMotion } from "@/lib/motion";
import { Character } from "../objects/Character";
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
import { OpenBook } from "../objects/OpenBook";
import { CameraRig } from "./CameraRig";
import { ComputerScreen } from "./ComputerScreen";
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
          dpr={[1, 1.75]}
          frameloop={animated ? "always" : "demand"}
          camera={{ position: home, fov: 40, near: 0.1, far: 60 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl, scene, camera }) => {
            scene.background = null;
            // Compteurs de rendu lisibles par les tests de performance (développement seulement).
            if (process.env.NODE_ENV !== "production")
              Object.assign(window, { __gl: gl, __cam: camera });
          }}
          aria-label="Bureau en 3D : un personnage assis devant son ordinateur, une fenêtre sur la nuit, des étagères de livres, des cadres, des post-it, une lampe, une horloge et un téléphone. Chaque objet s'ouvre aussi depuis la barre de boutons sous la scène."
          role="img"
        >
          <ambientLight intensity={1.1} />
          <hemisphereLight args={[C.moonLight, C.floor, 0.9]} />
          {/* Clair de lune qui entre par la fenêtre : la seule lumière qui porte des ombres. */}
          <directionalLight
            position={[-6, 4.5, 0.5]}
            intensity={0.9}
            color={C.moonLight}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={4}
            shadow-camera-bottom={-2}
            shadow-camera-far={16}
            shadow-bias={-0.0006}
          />
          <pointLight
            position={[1.5, 2.6, 0.5]}
            intensity={14}
            distance={10}
            decay={1.4}
            color="#ffe6c4"
          />

          {/* Tout découvert : le jour se lève derrière la fenêtre. */}
          <Room dawn={seen.length >= KINDS.length} />
          <Desk />
          <Computer />
          <ComputerScreen />
          <Phone />
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
