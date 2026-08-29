const storyBenefits = [
  "Thoughtful recipes",
  "Warm hospitality",
  "Honest ingredients",
  "Made for memories",
];

export function StorySection() {
  return (
    <section
      id="story"
      className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2"
    >
      <div className="reveal-section relative mx-auto max-w-md">
        <div className="absolute -inset-4 rounded-[3rem] bg-[#f4b544]/25" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pizza2.png"
          alt="Nesta pizza ready to share"
          className="relative rounded-[2.5rem] bg-[#f8eee1] p-8"
        />
      </div>
      <div className="reveal-section max-w-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
          A little about Nesta
        </p>
        <h2 className="text-balance text-4xl font-bold tracking-tighter sm:text-5xl">
          Your neighbourhood stall, with a little more swagger.
        </h2>
        <p className="mt-6 text-lg leading-8 text-[#765f4c]">
          Nesta started with a simple idea: food tastes better when it gives
          people a reason to pause, gather, and stay a little longer.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm font-semibold">
          {storyBenefits.map((item) => (
            <p key={item} className="flex items-center gap-2">
              <span className="text-[#b85625]">✓</span>
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
