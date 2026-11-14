import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

/** Enveloppe d'une vue du mode classique : en-tête, puis contenu qui apparaît en douceur. */
export function View({
  path,
  title,
  lead,
  children,
}: {
  path: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader path={path} title={title} lead={lead} />
      <div className="view-enter">{children}</div>
    </>
  );
}
