"use client";

import { useState, useTransition } from "react";
import { updateAdminFinance } from "@/lib/actions";
import type { AdminFinance, FinanceLineItem } from "@/lib/admin-finance";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `finance-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

function parseNumber(value: string) {
  const next = Number(value);
  return Number.isFinite(next) ? next : 0;
}

function sum(items: FinanceLineItem[]) {
  return items.reduce((total, item) => total + item.amount, 0);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="label-sm mb-2 block text-[rgba(248,250,252,0.6)]">
      {children}
    </label>
  );
}

function DarkNumberInput({
  value,
  onChange,
  step = 1,
  min,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      step={step}
      onChange={(event) => onChange(parseNumber(event.target.value))}
      className="w-full border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-[#c8a04a] focus:bg-white/8"
    />
  );
}

function DarkTextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-[#c8a04a] focus:bg-white/8"
    />
  );
}

export default function FinanceDashboard({ finance }: { finance: AdminFinance }) {
  const [state, setState] = useState(finance);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  const variableCostTotal = sum(state.scenario.variableCosts);
  const fixedCostTotal = sum(state.scenario.fixedCosts);
  const netProductRevenue = state.scenario.retailPrice * (1 - state.scenario.discountRate / 100);
  const processingFees =
    netProductRevenue * (state.scenario.processingFeePercent / 100) +
    state.scenario.processingFeeFixed;
  const platformFees =
    netProductRevenue * (state.scenario.platformFeePercent / 100);
  const returnsReserve = netProductRevenue * (state.scenario.returnRate / 100);
  const totalRevenuePerOrder = netProductRevenue + state.scenario.shippingCharged;
  const totalVariableCostPerOrder =
    variableCostTotal + processingFees + platformFees + returnsReserve;
  const contributionPerOrder = totalRevenuePerOrder - totalVariableCostPerOrder;
  const contributionMargin =
    totalRevenuePerOrder > 0
      ? (contributionPerOrder / totalRevenuePerOrder) * 100
      : 0;
  const breakEvenUnits =
    contributionPerOrder > 0 ? fixedCostTotal / contributionPerOrder : 0;
  const projectedUnitsSold =
    state.scenario.unitsProduced * (state.scenario.sellThroughRate / 100);
  const projectedRevenue = projectedUnitsSold * totalRevenuePerOrder;
  const projectedVariableSpend = projectedUnitsSold * totalVariableCostPerOrder;
  const projectedProfit =
    projectedRevenue - projectedVariableSpend - fixedCostTotal;
  const projectedMargin =
    projectedRevenue > 0 ? (projectedProfit / projectedRevenue) * 100 : 0;
  const runwayMonths =
    state.overview.monthlyOverhead > 0
      ? (state.overview.cashOnHand + state.overview.pendingPayouts - state.overview.salesTaxReserve) /
        state.overview.monthlyOverhead
      : 0;
  const suggestedPrice =
    totalVariableCostPerOrder /
    (1 - Math.min(state.overview.targetMargin, 95) / 100 || 1);

  const costStack = [
    ...state.scenario.variableCosts.map((item) => ({
      label: item.label,
      amount: item.amount,
    })),
    { label: "Processing Fees", amount: processingFees },
    { label: "Platform Fees", amount: platformFees },
    { label: "Returns Reserve", amount: returnsReserve },
  ].filter((item) => item.amount > 0);

  const stackTotal = costStack.reduce((total, item) => total + item.amount, 0);

  function patchOverview<K extends keyof AdminFinance["overview"]>(
    key: K,
    value: AdminFinance["overview"][K],
  ) {
    setState((current) => ({
      ...current,
      overview: { ...current.overview, [key]: value },
    }));
  }

  function patchScenario<K extends keyof AdminFinance["scenario"]>(
    key: K,
    value: AdminFinance["scenario"][K],
  ) {
    setState((current) => ({
      ...current,
      scenario: { ...current.scenario, [key]: value },
    }));
  }

  function patchLineItem(
    group: "variableCosts" | "fixedCosts",
    id: string,
    field: keyof FinanceLineItem,
    value: string | number,
  ) {
    setState((current) => ({
      ...current,
      scenario: {
        ...current.scenario,
        [group]: current.scenario[group].map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      },
    }));
  }

  function addLineItem(group: "variableCosts" | "fixedCosts") {
    setState((current) => ({
      ...current,
      scenario: {
        ...current.scenario,
        [group]: [
          ...current.scenario[group],
          { id: makeId(), label: "New line item", amount: 0 },
        ],
      },
    }));
  }

  function removeLineItem(group: "variableCosts" | "fixedCosts", id: string) {
    setState((current) => ({
      ...current,
      scenario: {
        ...current.scenario,
        [group]: current.scenario[group].filter((item) => item.id !== id),
      },
    }));
  }

  function save() {
    start(async () => {
      await updateAdminFinance(state);
      setSaved();
    });
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-charcoal/20 bg-[#020617] text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
      <div className="border-b border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(200,160,74,0.18),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,1))] px-6 py-8 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-sm text-[rgba(248,250,252,0.58)]">Finance Control Room</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-white md:text-5xl">
              {state.scenario.name}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[rgba(248,250,252,0.68)]">
              Build a drop-level model around actual apparel costs. Adjust your vendor,
              print, packaging, freight, and shipping assumptions, then see margin and
              break-even update immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="label rounded-full bg-[#c8a04a] px-5 py-3 text-[#14130f] transition hover:bg-[#d7af58] disabled:cursor-wait disabled:opacity-80"
            >
              {pending ? "Saving..." : "Save Finance"}
            </button>
            {saved && <span className="label-sm text-[rgba(248,250,252,0.58)]">Saved.</span>}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Projected Profit"
            value={currency(projectedProfit)}
            detail={`${percent(projectedMargin)} margin at ${Math.round(projectedUnitsSold)} units sold`}
            tone={projectedProfit >= 0 ? "positive" : "negative"}
          />
          <MetricCard
            label="Contribution / Order"
            value={currency(contributionPerOrder)}
            detail={`${percent(contributionMargin)} contribution margin`}
            tone={contributionPerOrder >= 0 ? "positive" : "negative"}
          />
          <MetricCard
            label="Break-Even Units"
            value={breakEvenUnits > 0 ? Math.ceil(breakEvenUnits).toString() : "—"}
            detail="Units needed to recover fixed costs"
          />
          <MetricCard
            label="Cash Runway"
            value={runwayMonths > 0 ? `${runwayMonths.toFixed(1)} mo` : "—"}
            detail="Cash on hand + pending payouts less tax reserve"
          />
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="border-b border-white/8 xl:border-b-0 xl:border-r xl:border-white/8">
          <section className="border-b border-white/8 px-6 py-6 md:px-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="label-sm text-[rgba(248,250,252,0.58)]">Scenario</p>
                <h3 className="mt-2 font-display text-2xl text-white">
                  Order Economics
                </h3>
              </div>
              <p className="text-sm text-[rgba(248,250,252,0.58)]">
                Use this to pressure-test a single product or the hero piece in a drop.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field>
                <SectionLabel>Scenario Name</SectionLabel>
                <DarkTextInput
                  value={state.scenario.name}
                  onChange={(value) => patchScenario("name", value)}
                />
              </Field>
              <Field>
                <SectionLabel>Product</SectionLabel>
                <DarkTextInput
                  value={state.scenario.productName}
                  onChange={(value) => patchScenario("productName", value)}
                />
              </Field>
              <Field>
                <SectionLabel>Retail Price</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.retailPrice}
                  onChange={(value) => patchScenario("retailPrice", value)}
                  step={0.01}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Shipping Charged To Customer</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.shippingCharged}
                  onChange={(value) => patchScenario("shippingCharged", value)}
                  step={0.01}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Units Produced</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.unitsProduced}
                  onChange={(value) => patchScenario("unitsProduced", value)}
                  step={1}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Sell-Through %</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.sellThroughRate}
                  onChange={(value) => patchScenario("sellThroughRate", value)}
                  step={0.1}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Discount %</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.discountRate}
                  onChange={(value) => patchScenario("discountRate", value)}
                  step={0.1}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Return Reserve %</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.returnRate}
                  onChange={(value) => patchScenario("returnRate", value)}
                  step={0.1}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Platform Fee %</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.platformFeePercent}
                  onChange={(value) => patchScenario("platformFeePercent", value)}
                  step={0.1}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Processing Fee %</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.processingFeePercent}
                  onChange={(value) => patchScenario("processingFeePercent", value)}
                  step={0.1}
                  min={0}
                />
              </Field>
              <Field>
                <SectionLabel>Processing Fee Fixed</SectionLabel>
                <DarkNumberInput
                  value={state.scenario.processingFeeFixed}
                  onChange={(value) => patchScenario("processingFeeFixed", value)}
                  step={0.01}
                  min={0}
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-0 lg:grid-cols-2">
            <LineItemEditor
              title="Variable Costs / Order"
              description="Vendor, printing, freight, packaging, shipping subsidy, or any other per-order cost."
              items={state.scenario.variableCosts}
              total={variableCostTotal}
              onAdd={() => addLineItem("variableCosts")}
              onRemove={(id) => removeLineItem("variableCosts", id)}
              onChange={(id, field, value) =>
                patchLineItem("variableCosts", id, field, value)
              }
            />
            <LineItemEditor
              title="Fixed Launch Costs"
              description="Sampling, photography, creative, paid media, or any one-time spend tied to the drop."
              items={state.scenario.fixedCosts}
              total={fixedCostTotal}
              onAdd={() => addLineItem("fixedCosts")}
              onRemove={(id) => removeLineItem("fixedCosts", id)}
              onChange={(id, field, value) =>
                patchLineItem("fixedCosts", id, field, value)
              }
            />
          </section>
        </div>

        <aside className="bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-6 md:px-8">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="label-sm text-[rgba(248,250,252,0.58)]">Business Snapshot</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field>
                  <SectionLabel>Cash On Hand</SectionLabel>
                  <DarkNumberInput
                    value={state.overview.cashOnHand}
                    onChange={(value) => patchOverview("cashOnHand", value)}
                    step={0.01}
                    min={0}
                  />
                </Field>
                <Field>
                  <SectionLabel>Pending Payouts</SectionLabel>
                  <DarkNumberInput
                    value={state.overview.pendingPayouts}
                    onChange={(value) => patchOverview("pendingPayouts", value)}
                    step={0.01}
                    min={0}
                  />
                </Field>
                <Field>
                  <SectionLabel>Monthly Overhead</SectionLabel>
                  <DarkNumberInput
                    value={state.overview.monthlyOverhead}
                    onChange={(value) => patchOverview("monthlyOverhead", value)}
                    step={0.01}
                    min={0}
                  />
                </Field>
                <Field>
                  <SectionLabel>Target Margin %</SectionLabel>
                  <DarkNumberInput
                    value={state.overview.targetMargin}
                    onChange={(value) => patchOverview("targetMargin", value)}
                    step={0.1}
                    min={0}
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <SectionLabel>Sales Tax Reserve</SectionLabel>
                  <DarkNumberInput
                    value={state.overview.salesTaxReserve}
                    onChange={(value) => patchOverview("salesTaxReserve", value)}
                    step={0.01}
                    min={0}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="label-sm text-[rgba(248,250,252,0.58)]">Margin Readout</p>
              <div className="mt-4 space-y-3 text-sm text-[rgba(248,250,252,0.74)]">
                <ReadoutRow label="Net Product Revenue" value={currency(netProductRevenue)} />
                <ReadoutRow label="Shipping Revenue" value={currency(state.scenario.shippingCharged)} />
                <ReadoutRow label="Processing Fees" value={currency(processingFees)} />
                <ReadoutRow label="Platform Fees" value={currency(platformFees)} />
                <ReadoutRow label="Returns Reserve" value={currency(returnsReserve)} />
                <ReadoutRow label="Total Variable Cost / Order" value={currency(totalVariableCostPerOrder)} />
                <ReadoutRow
                  label="Suggested Price At Target Margin"
                  value={Number.isFinite(suggestedPrice) ? currency(suggestedPrice) : "—"}
                  strong
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="label-sm text-[rgba(248,250,252,0.58)]">Cost Stack</p>
                  <p className="mt-2 text-sm text-[rgba(248,250,252,0.68)]">
                    See where each order is getting eaten before profit.
                  </p>
                </div>
                <p className="text-sm text-white">{currency(stackTotal)}</p>
              </div>
              <div className="mt-5 space-y-3">
                {costStack.map((item, index) => {
                  const width = stackTotal > 0 ? (item.amount / stackTotal) * 100 : 0;
                  return (
                    <div key={`${item.label}-${index}`}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs text-[rgba(248,250,252,0.7)]">
                        <span>{item.label}</span>
                        <span>{currency(item.amount)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#c8a04a,#f0d79a)]"
                          style={{ width: `${Math.max(width, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="label-sm text-[rgba(248,250,252,0.58)]">Operator Notes</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[rgba(248,250,252,0.72)]">
                <Insight
                  title="Price Discipline"
                  body={
                    contributionMargin >= state.overview.targetMargin
                      ? "This scenario is above your target contribution margin. Keep discounting tight and protect shipping revenue."
                      : "This scenario is under your target margin. Raise price, reduce shipping subsidy, or renegotiate one of the major production inputs."
                  }
                />
                <Insight
                  title="Launch Risk"
                  body={
                    breakEvenUnits <= projectedUnitsSold
                      ? "Projected sell-through clears break-even. Your fixed creative spend is supportable at the current volume."
                      : "Projected sell-through does not cover fixed launch costs yet. Reduce fixed spend or increase units sold before green-lighting the run."
                  }
                />
                <Insight
                  title="Cash Posture"
                  body={
                    runwayMonths >= 4
                      ? "Current cash posture is healthy for a small drop business. You have room to stage inventory and creative without immediate pressure."
                      : "Cash runway is tight. Delay non-essential spend or collect preorder cash before committing to the full run."
                  }
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "positive" | "negative";
}) {
  const valueClass =
    tone === "positive"
      ? "text-[#9fe870]"
      : tone === "negative"
        ? "text-[#f98b8b]"
        : "text-white";

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
      <p className="label-sm text-[rgba(248,250,252,0.58)]">{label}</p>
      <p className={`mt-4 font-display text-4xl leading-none ${valueClass}`}>{value}</p>
      <p className="mt-3 text-sm text-[rgba(248,250,252,0.66)]">{detail}</p>
    </div>
  );
}

