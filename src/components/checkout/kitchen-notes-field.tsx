interface KitchenNotesFieldProps {
  error?: string;
}

export function KitchenNotesField({ error }: KitchenNotesFieldProps) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#eadcc9] sm:p-6">
      <label className="block">
        <span className="block text-sm font-semibold text-[#302016]">
          Kitchen notes <span className="font-normal text-[#765f4c]">(optional)</span>
        </span>
        <textarea
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="No onions, extra spice, ring the bell twice..."
          aria-invalid={Boolean(error)}
          className="mt-2 w-full resize-none rounded-2xl border border-[#eadcc9] bg-[#fffaf2] px-4 py-3 text-sm outline-none transition placeholder:text-[#b49e87] focus-visible:ring-2 focus-visible:ring-[#e2552d]"
        />
      </label>
      {error && (
        <span role="alert" className="mt-1 block text-xs font-medium text-[#b85625]">
          {error}
        </span>
      )}
    </div>
  );
}
