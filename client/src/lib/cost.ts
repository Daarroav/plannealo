export type CostBreakdownItem = {
  label: string;
  amount: string;
};

export type CostValue = {
  currency: string;
  total: string;
  breakdown: CostBreakdownItem[];
};

export const normalizeCostBreakdown = (value: unknown): CostBreakdownItem[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        label: typeof item?.label === "string" ? item.label : "",
        amount: typeof item?.amount === "string" ? item.amount : item?.amount?.toString?.() || "",
      }))
      .filter((item) => item.label || item.amount);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return normalizeCostBreakdown(parsed);
    } catch {
      return [];
    }
  }

  return [];
};

export const parseCostAmount = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9,.-]/g, "").trim();
    if (!cleaned) return 0;

    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");

    let normalized = cleaned;

    if (lastComma !== -1 && lastDot !== -1) {
      if (lastComma > lastDot) {
        normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
      } else {
        normalized = cleaned.replace(/,/g, "");
      }
    } else if (lastComma !== -1) {
      normalized = cleaned.replace(/,/g, ".");
    }

    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};
