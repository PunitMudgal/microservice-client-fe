"use client";

import type { OrderType } from "@/lib/types";

const options: { value: OrderType; label: string; hint: string; icon: string }[] = [
  { value: "takeaway", label: "Takeaway", hint: "Pick up at the counter", icon: "🥡" },
  { value: "dine_in", label: "Dine in", hint: "We bring it to your table", icon: "🍽️" },
  { value: "delivery", label: "Delivery", hint: "Send it to your door", icon: "🛵" },
];

interface OrderTypePickerProps {
  value: OrderType;
  onChange: (next: OrderType) => void;
}

export function OrderTypePicker({ value, onChange }: OrderTypePickerProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-[#302016]">
        How should we send this out?
      </legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition focus-within:ring-2 focus-within:ring-[#e2552d] ${
                selected
                  ? "border-[#302016] bg-[#302016] text-white shadow-md"
                  : "border-[#eadcc9] bg-white hover:-translate-y-0.5 hover:shadow-sm"
              }`}
            >
              <input
                type="radio"
                name="orderType"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span aria-hidden="true" className="text-2xl">
                {option.icon}
              </span>
              <span className="mt-2 block font-semibold">{option.label}</span>
              <span
                className={`mt-1 block text-xs leading-relaxed ${
                  selected ? "text-white/75" : "text-[#765f4c]"
                }`}
              >
                {option.hint}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
