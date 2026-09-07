interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-balance text-4xl font-bold tracking-tighter text-[#302016] sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-pretty text-base leading-relaxed text-[#765f4c]">
          {description}
        </p>
      )}
    </div>
  );
}
