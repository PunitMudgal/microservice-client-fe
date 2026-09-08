export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-label="Nesta intro">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-2 lg:pb-20 lg:pt-14">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#fee9d5] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#b6401e]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e2552d] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#e2552d]" />
              </span>
              Fresh from the grill
            </p>
            <p className="rounded-full border border-[#eadcc9] bg-white px-3 py-1.5 text-xs font-semibold text-[#765f4c]">
              Open daily · 11 AM – 11 PM
            </p>
          </div>

          <h1 className="mt-5 text-balance text-5xl font-bold leading-[1.02] tracking-tighter text-[#302016] sm:text-6xl lg:text-7xl">
            Big flavour.
            <br />
            <span className="text-[#e2552d]">Zero waiting.</span>
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-lg leading-7 text-[#765f4c]">
            Crispy, cheesy and loaded just right. Nesta serves fast food that
            tastes slow-made.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#menu"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e2552d] px-7 text-base font-semibold text-white shadow-[0_12px_28px_rgba(226,85,45,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c94724] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2 active:translate-y-0"
            >
              See what&apos;s cooking
            </a>
            <a
              href="#popular"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#eadcc9] bg-white px-7 text-base font-semibold text-[#302016] transition-colors hover:border-[#302016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#302016] focus-visible:ring-offset-2"
            >
              Popular dishes
            </a>
          </div>

          <dl className="mt-8 flex divide-x divide-[#eadcc9]">
            {[
              ["15 min", "avg. prep"],
              ["4.8 ★", "2k+ ratings"],
              ["100%", "made fresh"],
            ].map(([value, label]) => (
              <div key={label} className="pr-6 pl-6 first:pl-0 last:pr-0">
                <dt className="sr-only">{label}</dt>
                <dd className="text-xl font-bold tabular-nums text-[#302016]">{value}</dd>
                <dd className="text-xs font-medium text-[#ab957f]">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <div aria-hidden="true" className="absolute inset-[6%] rounded-[3rem] bg-[#f7d38f]/40" />
          <div aria-hidden="true" className="absolute inset-[12%] rounded-[3rem] bg-[#fa8c6e]/30" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pizza.png"
            alt="Melting Nesta pizza"
            width={1080}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="relative z-10 aspect-square w-full object-contain drop-shadow-[0_28px_24px_rgba(86,47,14,0.25)]"
          />
          <div className="absolute left-2 top-6 z-20 -rotate-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:left-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b85625]">
              Stall special
            </p>
            <p className="text-lg font-bold text-[#302016]">Hot &amp; cheesy</p>
          </div>
          <p className="absolute bottom-6 right-2 z-20 rounded-full bg-[#302016]/90 px-4 py-2 text-xs font-semibold text-white shadow-lg sm:right-0">
            Made when you order
          </p>
        </div>
      </div>
    </section>
  );
}
