const tagline = "Good food brings the whole table closer.";

export function TaglineSection() {
  return (
    <section className="reveal-section mx-auto max-w-5xl px-6 py-16 text-center sm:px-10">
      <p className="text-balance text-4xl font-bold tracking-tighter text-[#302016] sm:text-6xl">
        {tagline.split(" ").map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="tagline-word mr-[0.22em] inline-block"
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
