import Hero from "@/components/sections/Hero";
import DropFeature from "@/components/sections/DropFeature";
import CountdownStripe from "@/components/sections/CountdownStripe";
import Archive from "@/components/sections/Archive";
import Philosophy from "@/components/sections/Philosophy";
import Newsletter from "@/components/sections/Newsletter";
import {
  loadContent,
  getFeaturedDrop,
  getUpcomingDrop,
  getArchivedDrops,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = loadContent();
  return (
    <>
      <Hero hero={content.hero} />
      <DropFeature drop={getFeaturedDrop()} />
      <CountdownStripe drop={getUpcomingDrop()} />
      <Archive drops={getArchivedDrops()} />
      <Philosophy data={content.philosophy} />
      <Newsletter data={content.newsletter} />
    </>
  );
}
