import { Typed } from "@/components/common/Typed";

/** En-tête d'une vue : chemin façon terminal (repère de la page courante) et titre tapé. */
export function PageHeader({ path, title, lead }: { path: string; title: string; lead?: string }) {
  return (
    <header className="mb-8 sm:mb-12">
      <p className="font-mono text-xs text-muted">
        <span aria-hidden="true" className="text-gold">$ </span>
        cd ~/{path}
      </p>
      <Typed text={title} className="mt-3 text-3xl leading-tight font-bold uppercase sm:text-5xl sm:leading-tight" />
      {lead && <p className="mt-4 max-w-prose text-lg text-muted">{lead}</p>}
    </header>
  );
}
