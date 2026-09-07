import { formatPrice } from "@/components/storefront/catalog-utils";
import type { CatalogAddOn } from "@/lib/types";

interface AddonPickerProps {
  addOns: CatalogAddOn[];
  addOnQuantities: Record<string, number>;
  onToggle: (id: string) => void;
}

export function AddonPicker({ addOns, addOnQuantities, onToggle }: AddonPickerProps) {
  if (addOns.length === 0) return null;

  return (
    <section aria-labelledby="addons-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="addons-heading" className="text-sm font-semibold text-[#302016]">
          Make it yours
        </h2>
        <span className="text-xs text-[#765f4c]">Optional extras</span>
      </div>
      <ul className="grid gap-2">
        {addOns.map((addOn) => {
          const selected = (addOnQuantities[addOn.id] ?? 0) > 0;
          return (
            <li key={addOn.id}>
              <button
                type="button"
                onClick={() => onToggle(addOn.id)}
                aria-pressed={selected}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] ${
                  selected
                    ? "border-[#e2552d] bg-[#fff1e8]"
                    : "border-[#eadcc9] bg-white hover:border-[#d8c3ab]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`grid size-5 place-items-center rounded-md border text-xs font-bold ${
                      selected
                        ? "border-[#e2552d] bg-[#e2552d] text-white"
                        : "border-[#d8c3ab] text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="font-semibold text-[#302016]">{addOn.name}</span>
                </span>
                <span className="font-semibold text-[#765f4c]">
                  +{formatPrice(addOn.price)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
