const highlights = [
  "Sizzling hot",
  "Fresh ingredients",
  "Fast friendly service",
  "Made for sharing",
];

export function HighlightsSection() {
  return (
    <section
      className="bg-[#302016] py-4 text-[#fff4df]"
      aria-label="Nesta highlights"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-xs font-semibold uppercase tracking-[0.14em] sm:justify-between sm:px-10">
        {highlights.map((item) => (
          <p key={item} className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-[#f4b544]" />
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
