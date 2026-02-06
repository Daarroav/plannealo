import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CostValue } from "@/lib/cost";

interface CostBreakdownFieldsProps {
  value: CostValue;
  onChange: (value: CostValue) => void;
  title?: string;
}

const currencyOptions = ["MXN", "USD"] as const;

export function CostBreakdownFields({ value, onChange, title = "Costo" }: CostBreakdownFieldsProps) {
  const subtotal = value.breakdown.reduce((total, item) => {
    const amount = Number.parseFloat(item.amount || "0");
    return Number.isFinite(amount) ? total + amount : total;
  }, 0);

  const handleItemChange = (index: number, field: "label" | "amount", nextValue: string) => {
    const next = value.breakdown.map((item, idx) =>
      idx === index ? { ...item, [field]: nextValue } : item
    );
    onChange({ ...value, breakdown: next });
  };

  const handleAddItem = () => {
    onChange({
      ...value,
      breakdown: [...value.breakdown, { label: "", amount: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const next = value.breakdown.filter((_, idx) => idx !== index);
    onChange({ ...value, breakdown: next });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <select
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground sm:w-28"
          value={value.currency}
          onChange={(event) => onChange({ ...value, currency: event.target.value })}
        >
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="cost-total">Costo total</Label>
        <Input
          id="cost-total"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={value.total}
          onChange={(event) => onChange({ ...value, total: event.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Desglose</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
            Agregar concepto
          </Button>
        </div>

        {value.breakdown.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Agrega conceptos para detallar el costo (opcional).
          </p>
        ) : (
          <div className="space-y-2">
            {value.breakdown.map((item, index) => (
              <div key={`cost-item-${index}`} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_auto]">
                <Input
                  placeholder="Concepto"
                  value={item.label}
                  onChange={(event) => handleItemChange(index, "label", event.target.value)}
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={item.amount}
                  onChange={(event) => handleItemChange(index, "amount", event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                >
                  Quitar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Subtotal del desglose</span>
        <span>
          {value.currency} {subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
