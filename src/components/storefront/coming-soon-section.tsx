import Link from "next/link";

export function ComingSoonSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
      <div className="reveal-section mt-16 overflow-hidden rounded-3xl bg-[#e2552d] px-6 py-10 text-white sm:px-12">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#fff4df]">
              Order now
            </p>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Dinner plans are better with Nesta.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">
              Build a bag, choose dine in, takeaway or delivery, and let the
              kitchen snapshot live prices.
            </p>
          </div>
          <Link
            href="/cart"
            className="w-fit rounded-full bg-[#302016] px-6 py-3 text-sm font-semibold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
          >
            Open your bag
          </Link>
        </div>
      </div>
    </section>
  );
}
