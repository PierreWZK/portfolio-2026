import Image from "next/image";

// Écran de la carte : capture du projet si elle existe, sinon un écran dessiné en ASCII.
// Le dessin est décoratif (aria-hidden) : le titre est porté par la carte.
const SCREEN = [
  "+------------------------------+",
  "| (o) (o) (o)             _  X |",
  "+------------------------------+",
  "|                              |",
  "|  > _                         |",
  "|                              |",
  "|  ____________________        |",
  "|  ________   __________       |",
  "|                              |",
  "|  ##########      ######      |",
  "|  ##########      ######      |",
  "|                              |",
  "+------------------------------+",
].join("\n");

export function CaptureFrame({
  image,
  sizes = "(min-width: 640px) 50vw, 100vw",
}: {
  image?: { src: string; alt: string };
  sizes?: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden border-b border-line bg-surface">
      {image ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
          <pre className="font-mono text-[9px] leading-tight text-muted sm:text-xs">{SCREEN}</pre>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">capture à venir</p>
        </div>
      )}
    </div>
  );
}
