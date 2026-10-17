"use client";

import React from "react";

export default function CategoryMobileFilter({
  categories = [],
  activeCategory,
  setActiveCategory,
}) {
  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  return (
    <div className="mb-4 lg:hidden">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl border border-cart-boarder bg-[#EFECE3] p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        {safeCategories.map((category) => {
          const active =
            category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                if (setActiveCategory) {
                  setActiveCategory(category.id);
                }
              }}
              className={`flex shrink-0 cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold backdrop-blur-sm transition-all duration-300 ${
                active
                  ? "scale-[1.02] border border-[#e56b6b]/40 bg-primary/30 text-[#500000] shadow-lg shadow-primary/10"
                  : "border border-transparent bg-white/40 text-gray-600 hover:bg-white/80 hover:text-primary"
              }`}
            >
              <span className="text-sm">
                {getCategoryIcon(category.id)}
              </span>

              <span>{category.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getCategoryIcon(categoryId) {
  switch (categoryId) {
    case "all":
      return "◈";

    case "men-clothing":
      return "👔";

    case "women-clothing":
      return "✦";

    case "bags-shoes":
      return "👜";

    case "kids-clothing":
      return "♡";

    case "accessories":
      return "✧";

    default:
      return "•";
  }
}