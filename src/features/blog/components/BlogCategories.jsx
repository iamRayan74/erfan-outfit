"use client";

export default function BlogCategories({
  categories = [],
  activeCategory = "",
  onCategoryChange,
}) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange?.("")}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            activeCategory === ""
              ? "bg-primary text-primary-content"
              : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
          }`}
        >
          همه
        </button>

        {categories.map((category) => {
          const isActive = activeCategory === category.slug;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange?.(category.slug)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-content"
                  : "border border-border bg-card text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}