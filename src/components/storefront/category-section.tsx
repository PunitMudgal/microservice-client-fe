import { memo } from "react";
import type { CatalogCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CATEGORY_NUMBERS } from "./catalog-utils";
import { SectionHeading } from "./section-heading";
import { Container } from "./storefront-ui";
import { Reveal } from "./reveal";

interface CategorySectionProps {
  categories: CatalogCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

function scrollToMenu() {
  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const CategoryButton = memo(function CategoryButton({
  number,
  label,
  active,
  onSelect,
}: {
  number: string;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex min-h-20 cursor-pointer flex-col justify-between rounded-2xl p-3.5 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2 active:scale-[0.98]",
        active
          ? "bg-[#302016] text-white shadow-md"
          : "bg-white text-[#765f4c] ring-1 ring-[#eadcc9] hover:bg-[#fee9d5] hover:text-[#b85625]",
      )}
    >
      <span className={cn("text-[11px] font-bold tracking-[0.16em]", active ? "text-[#f4b544]" : "opacity-50")}>
        {number}
      </span>
      <span className="line-clamp-2 leading-tight">{label}</span>
    </button>
  );
});

export function CategorySection({ categories, activeCategory, onCategoryChange }: CategorySectionProps) {
  const shown = categories.slice(0, 7);

  const select = (id: string) => {
    onCategoryChange(id);
    if (id !== "all") scrollToMenu();
  };

  return (
    <section className="py-12 sm:py-16" aria-labelledby="categories-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="categories-heading"
            eyebrow="Find your favourite"
            title="What are you craving?"
          />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
            <CategoryButton
              number="00"
              label="All dishes"
              active={activeCategory === "all"}
              onSelect={() => select("all")}
            />
            {shown.map((category, index) => (
              <CategoryButton
                key={category.id}
                number={CATEGORY_NUMBERS[index % CATEGORY_NUMBERS.length]}
                label={category.name}
                active={activeCategory === category.id}
                onSelect={() => select(category.id)}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
