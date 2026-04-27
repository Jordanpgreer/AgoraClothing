import FinanceDashboard from "./_components/FinanceDashboard";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const content = await loadContent();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-sm mb-2 text-charcoal/65">Admin Finance</p>
          <h1 className="wordmark text-2xl font-light text-ink">
            Price drops with a clear view of margin, break-even, and cash.
          </h1>
        </div>
        <div className="max-w-md border border-charcoal/15 bg-white px-4 py-3 text-left md:text-right">
          <p className="label-sm text-charcoal/55">Built For Apparel</p>
          <p className="mt-1 text-sm text-charcoal/75">
            Model vendor costs, print cost, freight, packaging, shipping subsidy,
            fees, discounts, and returns in one place.
          </p>
        </div>
      </div>

      <FinanceDashboard finance={content.adminFinance!} />
    </div>
  );
}
