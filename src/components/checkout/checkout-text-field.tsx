interface CheckoutTextFieldProps {
  label: string;
  name: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export function CheckoutTextField({
  label,
  name,
  error,
  placeholder,
  autoComplete,
  inputMode,
}: CheckoutTextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#302016]">
        {label}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm text-[#302016] outline-none transition placeholder:text-[#b49e87] focus-visible:ring-2 focus-visible:ring-[#e2552d] ${
          error ? "border-[#e2552d]" : "border-[#eadcc9]"
        }`}
      />
      {error && (
        <span role="alert" className="mt-1 block text-xs font-medium text-[#b85625]">
          {error}
        </span>
      )}
    </label>
  );
}
