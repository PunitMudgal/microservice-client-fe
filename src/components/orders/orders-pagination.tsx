"use client";

interface OrdersPaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function OrdersPagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: OrdersPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Orders pagination"
      className="mt-8 flex items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={onPrevious}
        className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#302016] ring-1 ring-[#eadcc9] transition hover:bg-[#fff4e6] disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>
      <span className="text-sm tabular-nums text-[#765f4c]">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={onNext}
        className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#302016] ring-1 ring-[#eadcc9] transition hover:bg-[#fff4e6] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  );
}
