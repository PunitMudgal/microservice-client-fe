import Link from "next/link";

export function ProductErrorState({ message }: { message: string }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
        Dish unavailable
      </p>
      <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-[#302016]">
        {message}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#765f4c]">
        It may have sold out or been removed from the menu. Try another favourite.
      </p>
      <Link
        href="/#menu"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#302016] px-6 text-sm font-semibold text-white"
      >
        ← Back to menu
      </Link>
    </main>
  );
}
