// Buste dessiné en code sur fond transparent, utilisé tant qu'aucune photo n'est fournie
// (ou si elle ne charge pas). Il passe par la même conversion ASCII qu'une vraie photo détourée.

export function drawPlaceholderPortrait(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 200;
  const c = canvas.getContext("2d")!;

  // Lumière venant du haut à gauche.
  const shade = (x0: number, y0: number, x1: number, y1: number) => {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, "#f2f2f2");
    g.addColorStop(1, "#4a4a4a");
    return g;
  };
  const ellipse = (x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient) => {
    c.fillStyle = fill;
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
  };

  ellipse(120, 252, 130, 84, shade(0, 160, 240, 220)); // épaules
  c.fillStyle = "#8c8c8c"; // cou
  c.fillRect(100, 118, 40, 60);
  ellipse(120, 76, 46, 58, shade(70, 20, 180, 150)); // visage
  ellipse(120, 38, 51, 34, "#161616"); // cheveux
  ellipse(77, 70, 9, 36, "#161616");
  ellipse(163, 70, 9, 36, "#161616");
  ellipse(104, 78, 8, 4, "#161616"); // yeux
  ellipse(136, 78, 8, 4, "#161616");
  ellipse(120, 112, 12, 3, "#333"); // bouche
  return canvas;
}
