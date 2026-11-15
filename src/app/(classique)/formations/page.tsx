import type { Metadata } from "next";
import { Timeline } from "@/components/classic/Timeline";
import { View } from "@/components/classic/View";
import { formations } from "@/content";

export const metadata: Metadata = { title: "Formations" };

export default function Formations() {
  return (
    <View path="formations" title="Formations" lead="Mon parcours, du plus récent au plus ancien.">
      <Timeline items={formations} />
    </View>
  );
}
