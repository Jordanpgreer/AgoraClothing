import Image from "next/image";
import Link from "next/link";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DropsAdmin() {
  const { drops } = await loadContent();
  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-sm text-charcoal/65 mb-2">Drops</p>
          <h1 className="wordmark text-2xl text-ink font-light">All volumes</h1>
        </div>
        <Link
          href="/admin/drops/new"
          className="bg-ink text-bone px-5 py-3 label hover:bg-charcoal transition-colors"
        >
          + New Drop
        </Link>
      </div>

      <ul className="space-y-3">
        {drops.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/admin/drops/${d.slug}`}
              className="flex items-center gap-5 border border-charcoal/15 bg-white p-4 hover:border-ink transition-colors"
            >
              <div className="relative w-24 h-16 bg-limestone overflow-hidden flex-shrink-0">
                {d.cover && (
                  <Image src={d.cover} alt={d.title} fill sizes="100px" className="object-cover" unoptimized />
                )}
              </div>
              <div className="flex-1">
                <p className="label-sm text-charcoal/65 mb-1">
                  Drop {d.numeric} · {d.season}
                </p>
                <p className="wordmark text-base text-ink font-light">
                  {d.title}
                </p>
              </div>
              <div className="text-right">
                <p className="label-sm text-charcoal/65 capitalize">
                  {d.status}
                </p>
                <p className="text-[12px] text-charcoal/55 mt-1">
                  {d.products.length} {d.products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>
              <span className="text-charcoal/45 ml-2">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
