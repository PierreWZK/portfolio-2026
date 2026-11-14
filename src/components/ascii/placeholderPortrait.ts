// Buste dessiné en code, utilisé tant qu'aucune photo n'est fournie (ou si elle ne charge pas).
// Il passe par la même conversion ASCII qu'une vraie photo.
// light : fond blanc pour le thème clair, afin que le fond reste vide une fois converti.

export function drawPlaceholderPortrait(light: boolean): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 250;
  const c = canvas.getContext("2d")!;

  c.fillStyle = light ? "#fff" : "#000";
  c.fillRect(0, 0, 200, 250);

  // Lumière venant du haut à gauche.
  const shade = (x0: number, y0: number, x1: number, y1: number) => {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, light ? "#c4c4c4" : "#fff");
    g.addColorStop(1, light ? "#4a4a4a" : "#555");
    return g;
  };
  const dark = light ? "#111" : "#262626";

  const ellipse = (x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient) => {
    c.fillStyle = fill;
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
  };

  ellipse(100, 292, 118, 86, shade(0, 200, 200, 260)); // épaules
  c.fillStyle = light ? "#777" : "#8c8c8c"; // cou
  c.fillRect(78, 158, 44, 60);
  ellipse(100, 108, 56, 70, shade(40, 40, 170, 190)); // visage
  ellipse(100, 62, 62, 44, dark); // cheveux
  ellipse(47, 100, 11, 44, dark);
  ellipse(153, 100, 11, 44, dark);
  ellipse(80, 110, 9, 5, dark); // yeux
  ellipse(120, 110, 9, 5, dark);
  ellipse(105, 134, 4, 11, light ? "#666" : "#999"); // ombre du nez
  ellipse(100, 152, 15, 3.5, dark); // bouche
  return canvas;
}
