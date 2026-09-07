import Link from "next/link";

export function OrderDetailError({ message }: { message: string }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
        Order not found
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#302016]">
        We could not find that order.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#765f4c]">{message}</p>
      <Link
        href="/orders"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#302016] px-6 text-sm font-semibold text-white"
      >
        ← Back to my orders
      </Link>
    </main>
  );
}
