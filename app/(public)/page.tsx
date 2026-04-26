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

export default async function Home() {
  const [content, featured, upcoming, archived] = await Promise.all([
    loadContent(),
    getFeaturedDrop(),
    getUpcomingDrop(),
    getArchivedDrops(),
  ]);
  return (
    <>
      <Hero hero={content.hero} />
      <DropFeature drop={featured} />
      <CountdownStripe drop={upcoming} />
      <Archive drops={archived} />
      <Philosophy data={content.philosophy} />
      <Newsletter data={content.newsletter} />
    </>
  );
}
