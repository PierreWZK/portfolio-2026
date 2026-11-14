"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useMotion } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { cellsToAscii, normalize, rgbaToCells, type Cells } from "./convert";
import { drawPlaceholderPortrait } from "./placeholderPortrait";

// Chasse d'un caractère de la police ASCII, en em. Avec un interligne de 1, une case fait 0,6 x 1 em.
const CHAR_WIDTH = 0.6;

/**
 * Portrait converti en caractères ASCII dans le navigateur, sans cadre.
 * src : image dans /public, idéalement un PNG à fond transparent (voir scripts/cutout.mjs) :
 *       seul le sujet est dessiné. null, ou image introuvable : buste provisoire dessiné en code.
 * cols : nombre de caractères en largeur ; la hauteur suit les proportions de l'image.
 * Réagit au pointeur : halo de lumière, léger décalage, quelques caractères qui varient.
 */
export function AsciiPortrait({ src, alt, cols = 100 }: { src: string | null; alt: string; cols?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const theme = useTheme();
  const motion = useMotion();

  useEffect(() => {
    const boxEl = box.current;
    const preEl = pre.current;
    if (!boxEl || !preEl) return;

    let alive = true;
    let cells: Cells | null = null;
    let rows = 0;
    let pointer: { x: number; y: number } | null = null;
    let tick = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      if (!cells) return;
      preEl.textContent = cellsToAscii(cells, cols, rows, {
        invert: theme === "light",
        boost: motion
          ? (x, y) => {
              let delta = 0;
              if (pointer) {
                // Halo : la case du pointeur s'éclaircit, l'effet s'éteint à quelques cases.
                const dx = (x - pointer.x) * CHAR_WIDTH;
                const dy = y - pointer.y;
                delta += 80 * Math.exp(-(dx * dx + dy * dy) / 90);
              }
              // Scintillement : environ 3 % des cases bougent d'un cran à chaque battement.
              const h = Math.sin(x * 127.1 + y * 311.7 + tick * 74.7) * 43758.5453;
              const r = h - Math.floor(h);
              if (r < 0.03) delta += r < 0.015 ? 20 : -20;
              return delta;
            }
          : undefined,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    // Réduit la source à une case par pixel. La hauteur en cases suit les proportions de l'image.
    const load = (source: CanvasImageSource, width: number, height: number) => {
      if (!alive || !width || !height) return;
      rows = Math.max(1, Math.round((cols * CHAR_WIDTH * height) / width));
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const c = canvas.getContext("2d", { willReadFrequently: true });
      if (!c) return;
      c.drawImage(source, 0, 0, cols, rows);
      cells = normalize(rgbaToCells(c.getImageData(0, 0, cols, rows).data));
      boxEl.style.aspectRatio = `${cols * CHAR_WIDTH} / ${rows}`;
      schedule();
    };
    const loadPlaceholder = () => {
      const canvas = drawPlaceholderPortrait();
      load(canvas, canvas.width, canvas.height);
    };

    if (src) {
      const img = new Image();
      img.onload = () => load(img, img.naturalWidth, img.naturalHeight);
      img.onerror = loadPlaceholder;
      img.src = src;
    } else {
      loadPlaceholder();
    }

    const onMove = (e: PointerEvent) => {
      if (!motion) return;
      const rect = boxEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      pointer = { x: nx * cols, y: ny * rows };
      // Parallaxe : -1..1 autour du centre, lu par le CSS.
      boxEl.style.setProperty("--px", String(nx * 2 - 1));
      boxEl.style.setProperty("--py", String(ny * 2 - 1));
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      boxEl.style.setProperty("--px", "0");
      boxEl.style.setProperty("--py", "0");
      schedule();
    };
    boxEl.addEventListener("pointermove", onMove);
    boxEl.addEventListener("pointerleave", onLeave);

    const shimmer = motion
      ? window.setInterval(() => {
          if (document.hidden) return;
          tick++;
          schedule();
        }, 450)
      : 0;

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      clearInterval(shimmer);
      boxEl.removeEventListener("pointermove", onMove);
      boxEl.removeEventListener("pointerleave", onLeave);
    };
  }, [src, cols, theme, motion]);

  return (
    <div ref={box} className="portrait" style={{ "--cols": cols } as CSSProperties}>
      <pre ref={pre} role="img" aria-label={alt} className="portrait-art" />
    </div>
  );
}
