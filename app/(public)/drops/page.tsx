import Image from "next/image";
import Link from "next/link";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Archive · Agora" };

export default async function DropsPage() {
  const { drops } = await loadContent();
  return (
    <section className="px-6 md:px-10 pt-32 pb-32 bg-bone">
      <div className="max-w-7xl mx-auto">
        <p className="label text-charcoal/65 mb-6">Archive</p>
        <h1 className="wordmark text-3xl md:text-5xl mb-20 max-w-3xl text-ink font-light">
          Every drop, in order of appearance.
        </h1>

        <div className="space-y-20">
          {drops.map((d, i) => (
            <Link
              key={d.slug}
              href={`/drops/${d.slug}`}
              className="group grid md:grid-cols-12 gap-8 items-end border-t border-charcoal/15 pt-10"
            >
              <div className="md:col-span-2">
                <p className="wordmark text-charcoal/55 text-sm">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="md:col-span-4">
                <p className="label text-charcoal/65 mb-3">
                  Drop {d.numeric}
                </p>
                <h2 className="wordmark text-2xl md:text-3xl text-ink font-light">
                  {d.title}
                </h2>
                <p className="text-[14px] text-charcoal/70 mt-3 leading-relaxed max-w-sm">
                  {d.subtitle}
                </p>
                <p className="label-sm text-charcoal/55 mt-5">
                  {d.season} · {d.status === "upcoming" ? "Upcoming" : "Archived"}
                </p>
              </div>
              <div className="md:col-span-6 relative aspect-[16/9] overflow-hidden bg-limestone">
                <Image
                  src={d.cover}
                  alt={d.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
