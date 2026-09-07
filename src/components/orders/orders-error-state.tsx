"use client";

interface OrdersErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function OrdersErrorState({ message, onRetry }: OrdersErrorStateProps) {
  return (
    <div className="mt-8 rounded-[1.75rem] bg-[#f8eee1] p-8 text-center ring-1 ring-[#eadcc9] sm:p-10">
      <p className="font-semibold text-[#302016]">We could not load your orders.</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#765f4c]">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 cursor-pointer rounded-full bg-[#302016] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a3223]"
      >
        Try again
      </button>
    </div>
  );
}
