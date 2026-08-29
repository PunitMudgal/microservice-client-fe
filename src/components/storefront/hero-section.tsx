import type { RefObject } from "react";

interface HeroSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

export function HeroSection({ sectionRef }: HeroSectionProps) {
  return (
    <section
      ref={sectionRef}
      className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 pb-12 pt-8 sm:px-10 sm:pb-16 sm:pt-12 lg:min-h-140 lg:grid-cols-[0.92fr_1.08fr] lg:py-12"
    >
      <div
        aria-hidden="true"
        className="absolute -left-20 top-12 size-40 rounded-full border border-[#e2552d]/15"
      />
      <div className="hero-copy relative z-10 max-w-xl">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <p className="flex items-center gap-2 rounded-full bg-[#fee9d5] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#b6401e]">
            <span className="size-2 rounded-full bg-[#e2552d]" />
            Fresh from the grill
          </p>
          <p className="rounded-full border border-[#eadcc9] bg-white px-3 py-2 text-xs font-semibold text-[#765f4c]">
            Open daily · 11 AM to 11 PM
          </p>
        </div>
        <h1 className="max-w-170 text-balance text-5xl font-bold tracking-tighter text-[#302016] sm:text-6xl lg:text-7xl">
          Big flavour.
          <br />
          <span className="text-[#e2552d]">Zero waiting around.</span>
        </h1>
        <p className="mt-5 max-w-lg text-pretty text-lg text-[#765f4c]">
          Crispy, cheesy and loaded just right. Nesta serves fast food that
          tastes like you had all day to make it.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="#menu"
            className="rounded-full bg-[#e2552d] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_24px_rgba(226,85,45,0.22)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-[#c94724] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2"
          >
            See what is cooking
          </a>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2" aria-hidden="true">
              {["R", "A", "M"].map((letter) => (
                <span
                  key={letter}
                  className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#f4b544] text-xs font-bold"
                >
                  {letter}
                </span>
              ))}
            </div>
            <span className="text-xs leading-5 text-[#765f4c]">
              <strong className="block text-sm text-[#302016]">
                Loved by local foodies
              </strong>
              Fresh plates, happy faces
            </span>
          </div>
        </div>
      </div>

      <div className="hero-art relative mx-auto flex aspect-square w-full max-w-135 items-center justify-center">
        <div className="absolute inset-[7%] rotate-3 rounded-[30%] bg-[#f4b544]" />
        <div className="absolute inset-[14%] -rotate-3 rounded-[32%] bg-[#e2552d]" />
        <span className="absolute left-[2%] top-[14%] z-20 -rotate-6 rounded-2xl bg-white p-3 shadow-[0_14px_32px_rgba(84,47,16,0.14)]">
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#b85625]">
            Stall special
          </span>
          <span className="mt-1 block text-xl font-bold">Hot & cheesy</span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pizza.png"
          alt="Melting Nesta pizza"
          className="relative z-10 w-full object-contain drop-shadow-[0_28px_18px_rgba(86,47,14,0.24)]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pizza-slice.png"
          alt=""
          className="absolute bottom-[-2%] right-[-2%] z-20 w-[30%] rotate-12 object-contain drop-shadow-[0_16px_12px_rgba(86,47,14,0.18)]"
        />
        <span className="absolute bottom-[10%] left-[1%] z-20 rounded-full bg-[#302016] px-4 py-2 text-xs font-semibold text-white shadow-lg">
          Made after you order
        </span>
      </div>
    </section>
  );
}
