import type { Metadata } from "next";
import { ProjectCard } from "@/components/classic/ProjectCard";
import { View } from "@/components/classic/View";
import { projects } from "@/content";

export const metadata: Metadata = { title: "Projets" };

export default function Projets() {
  return (
    <View path="projets" title="Projets" lead="Une sélection de ce que j'ai construit.">
      <ul className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </View>
  );
}
