import type { CatalogCategory } from "@/lib/types";
import { CATEGORY_NUMBERS } from "./catalog-utils";
import { SectionHeading } from "./section-heading";

interface CategorySectionProps {
  categories: CatalogCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategorySection({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySectionProps) {
  const selectCategory = (categoryId: string) => {
    onCategoryChange(categoryId);
    if (categoryId !== "all") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-16 sm:px-10"
      aria-labelledby="categories-heading"
    >
      <div className="reveal-section">
        <SectionHeading
          eyebrow="Find your favourite"
          title="What are you craving today?"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={`category-pill ${activeCategory === "all" ? "active" : ""}`}
          >
            <span className="category-number">00</span>
            All dishes
          </button>
          {categories.slice(0, 7).map((category, index) => (
            <button
              type="button"
              key={category.id}
              onClick={() => selectCategory(category.id)}
              className={`category-pill ${activeCategory === category.id ? "active" : ""}`}
            >
              <span className="category-number">
                {CATEGORY_NUMBERS[index % CATEGORY_NUMBERS.length]}
              </span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
