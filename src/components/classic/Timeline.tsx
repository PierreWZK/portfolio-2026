import type { Formation } from "@/content";

/** Parcours en timeline verticale : date, nom, établissement, description, compétences. */
export function Timeline({ items }: { items: Formation[] }) {
  return (
    <ol className="relative ml-2 space-y-10 border-l border-line pl-8 sm:ml-4 sm:pl-12">
      {items.map((f) => (
        <li key={f.slug} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[37px] top-1 flex h-4 w-4 items-center justify-center bg-bg font-mono text-xs leading-none text-gold sm:-left-[53px]"
          >
            ●
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            <time>{f.dates}</time>
          </p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">{f.name}</h2>
          <p className="mt-1 text-muted">{f.school}</p>
          <p className="mt-3 max-w-prose">{f.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2 font-mono text-xs text-muted" aria-label="Compétences acquises">
            {f.skills.map((skill) => (
              <li key={skill} className="border border-line px-2 py-1">
                {skill}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
