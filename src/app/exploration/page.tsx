import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Welcome to my workspace" };

const desk = String.raw`
        ___________
       |  _______  |      .---.
       | |       | |     /  |  \
       | |  ...  | |     \  o--/
       | |_______| |      '---'
       |___________|
    ______|_____|________________
   /                             \
  /_______________________________\
   ||                           ||
   ||                           ||
`;

// Le bureau 3D n'existe pas encore : page honnête, sans fausse fonctionnalité.
export default function Exploration() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Mode exploration</p>
      <h1 className="mt-4 text-3xl font-bold uppercase sm:text-5xl">Welcome to my workspace</h1>
      <pre aria-hidden="true" className="mt-6 overflow-hidden font-mono text-xs leading-tight text-muted sm:text-sm">
        {desk}
      </pre>
      <p className="mt-6 max-w-prose text-lg">
        Le bureau interactif en 3D est en cours de construction. Il n&apos;est pas encore visitable.
      </p>
      <p className="mt-3 max-w-prose text-muted">
        Toutes les informations qu&apos;il présentera sont déjà disponibles dans le mode classique.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/about" className="btn btn-primary">
          Mode classique
        </Link>
        <Link href="/" className="btn">
          ← Choix du mode
        </Link>
      </div>
    </main>
  );
}
