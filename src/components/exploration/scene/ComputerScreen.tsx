import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { projects } from "@/content";
import { KINDS, useExploration } from "./store";

// Surface de l'écran de l'ordinateur : une texture dessinée sur un canvas, posée sur le moniteur.
// C'est un vrai morceau de la scène : elle suit le moniteur (agrandissement au survol)
// et le personnage passe devant elle. Les commandes (choix du projet, liens) sont dans le panneau
// « Mes projets » de l'interface ; un clic sur l'écran ouvert passe au projet suivant.
// Au repos : un message d'accueil. Ordinateur ouvert : le projet choisi.

const WIDTH = 0.94;
const HEIGHT = 0.56;
const PX = 1024;
const PY = Math.round((PX * HEIGHT) / WIDTH);

const INK = "#edeae3";
const MUTED = "#a09c92";
const GOLD = "#d9c28f";
const LINE = "#2b2b30";
const BG = "#0c0c0e";

/** Coupe un texte en lignes qui tiennent dans `width`, au plus `max` lignes (la dernière finit par « … »). */
function wrap(c: CanvasRenderingContext2D, text: string, width: number, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (c.measureText(next).width <= width) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === max) break;
  }
  if (line && lines.length < max) lines.push(line);
  if (lines.length === max && lines.join(" ").length < text.length) lines[max - 1] = `${lines[max - 1].replace(/\s+\S*$/, "")} …`;
  return lines;
}

function draw(c: CanvasRenderingContext2D, open: boolean, index: number, seen: number) {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-ascii") || "monospace";
  const font = (weight: number, size: number) => `${weight} ${size}px ${family}, monospace`;
  const pad = 40;
  c.fillStyle = BG;
  c.fillRect(0, 0, PX, PY);
  c.textBaseline = "alphabetic";

  if (!open) {
    c.fillStyle = GOLD;
    c.font = font(700, 48);
    c.fillText("> WELCOME TO", pad, 250);
    c.fillText("  MY WORKSPACE_", pad, 312);
    c.fillStyle = MUTED;
    c.font = font(400, 26);
    c.fillText("$ ls ~/projets", pad, 380);
    return;
  }

  const project = projects[index];
  if (!project) return;

  // En-tête : dossier et découvertes
  c.font = font(400, 24);
  c.fillStyle = MUTED;
  c.fillText("~/projets", pad, 62);
  c.textAlign = "right";
  c.fillText(`${seen}/${KINDS.length} découvertes`, PX - pad, 62);
  c.textAlign = "left";
  c.fillStyle = LINE;
  c.fillRect(pad, 80, PX - pad * 2, 2);

  // Onglets des projets, le projet affiché en doré
  c.font = font(400, 22);
  let x = pad;
  let y = 108;
  projects.forEach((p, i) => {
    const w = c.measureText(p.title).width + 28;
    if (x + w > PX - pad) {
      x = pad;
      y += 52;
    }
    c.strokeStyle = i === index ? GOLD : LINE;
    c.lineWidth = 2;
    c.strokeRect(x, y, w, 40);
    c.fillStyle = i === index ? GOLD : MUTED;
    c.fillText(p.title, x + 14, y + 28);
    x += w + 12;
  });

  // Projet
  y += 90;
  c.fillStyle = GOLD;
  c.font = font(700, 20);
  c.fillText(wrap(c, `${project.year} · ${project.stack.join(" · ")}`.toUpperCase(), PX - pad * 2, 1)[0], pad, y);
  y += 50;
  c.fillStyle = INK;
  c.font = font(700, 38);
  c.fillText(wrap(c, project.title, PX - pad * 2, 1)[0], pad, y);
  c.fillStyle = MUTED;
  c.font = font(400, 25);
  y += 16;
  for (const line of wrap(c, project.description, PX - pad * 2, 5)) {
    y += 36;
    c.fillText(line, pad, y);
  }

  // Pied : position dans la liste
  c.fillStyle = LINE;
  c.fillRect(pad, PY - 70, PX - pad * 2, 2);
  c.font = font(400, 20);
  c.fillStyle = MUTED;
  c.fillText("clic sur l'écran : projet suivant", pad, PY - 34);
  c.textAlign = "right";
  c.fillText(`${index + 1} / ${projects.length}`, PX - pad, PY - 34);
  c.textAlign = "left";
}

/** Redessine la texture (son image est le canvas de l'écran). */
function paint(texture: THREE.CanvasTexture, open: boolean, index: number, seen: number) {
  draw((texture.image as HTMLCanvasElement).getContext("2d")!, open, index, seen);
  texture.needsUpdate = true;
}

/** À placer dans le groupe du moniteur, juste devant la dalle. */
export function ComputerScreen({ position }: { position: [number, number, number] }) {
  const { focus, seen, project } = useExploration();
  const open = focus?.kind === "computer";
  const invalidate = useThree((state) => state.invalidate);

  const texture = useMemo(() => {
    const el = document.createElement("canvas");
    el.width = PX;
    el.height = PY;
    const tex = new THREE.CanvasTexture(el);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);

  useEffect(() => {
    const repaint = () => {
      paint(texture, open, project, seen.length);
      invalidate();
    };
    repaint();
    // La police du site peut finir de charger après le premier dessin.
    document.fonts.ready.then(repaint);
  }, [texture, open, project, seen.length, invalidate]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[WIDTH, HEIGHT]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
