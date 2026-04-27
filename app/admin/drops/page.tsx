import Image from "next/image";
import Link from "next/link";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DropsAdmin() {
  const { drops } = await loadContent();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 label-sm text-charcoal/65">Drops</p>
          <h1 className="wordmark text-2xl font-light text-ink">All volumes</h1>
        </div>
        <Link
          href="/admin/drops/new"
          className="label bg-ink px-5 py-3 text-center text-bone transition-colors hover:bg-charcoal"
        >
          + New Drop
        </Link>
      </div>

      <ul className="space-y-3">
        {drops.map((drop) => (
          <li key={drop.slug}>
            <Link
              href={`/admin/drops/${drop.slug}`}
              className="flex flex-col gap-4 border border-charcoal/15 bg-white p-4 transition-colors hover:border-ink sm:flex-row sm:items-center sm:gap-5"
            >
              <div className="relative h-40 w-full overflow-hidden bg-limestone sm:h-16 sm:w-24 sm:flex-shrink-0">
                {drop.cover && (
                  <Image
                    src={drop.cover}
                    alt={drop.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 96px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="mb-1 label-sm text-charcoal/65">
                  Drop {drop.numeric} · {drop.season}
                </p>
                <p className="wordmark text-base font-light text-ink">{drop.title}</p>
              </div>

              <div className="sm:text-right">
                <p className="label-sm capitalize text-charcoal/65">{drop.status}</p>
                <p className="mt-1 text-[12px] text-charcoal/55">
                  {drop.products.length} {drop.products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>

              <span className="text-charcoal/45 sm:ml-2">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
