"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { lumToAscii, normalize, rgbaToLum } from "./convert";
import { drawPlaceholderPortrait } from "./placeholderPortrait";

// Grille fixe : 64 x 48 caractères. Avec une police à chasse 0,6 em et un interligne de 1,
// cela donne un cadre au format 4:5 (la taille de police suit la largeur, voir .portrait dans globals.css).
const COLS = 64;
const ROWS = 48;

/**
 * Portrait converti en caractères ASCII dans le navigateur.
 * src : photo dans /public (ex. "/portrait.jpg"). null, ou image introuvable : buste provisoire dessiné en code.
 * Réagit au pointeur : halo de lumière, léger décalage, quelques caractères qui varient.
 */
export function AsciiPortrait({ src, alt }: { src: string | null; alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const theme = useTheme();
  const motion = useMotion();

  useEffect(() => {
    const boxEl = box.current;
    const preEl = pre.current;
    if (!boxEl || !preEl) return;

    let alive = true;
    let lum: Float32Array | null = null;
    let pointer: { x: number; y: number } | null = null;
    let tick = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      if (!lum) return;
      preEl.textContent = lumToAscii(lum, COLS, ROWS, {
        invert: theme === "light",
        boost: motion
          ? (x, y) => {
              let delta = 0;
              if (pointer) {
                // Halo : la case du pointeur s'éclaircit, l'effet s'éteint à quelques cases.
                const dx = (x - pointer.x) * 0.6;
                const dy = y - pointer.y;
                delta += 70 * Math.exp(-(dx * dx + dy * dy) / 60);
              }
              // Scintillement : environ 3 % des cases bougent d'un cran à chaque battement.
              const h = Math.sin(x * 127.1 + y * 311.7 + tick * 74.7) * 43758.5453;
              const r = h - Math.floor(h);
              if (r < 0.03) delta += r < 0.015 ? 26 : -26;
              return delta;
            }
          : undefined,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    // Réduit la source à une case par pixel, en la recadrant pour remplir le cadre.
    const load = (source: CanvasImageSource, width: number, height: number) => {
      if (!alive) return;
      const canvas = document.createElement("canvas");
      canvas.width = COLS;
      canvas.height = ROWS;
      const c = canvas.getContext("2d", { willReadFrequently: true });
      if (!c) return;
      const target = 4 / 5;
      const crop = width / height > target ? { w: height * target, h: height } : { w: width, h: width / target };
      c.drawImage(source, (width - crop.w) / 2, (height - crop.h) / 2, crop.w, crop.h, 0, 0, COLS, ROWS);
      lum = normalize(rgbaToLum(c.getImageData(0, 0, COLS, ROWS).data));
      schedule();
    };
    const loadPlaceholder = () => {
      const canvas = drawPlaceholderPortrait(theme === "light");
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
      pointer = { x: nx * COLS, y: ny * ROWS };
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
  }, [src, theme, motion]);

  return (
    <div ref={box} className="portrait">
      <span className="portrait-corner" aria-hidden="true">+</span>
      <span className="portrait-corner" aria-hidden="true">+</span>
      <span className="portrait-corner" aria-hidden="true">+</span>
      <span className="portrait-corner" aria-hidden="true">+</span>
      <pre ref={pre} role="img" aria-label={alt} className="portrait-art" />
    </div>
  );
}
