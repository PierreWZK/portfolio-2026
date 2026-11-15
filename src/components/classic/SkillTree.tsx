import type { SkillCategory } from "@/content";

// Compétences en arbre : une branche par catégorie, une feuille par compétence.
// Pas de pourcentage ni de barre de progression : seulement une liste organisée.
export function SkillTree({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, i) => (
        <section key={category.name} aria-labelledby={`cat-${i}`}>
          <p className="font-mono text-xs text-muted">
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")} /</span>
          </p>
          <h2 id={`cat-${i}`} className="mt-1 text-xl font-bold">
            {category.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{category.note}</p>
          <ul className="mt-5 font-mono text-sm">
            {category.skills.map((skill, j) => {
              const last = j === category.skills.length - 1;
              return (
                <li key={skill} className="flex gap-2 py-1 leading-snug">
                  <span aria-hidden="true" className="select-none whitespace-pre text-muted">
                    {last ? "└──" : "├──"}
                  </span>
                  <span>{skill}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
