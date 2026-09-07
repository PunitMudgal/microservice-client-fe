import { formatPrice } from "@/components/storefront/catalog-utils";
import type { CatalogVariant } from "@/lib/types";

interface VariantPickerProps {
  variants: CatalogVariant[];
  selectedVariantId: string;
  onSelect: (id: string) => void;
}

export function VariantPicker({ variants, selectedVariantId, onSelect }: VariantPickerProps) {
  if (variants.length === 0) return null;

  return (
    <section aria-labelledby="variant-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="variant-heading" className="text-sm font-semibold text-[#302016]">
          Choose your size
        </h2>
        <span className="text-xs text-[#765f4c]">{variants.length} options</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Size">
        {variants.map((item) => {
          const selected = selectedVariantId === item.id;
          return (
            <button
              type="button"
              key={item.id}
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(item.id)}
              className={`flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] ${
                selected
                  ? "border-[#302016] bg-[#302016] text-white shadow-md"
                  : "border-[#eadcc9] bg-white text-[#302016] hover:-translate-y-0.5 hover:shadow-sm"
              }`}
            >
              <span className="font-semibold">{item.label}</span>
              <span className={`text-sm font-semibold ${selected ? "text-white" : "text-[#765f4c]"}`}>
                {formatPrice(item.price)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
