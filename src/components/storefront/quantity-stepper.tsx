"use client";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  small?: boolean;
  onChange: (next: number) => void;
  label: string;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 50,
  small = false,
  onChange,
  label,
}: QuantityStepperProps) {
  const size = small ? "size-9 text-base" : "size-11 text-lg";
  return (
    <div
      className={`inline-flex items-center rounded-full bg-white ring-1 ring-[#eadcc9] ${
        small ? "p-0.5" : "p-1"
      }`}
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`grid ${size} cursor-pointer place-items-center rounded-full font-semibold text-[#302016] transition hover:bg-[#f8eee1] disabled:cursor-not-allowed disabled:opacity-30`}
      >
        −
      </button>
      <span
        aria-live="polite"
        className={`min-w-8 text-center font-semibold tabular-nums ${
          small ? "text-sm" : "text-base"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`grid ${size} cursor-pointer place-items-center rounded-full font-semibold text-[#302016] transition hover:bg-[#f8eee1] disabled:cursor-not-allowed disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}
