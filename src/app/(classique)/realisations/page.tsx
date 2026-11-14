import type { Metadata } from "next";
import { RealisationCard } from "@/components/classic/RealisationCard";
import { View } from "@/components/classic/View";
import { realisations } from "@/content";

export const metadata: Metadata = { title: "Réalisations" };

export default function Realisations() {
  return (
    <View path="realisations" title="Réalisations" lead="Ce dont je suis le plus fier.">
      <ul className="grid gap-6 sm:grid-cols-2">
        {realisations.map((realisation) => (
          <li key={realisation.slug} className="flex">
            <RealisationCard realisation={realisation} />
          </li>
        ))}
      </ul>
    </View>
  );
}
