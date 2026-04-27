export type FinanceLineItem = {
  id: string;
  label: string;
  amount: number;
};

export type AdminFinance = {
  overview: {
    cashOnHand: number;
    pendingPayouts: number;
    monthlyOverhead: number;
    targetMargin: number;
    salesTaxReserve: number;
  };
  scenario: {
    name: string;
    productName: string;
    retailPrice: number;
    shippingCharged: number;
    unitsProduced: number;
    sellThroughRate: number;
    discountRate: number;
    returnRate: number;
    platformFeePercent: number;
    processingFeePercent: number;
    processingFeeFixed: number;
    variableCosts: FinanceLineItem[];
    fixedCosts: FinanceLineItem[];
  };
};

export function cloneAdminFinance(
  finance: AdminFinance = DEFAULT_ADMIN_FINANCE,
): AdminFinance {
  return {
    overview: { ...finance.overview },
    scenario: {
      ...finance.scenario,
      variableCosts: finance.scenario.variableCosts.map((item) => ({ ...item })),
      fixedCosts: finance.scenario.fixedCosts.map((item) => ({ ...item })),
    },
  };
}

export const DEFAULT_ADMIN_FINANCE: AdminFinance = {
  overview: {
    cashOnHand: 12000,
    pendingPayouts: 3800,
    monthlyOverhead: 2400,
    targetMargin: 68,
    salesTaxReserve: 900,
  },
  scenario: {
    name: "Drop Profitability",
    productName: "Heavyweight Tee",
    retailPrice: 92,
    shippingCharged: 8,
    unitsProduced: 180,
    sellThroughRate: 82,
    discountRate: 4,
    returnRate: 3,
    platformFeePercent: 0,
    processingFeePercent: 2.9,
    processingFeeFixed: 0.3,
    variableCosts: [
      { id: "vendor", label: "Vendor / Cut + Sew", amount: 24 },
      { id: "printing", label: "Printing / Decoration", amount: 6.5 },
      { id: "packaging", label: "Packaging / Inserts", amount: 3.2 },
      { id: "inbound", label: "Inbound Freight", amount: 2.4 },
      { id: "outbound", label: "Outbound Shipping Subsidy", amount: 5.5 },
    ],
    fixedCosts: [
      { id: "sampling", label: "Sampling / Development", amount: 850 },
      { id: "shoot", label: "Shoot / Creative", amount: 1200 },
      { id: "marketing", label: "Launch Marketing", amount: 1500 },
    ],
  },
};
