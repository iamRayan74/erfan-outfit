"use client";

import React from "react";
import {
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

export default function CategorySidebar({
  categories = [],
  activeCategory,
  setActiveCategory,
}) {
  const safeCategories = Array.isArray(categories)
    ? categories
    : [];

  return (
    <aside className="w-full rounded-3xl border border-cart-boarder bg-[#EFECE3] p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.12)]">
      {/* Header */}

      <div className="mb-5 flex items-center justify-between border-b border-gray-200/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner shadow-primary/5 transition-all duration-300 hover:rotate-3 hover:scale-105">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-gradient-to-tr from-primary to-primary/60 ring-2 ring-white shadow-lg shadow-primary/30" />
          </div>

          <div>
            <h3 className="text-lg font-semibold leading-tight tracking-tight text-gray-900">
              دسته‌بندی‌ها
            </h3>

            <span className="mt-0.5 block text-[12px] font-medium text-gray-400/80">
              فیلتر بر اساس گروه
            </span>
          </div>
        </div>

        <span className="rounded-full border border-gray-200/30 bg-gray-100/60 px-3 py-1.5 text-[11px] font-bold text-gray-400/80 backdrop-blur-sm">
          {safeCategories.length}
        </span>
      </div>

      {/* Categories */}

      <div className="flex flex-col gap-2">
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
              className={`group relative flex items-center justify-between gap-3 rounded-2xl p-3 transition-[background-color,transform,box-shadow] duration-300 ease-out ${
                active
                  ? "scale-[1.02] -translate-x-0.5 border border-[#e56b6b]/40 bg-primary/30 font-bold text-[#500000] shadow-lg shadow-primary/10"
                  : "border border-transparent bg-white/40 text-gray-600 hover:-translate-x-1 hover:scale-[1.01] hover:bg-white/80 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
              }`}
            >
              {/* Icon */}

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                  active
                    ? "bg-white/20 text-white shadow-inner shadow-white/20 backdrop-blur-md"
                    : "bg-white/80 text-gray-500 shadow-sm shadow-gray-200/50 group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <span className="text-base">
                  {getCategoryIcon(category.id)}
                </span>
              </div>

              {/* Title */}

              <span className="z-10 flex-1 truncate px-1 text-right text-sm font-medium tracking-wide">
                {category.title}
              </span>

              {/* Arrow */}

              <ChevronLeftIcon
                className={`h-4 w-4 shrink-0 transition-all duration-500 ${
                  active
                    ? "translate-x-0 rotate-0 text-white opacity-100"
                    : "-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100"
                }`}
              />

              {/* Highlight */}

              {!active && (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-primary/10" />

                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </>
              )}

              {active && (
                <div className="absolute right-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-l-full bg-white/60 blur-[2px] shadow-lg shadow-white/50" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// =========================================================
// Category Icons
// =========================================================

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