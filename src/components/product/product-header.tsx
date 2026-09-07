interface ProductHeaderProps {
  name: string;
  description?: string | null;
  categoryName?: string;
}

export function ProductHeader({ name, description, categoryName }: ProductHeaderProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
        {categoryName ?? "From the Nesta kitchen"}
      </p>
      <h1 className="text-balance text-4xl font-bold tracking-tighter text-[#302016] sm:text-5xl">
        {name}
      </h1>
      <p className="mt-4 text-pretty text-base leading-relaxed text-[#765f4c] sm:text-lg">
        {description ||
          "A Nesta favourite, prepared with thoughtful ingredients and served fresh."}
      </p>
    </div>
  );
}