function LineItemEditor({
  title,
  description,
  items,
  total,
  onAdd,
  onRemove,
  onChange,
}: {
  title: string;
  description: string;
  items: FinanceLineItem[];
  total: number;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: keyof FinanceLineItem, value: string | number) => void;
}) {
  return (
    <section className="border-t border-white/8 px-6 py-6 md:px-8 lg:border-t-0 lg:first:border-r lg:first:border-white/8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="label-sm text-[rgba(248,250,252,0.58)]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[rgba(248,250,252,0.68)]">
            {description}
          </p>
        </div>
        <div className="text-right">
          <p className="label-sm text-[rgba(248,250,252,0.48)]">Total</p>
          <p className="mt-2 text-lg text-white">{currency(total)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-[20px] border border-white/8 bg-white/4 p-4 md:grid-cols-[1fr_140px_auto]"
          >
            <div>
              <SectionLabel>Label</SectionLabel>
              <DarkTextInput
                value={item.label}
                onChange={(value) => onChange(item.id, "label", value)}
              />
            </div>
            <div>
              <SectionLabel>Amount</SectionLabel>
              <DarkNumberInput
                value={item.amount}
                onChange={(value) => onChange(item.id, "amount", value)}
                step={0.01}
                min={0}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="label-sm w-full rounded-full border border-white/10 px-4 py-3 text-[rgba(248,250,252,0.72)] transition hover:border-[#f98b8b] hover:text-[#f98b8b]"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="label mt-5 rounded-full border border-[#c8a04a]/40 px-4 py-3 text-[#f0d79a] transition hover:bg-[#c8a04a] hover:text-[#14130f]"
      >
        Add Line Item
      </button>
    </section>
  );
}

function ReadoutRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
      <span className={strong ? "text-white" : ""}>{label}</span>
      <span className={strong ? "text-white" : "text-[rgba(248,250,252,0.84)]"}>
        {value}
      </span>
    </div>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/4 p-4">
      <p className="label-sm text-[#f0d79a]">{title}</p>
      <p className="mt-2">{body}</p>
    </div>
  );
}
