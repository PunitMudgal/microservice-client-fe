const testimonials = [
  {
    quote:
      "The crust has the perfect crunch and they never hold back on the toppings.",
    name: "Rhea Kapoor",
    label: "Friday regular",
  },
  {
    quote:
      "Quick enough for lunch, good enough to make me bring friends back for dinner.",
    name: "Arjun Mehta",
    label: "Local foodie",
  },
  {
    quote:
      "The kind of messy, cheesy slice that makes the whole day better.",
    name: "Maya Thomas",
    label: "Nesta neighbour",
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="bg-[#f4b544] px-6 py-16 sm:px-10"
      aria-labelledby="regulars-heading"
    >
      <div className="reveal-section mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7a321c]">
              Word from the counter
            </p>
            <h2
              id="regulars-heading"
              className="text-balance text-3xl font-bold tracking-tighter text-[#302016] sm:text-4xl"
            >
              Our regulars know what is good.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[#65452b]">
            Real favourites, repeat visits and plates that never come back with
            leftovers.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {testimonials.map(({ quote, name, label }, index) => (
            <figure
              key={name}
              className={`rounded-3xl p-6 ${
                index === 1
                  ? "bg-[#e2552d] text-white"
                  : "bg-[#fffaf2] text-[#302016]"
              }`}
            >
              <div
                className="mb-4 flex gap-1 text-sm"
                aria-label="Five out of five stars"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="text-pretty text-lg font-semibold leading-7">
                “{quote}”
              </blockquote>
              <figcaption
                className={`mt-6 text-sm ${
                  index === 1 ? "text-white/75" : "text-[#765f4c]"
                }`}
              >
                <strong className="block text-current">{name}</strong>
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
