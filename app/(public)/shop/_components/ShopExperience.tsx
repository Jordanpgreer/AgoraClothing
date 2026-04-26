"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "@/components/ProductCard";
import EditorialInsert from "./EditorialInsert";
import type { Product } from "@/lib/data";

type ShopProduct = Product & {
  dropSlug: string;
  dropTitle: string;
  dropNumeric: string;
  dropStatus: "upcoming" | "live" | "archived";
};

type DropMeta = {
  slug: string;
  numeric: string;
  title: string;
  status: "upcoming" | "live" | "archived";
};

type Sort = "default" | "price-asc" | "price-desc" | "newest";

export default function ShopExperience({
  products,
  drops,
}: {
  products: ShopProduct[];
  drops: DropMeta[];
}) {
  const [category, setCategory] = useState<string>("All");
  const [dropFilter, setDropFilter] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("default");
  const [showSold, setShowSold] = useState(true);
  const [stickyShown, setStickyShown] = useState(false);

  // Detect when to elevate the sticky filter bar
  useEffect(() => {
    const onScroll = () => setStickyShown(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const visible = useMemo(() => {
    let list = products.slice();
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (dropFilter !== "All") list = list.filter((p) => p.dropSlug === dropFilter);
    if (!showSold) list = list.filter((p) => !p.soldOut);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest") {
      // Sort by drop status priority (live → upcoming → archived) then by drop slug desc
      const order = { live: 0, upcoming: 1, archived: 2 };
      list.sort((a, b) =>
        order[a.dropStatus] - order[b.dropStatus] ||
        b.dropSlug.localeCompare(a.dropSlug),
      );
    }
    return list;
  }, [products, category, dropFilter, sort, showSold]);

  const totalCount = products.length;

  return (
    <>
      <Hero count={totalCount} />

      <div
        className={`sticky top-20 z-30 transition-all duration-500 ${
          stickyShown
            ? "bg-bone/90 backdrop-blur-md border-b border-charcoal/15"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <FilterBar
          categories={categories}
          drops={drops}
          category={category}
          setCategory={setCategory}
          dropFilter={dropFilter}
          setDropFilter={setDropFilter}
          sort={sort}
          setSort={setSort}
          showSold={showSold}
          setShowSold={setShowSold}
          visibleCount={visible.length}
          totalCount={totalCount}
        />
      </div>

      <section className="px-6 md:px-10 py-16 bg-bone min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <ProductGridWithEditorial
            products={visible}
            drops={drops}
          />

          {visible.length === 0 && <EmptyState onReset={() => {
            setCategory("All");
            setDropFilter("All");
            setShowSold(true);
          }} />}
        </div>
      </section>

      <BrowseArchiveCTA />
    </>
  );
}

// ---------- Hero ----------

function Hero({ count }: { count: number }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bone/82" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="label text-charcoal/65 mb-8"
        >
          The Shop
        </motion.p>

        <motion.h1
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="wordmark text-[10vw] md:text-[6.5vw] leading-[0.95] text-ink font-light"
        >
          Every garment,
        </motion.h1>
        <motion.h1
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic text-[12vw] md:text-[8vw] leading-[0.95] text-ink mt-2"
        >
          in one place.
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-charcoal/60 mt-12 mx-auto origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="text-[14px] md:text-[15px] text-charcoal/75 mt-8 max-w-xl mx-auto leading-[1.8]"
        >
          {count} pieces, made in small batches across our drops. Each garment
          is finished by hand and never restocked once it's gone.
        </motion.p>
      </div>
    </section>
  );
}

// ---------- Filter Bar ----------

function FilterBar({
  categories,
  drops,
  category,
  setCategory,
  dropFilter,
  setDropFilter,
  sort,
  setSort,
  showSold,
  setShowSold,
  visibleCount,
  totalCount,
}: {
  categories: string[];
  drops: DropMeta[];
  category: string;
  setCategory: (v: string) => void;
  dropFilter: string;
  setDropFilter: (v: string) => void;
  sort: Sort;
  setSort: (v: Sort) => void;
  showSold: boolean;
  setShowSold: (v: boolean) => void;
  visibleCount: number;
  totalCount: number;
}) {
  return (
    <div className="px-6 md:px-10 py-5">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-between">
          <Pills
            label="Category"
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 label-sm text-charcoal/65 cursor-pointer">
              <input
                type="checkbox"
                checked={showSold}
                onChange={(e) => setShowSold(e.target.checked)}
                className="accent-ink"
              />
              Show sold out
            </label>
            <SortDropdown sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-between">
          <Pills
            label="Drop"
            options={["All", ...drops.filter((d) => d.status !== "upcoming").map((d) => d.slug)]}
            value={dropFilter}
            onChange={setDropFilter}
            renderLabel={(slug) =>
              slug === "All"
                ? "All"
                : (() => {
                    const d = drops.find((x) => x.slug === slug);
                    return d ? `${d.numeric} · ${d.title}` : slug;
                  })()
            }
          />
          <p className="label-sm text-charcoal/55 tabular-nums">
            Showing {visibleCount} / {totalCount}
          </p>
        </div>
      </div>
    </div>
  );
}

function Pills({
  label,
  options,
  value,
  onChange,
  renderLabel,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  renderLabel?: (v: string) => string;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <p className="label-sm text-charcoal/55 mr-1">{label}</p>
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            data-cursor="default"
            className={`label-sm px-3 py-1.5 border transition-colors ${
              active
                ? "bg-ink text-bone border-ink"
                : "bg-transparent text-charcoal/75 border-charcoal/20 hover:border-ink hover:text-ink"
            }`}
          >
            {renderLabel ? renderLabel(o) : o}
          </button>
        );
      })}
    </div>
  );
}

function SortDropdown({ sort, setSort }: { sort: Sort; setSort: (v: Sort) => void }) {
  const labels: Record<Sort, string> = {
    default: "Curated",
    newest: "Newest first",
    "price-asc": "Price ↑",
    "price-desc": "Price ↓",
  };
  return (
    <label className="flex items-center gap-2 label-sm text-charcoal/65">
      Sort
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
        data-cursor="default"
        className="bg-transparent border-b border-charcoal/30 hover:border-ink focus:border-ink outline-none py-1 pr-4 uppercase tracking-[0.2em] text-[11px]"
      >
        {(Object.keys(labels) as Sort[]).map((s) => (
          <option key={s} value={s}>{labels[s]}</option>
        ))}
      </select>
    </label>
  );
}

// ---------- Grid w/ editorial inserts ----------

function ProductGridWithEditorial({
  products,
  drops,
}: {
  products: ShopProduct[];
  drops: DropMeta[];
}) {
  // Insert editorial cards at positions 4 and 11 if there are enough products
  const cells: ({ kind: "p"; product: ShopProduct } | { kind: "e"; key: string; index: number })[] = [];
  let editorialIndex = 0;
  products.forEach((p, i) => {
    cells.push({ kind: "p", product: p });
    if (i === 3 && products.length > 5) cells.push({ kind: "e", key: `e-${i}`, index: editorialIndex++ });
    if (i === 10 && products.length > 12) cells.push({ kind: "e", key: `e-${i}`, index: editorialIndex++ });
  });

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 gap-x-5 md:gap-x-8 gap-y-16 md:gap-y-24"
      >
        {cells.map((cell, i) =>
          cell.kind === "p" ? (
            <motion.div
              key={cell.product.dropSlug + "-" + cell.product.slug}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: (i % 9) * 0.04 }}
            >
              <ShopProductCard product={cell.product} drops={drops} index={i} />
            </motion.div>
          ) : (
            <motion.div
              key={cell.key}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="col-span-2 md:col-span-1"
            >
              <EditorialInsert variant={cell.index} />
            </motion.div>
          ),
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ShopProductCard({
  product,
  drops,
  index,
}: {
  product: ShopProduct;
  drops: DropMeta[];
  index: number;
}) {
  const drop = drops.find((d) => d.slug === product.dropSlug);
  return (
    <div className="group relative">
      <ProductCard product={product} index={index} />
      {drop && (
        <p className="label-sm text-charcoal/55 mt-3 absolute -top-7 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          From Drop {drop.numeric}
        </p>
      )}
    </div>
  );
}

// ---------- Empty state ----------

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-24"
    >
      <p className="font-display italic text-3xl md:text-4xl text-ink/85 mb-6">
        No pieces match.
      </p>
      <p className="text-[14px] text-charcoal/65 max-w-sm mx-auto mb-8 leading-relaxed">
        Try a wider category, or release the drop filter.
      </p>
      <button
        onClick={onReset}
        className="label border-b border-ink pb-1 hover:opacity-60 transition-opacity"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}

// ---------- Browse archive CTA ----------

function BrowseArchiveCTA() {
  return (
    <section className="px-6 md:px-10 pb-32">
      <div className="max-w-7xl mx-auto border-t border-charcoal/15 pt-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="label text-charcoal/65 mb-3">Looking for past drops?</p>
          <p className="wordmark text-2xl md:text-3xl text-ink font-light max-w-md leading-snug">
            Browse the full archive of past volumes.
          </p>
        </div>
        <Link
          href="/drops"
          data-cursor="view"
          className="label text-ink border-b border-ink pb-1 hover:opacity-60 transition-opacity self-start md:self-auto"
        >
          Enter the Archive →
        </Link>
      </div>
    </section>
  );
}
