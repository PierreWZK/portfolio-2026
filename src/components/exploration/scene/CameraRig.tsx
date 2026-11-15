import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_TARGET, viewFor, type Vec3 } from "./layout";
import { useExploration } from "./store";

type Controls = {
  enabled: boolean;
  minDistance: number;
  maxDistance: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  target: THREE.Vector3;
  update: () => void;
};

// Bornes de la vue d'ensemble (les mêmes que sur <OrbitControls>).
const HOME_LIMITS = { minAzimuthAngle: 0.12, maxAzimuthAngle: 1.2, minPolarAngle: 0.85, maxPolarAngle: 1.5 };

/**
 * Déplace la caméra vers l'objet ouvert, puis la ramène au point de vue d'accueil.
 * Pendant qu'un objet est ouvert, le clic-glisser est coupé : on en sort par « Retour au bureau » ou Échap.
 * back : recul supplémentaire sur écran en hauteur. Animations coupées : changement instantané.
 */
export function CameraRig({ home, back, animated }: { home: Vec3; back: number; animated: boolean }) {
  // On lit caméra et contrôles au moment d'agir (get), pas au rendu : ce sont des objets Three.js qu'on modifie.
  const get = useThree((s) => s.get);
  const ready = useThree((s) => Boolean(s.controls));
  const { focus } = useExploration();
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3; moving: boolean } | null>(null);

  useEffect(() => {
    const { camera, invalidate } = get();
    const controls = get().controls as unknown as Controls | null;
    if (!ready || !controls) return;
    goal.current ??= { pos: new THREE.Vector3(), target: new THREE.Vector3(), moving: false };
    const g = goal.current;
    const view = focus ? viewFor(focus) : null;
    if (view) {
      g.target.set(...view.target);
      // Recul sur écran en hauteur : on s'éloigne le long de l'axe de visée.
      const recul = back > 1 ? (view.portrait ?? back) : 1;
      g.pos.set(...view.pos).sub(g.target).multiplyScalar(recul).add(g.target);
    } else {
      g.pos.set(...home);
      g.target.set(...HOME_TARGET);
    }
    // Objet ouvert : la caméra est pilotée, toutes les bornes sont levées. Au bureau : bornes d'origine.
    controls.enabled = !focus;
    controls.minDistance = focus ? 0.2 : 3.2;
    controls.minAzimuthAngle = focus ? -Infinity : HOME_LIMITS.minAzimuthAngle;
    controls.maxAzimuthAngle = focus ? Infinity : HOME_LIMITS.maxAzimuthAngle;
    controls.minPolarAngle = focus ? 0 : HOME_LIMITS.minPolarAngle;
    controls.maxPolarAngle = focus ? Math.PI : HOME_LIMITS.maxPolarAngle;
    g.moving = true;
    if (!animated) {
      camera.position.copy(g.pos);
      controls.target.copy(g.target);
      controls.update();
      g.moving = false;
    }
    invalidate();
  }, [focus, animated, back, home, get, ready]);

  useFrame(() => {
    const g = goal.current;
    const { camera } = get();
    const controls = get().controls as unknown as Controls | null;
    if (!g || !g.moving || !controls) return;
    camera.position.lerp(g.pos, 0.09);
    controls.target.lerp(g.target, 0.09);
    camera.lookAt(controls.target);
    if (camera.position.distanceTo(g.pos) < 0.004 && controls.target.distanceTo(g.target) < 0.004) {
      camera.position.copy(g.pos);
      controls.target.copy(g.target);
      g.moving = false;
      // De retour au bureau : on rend la main aux contrôles, qui repartent de la position atteinte.
      if (!focus) controls.update();
    }
  });

  return null;
}
