"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { sections } from "@/lib/nav";

/** Header fixe du mode classique : rubriques, thème, accès au mode exploration. */
export function Header({ brand }: { brand: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Échap ferme le menu mobile.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = sections.map((s) => {
    const active = pathname === s.href || pathname.startsWith(`${s.href}/`);
    return (
      <li key={s.href}>
        <Link
          href={s.href}
          aria-current={active ? "page" : undefined}
          onClick={() => setOpen(false)}
          className="nav-link"
        >
          {s.label}
        </Link>
      </li>
    );
  });

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <a href="#contenu" className="btn btn-primary sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-8">
        <Link href="/about" onClick={() => setOpen(false)} className="min-w-0 truncate font-mono text-sm font-bold uppercase tracking-widest">
          <span aria-hidden="true" className="text-gold">&gt;_ </span>
          {brand}
        </Link>

        <nav aria-label="Rubriques" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-5">{links}</ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-0">
          <ThemeToggle />
          <Link href="/exploration" className="btn hidden sm:inline-flex">
            Exploration
          </Link>
          <button
            type="button"
            className="btn xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen(!open)}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Rubriques"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-line bg-bg px-4 pb-4 sm:px-8 xl:hidden"
        >
          <ul className="flex flex-col">{links}</ul>
          <Link href="/exploration" onClick={() => setOpen(false)} className="btn mt-3 sm:hidden">
            Mode exploration
          </Link>
        </nav>
      )}
    </header>
  );
}
