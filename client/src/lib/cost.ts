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

    const commaCount = (cleaned.match(/,/g) || []).length;
    const dotCount = (cleaned.match(/\./g) || []).length;
    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");

    let normalized = cleaned;

    if (commaCount > 0 && dotCount > 0) {
      if (lastComma > lastDot) {
        normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
      } else {
        normalized = cleaned.replace(/,/g, "");
      }
    } else if (commaCount > 0) {
      if (commaCount > 1) {
        const parts = cleaned.split(",");
        const lastPart = parts[parts.length - 1] || "";
        if (lastPart.length === 3) {
          normalized = parts.join("");
        } else {
          normalized = `${parts.slice(0, -1).join("")}.${lastPart}`;
        }
      } else {
        const [intPart = "", decPart = ""] = cleaned.split(",");
        normalized = decPart.length === 3 ? `${intPart}${decPart}` : `${intPart}.${decPart}`;
      }
    } else if (dotCount > 0) {
      if (dotCount > 1) {
        const parts = cleaned.split(".");
        const lastPart = parts[parts.length - 1] || "";
        if (lastPart.length === 3) {
          normalized = parts.join("");
        } else {
          normalized = `${parts.slice(0, -1).join("")}.${lastPart}`;
        }
      } else {
        const [intPart = "", decPart = ""] = cleaned.split(".");
        normalized = decPart.length === 3 ? `${intPart}${decPart}` : `${intPart}.${decPart}`;
      }
    }

    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};
