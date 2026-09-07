const steps = ["Bag", "Details", "Done"];

export function CheckoutSteps({ current = 1 }: { current?: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Checkout progress">
      {steps.map((label, index) => {
        const active = index === current;
        const done = index < current;
        return (
          <li key={label} className="flex items-center gap-2">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`h-px w-6 sm:w-10 ${done ? "bg-[#302016]" : "bg-[#eadcc9]"}`}
              />
            )}
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`grid size-7 place-items-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-[#302016] text-white"
                    : active
                      ? "bg-[#e2552d] text-white"
                      : "bg-white text-[#765f4c] ring-1 ring-[#eadcc9]"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={`text-xs font-semibold sm:text-sm ${
                  active ? "text-[#302016]" : "text-[#765f4c]"
                }`}
              >
                {label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
