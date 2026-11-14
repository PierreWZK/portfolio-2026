import type { Metadata } from "next";
import { SkillTree } from "@/components/classic/SkillTree";
import { View } from "@/components/classic/View";
import { skillCategories } from "@/content";

export const metadata: Metadata = { title: "Compétences" };

export default function Competences() {
  return (
    <View path="competences" title="Compétences" lead="Ce que je sais faire, par famille.">
      <SkillTree categories={skillCategories} />
    </View>
  );
}
