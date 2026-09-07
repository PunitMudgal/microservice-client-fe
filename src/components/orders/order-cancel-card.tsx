"use client";

interface OrderCancelCardProps {
  reason: string;
  isPending: boolean;
  onReasonChange: (next: string) => void;
  onCancel: () => void;
}

export function OrderCancelCard({
  reason,
  isPending,
  onReasonChange,
  onCancel,
}: OrderCancelCardProps) {
  return (
    <section
      aria-labelledby="cancel-order"
      className="rounded-[1.75rem] bg-[#fee9d5] p-6 ring-1 ring-[#f3c9a8]"
    >
      <h2 id="cancel-order" className="font-semibold text-[#302016]">
        Need to cancel?
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[#7a321c]">
        You can cancel only while the kitchen still lists it as pending.
      </p>
      <label className="mt-4 block">
        <span className="sr-only">Cancellation reason</span>
        <textarea
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Optional reason (e.g. ordered by mistake)"
          className="w-full resize-none rounded-2xl border border-transparent bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#b49e87] focus-visible:ring-2 focus-visible:ring-[#e2552d]"
        />
      </label>
      <button
        type="button"
        disabled={isPending}
        onClick={onCancel}
        className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-[#302016] px-6 text-sm font-semibold text-white transition hover:bg-[#4a3223] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Cancelling..." : "Cancel order"}
      </button>
    </section>
  );
}
