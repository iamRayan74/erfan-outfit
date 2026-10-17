"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCameraIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Sidebar from "@/features/products/components/sidebar/Sidebar";
import ProductCard from "@/features/products/components/ProductCard";
import SortBar from "@/features/products/components/SortBar";
import ProductCardSkeleton from "@/features/products/components/ProductCardSkeleton";
import { useProductContext } from "@/features/products/hooks/useProductContext";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeVideo, setActiveVideo] = useState(null);

  const {
    products,
    productsCount,
    loading,
    loadingMore,
    hasMore,
    updateFilters,
    resetFilters,
    loadMore,
    filters,
  } = useProductContext();

  const observerRef = useRef(null);

  const getVideoUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `http://localhost:8000${url}`;
  };

  // ✅ تابع کمکی: ساخت و پوش کردن URL جدید
  const pushFiltersToUrl = useCallback(
    (patch) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // حذف پارامترهای تکراری q/search
      const q = params.get("q") || params.get("search");
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
        params.delete("search");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // ✅ سینک کردن پارامترهای URL با Context
  useEffect(() => {
    const queryParam = searchParams.get("q") || searchParams.get("search") || "";
    const idsParam = searchParams.get("ids") || "";
    const categoryParam = searchParams.get("category") || "";
    const sortParam =
      searchParams.get("ordering") || searchParams.get("sort") || "";
    const minPriceParam = searchParams.get("price_min") || "";
    const maxPriceParam = searchParams.get("price_max") || "";
    const colorsParam =
      searchParams.get("colors") || searchParams.get("color_ids") || "";
    const sizesParam = searchParams.get("sizes") || "";

    const currentQ = filters.q ?? filters.search ?? "";

    if (
      currentQ !== queryParam ||
      (filters.ids || "") !== idsParam ||
      (filters.category || "") !== categoryParam ||
      (filters.ordering || "") !== sortParam ||
      (filters.price_min || "") !== minPriceParam ||
      (filters.price_max || "") !== maxPriceParam ||
      (filters.colors || "") !== colorsParam ||
      (filters.sizes || "") !== sizesParam
    ) {
      updateFilters({
        q: queryParam,
        search: queryParam,
        ids: idsParam,
        category: categoryParam,
        ordering: sortParam,
        price_min: minPriceParam,
        price_max: maxPriceParam,
        colors: colorsParam,
        sizes: sizesParam,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading, loadingMore, loadMore]);

  // ✅ هندلرها: Context + URL
  const handleSortChange = (newSort) => {
    updateFilters({ ordering: newSort });
    pushFiltersToUrl({ ordering: newSort });
  };

  const handleCategoryChange = (slug) => {
    updateFilters({ category: slug || "" });
    pushFiltersToUrl({ category: slug || "" });
  };

  const handleColorChange = (colorIds) => {
    updateFilters({ colors: colorIds || "" });
    pushFiltersToUrl({ colors: colorIds || "" });
  };

  const handleSizeChange = (sizeIds) => {
    updateFilters({ sizes: sizeIds || "" });
    pushFiltersToUrl({ sizes: sizeIds || "" });
  };

  const handlePriceChange = (price) => {
    const min = price?.min ?? "";
    const max = price?.max ?? "";
    updateFilters({ price_min: min, price_max: max });
    pushFiltersToUrl({ price_min: min, price_max: max });
  };

  // ✅ پاک کردن جستجو
  const handleClearSearch = () => {
    updateFilters({ q: "", search: "" });
    pushFiltersToUrl({ q: "", search: "" });
  };

  // ✅ ریست کامل فیلترها + پاک کردن URL
  const handleResetAllFilters = () => {
    resetFilters();
    router.push(pathname, { scroll: false });
  };

  const searchQuery = searchParams.get("q") || searchParams.get("search");

  return (
    <div className="min-h-screen bg-stone-100 mt-4 sm:mt-8">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 items-start px-4 sm:px-6">
        {/* سایدبار */}
        <div className="w-full lg:w-72 shrink-0">
          <Sidebar
            filters={filters}
            activeVideo={activeVideo}
            onCloseVideo={() => setActiveVideo(null)}
            currentSort={filters.ordering || "newest"}
            onSortChange={handleSortChange}
            onCategoryChange={handleCategoryChange}
            onColorChange={handleColorChange}
            onPriceChange={handlePriceChange}
            onSizeChange={handleSizeChange}
            onResetFilters={handleResetAllFilters}
          />
        </div>

        {/* ستون اصلی */}
        <div className="flex-1 w-full">
          {searchQuery && (
            <div className="mb-4 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm text-sm font-bold text-stone-700 flex items-center justify-between">
              <div>
                نتایج جستجو برای:{" "}
                <span className="text-primary font-black">
                  «{searchQuery}»
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs text-rose-500 hover:underline font-normal cursor-pointer"
              >
                پاک کردن جستجو
              </button>
            </div>
          )}

          {/* هدر دسکتاپ */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex-1">
              <SortBar
                currentSort={filters.ordering || "newest"}
                onSortChange={handleSortChange}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-secondary font-medium px-1 pb-3 shrink-0">
              <span className="font-rokh font-bold pt-1">تعداد محصولات:</span>
              <span className="font-bold text-primary text-sm">
                {productsCount || 0} محصول
              </span>
            </div>
          </div>

          {/* هدر موبایل */}
          <div className="lg:hidden flex items-center justify-between text-xs text-secondary mb-4 px-1">
            <span className="font-rokh font-bold pt-1">تعداد محصولات:</span>
            <span className="font-fanum font-bold text-primary text-xs">
              {productsCount || 0} محصول
            </span>
          </div>

          {/* لودینگ اولیه یا گرید اصلی */}
          {loading ? (
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 items-start">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-init-${index}`} />
              ))}
            </main>
          ) : products && products.length > 0 ? (
            <>
              <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 items-start">
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id ? `prod-${product.id}` : `prod-idx-${idx}`}
                    product={product}
                    onPlayVideo={(video) => setActiveVideo(video)}
                  />
                ))}

                {loadingMore &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-more-${index}`} />
                  ))}
              </main>

              <div ref={observerRef} className="h-12 w-full mt-4" />
            </>
          ) : (
            <div className="w-full bg-white p-12 rounded-2xl border border-stone-200 text-center text-stone-500 font-medium">
              {searchQuery ? (
                <>هیچ محصولی مطابق با عبارت «{searchQuery}» یافت نشد.</>
              ) : (
                <>محصولی برای نمایش وجود ندارد.</>
              )}
            </div>
          )}
        </div>
      </div>

      {/* مودال ویدیو موبایل */}
      <AnimatePresence>
        {activeVideo && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xs bg-stone-900 rounded-3xl p-4 shadow-2xl z-10 border border-stone-800 text-right overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <VideoCameraIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-stone-200 truncate max-w-[180px]">
                    {activeVideo.title || "ویدیوی معرفی محصول"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-stone-800">
                {activeVideo.videoUrl && (
                  <video
                    key={activeVideo.id || activeVideo.videoUrl}
                    src={getVideoUrl(activeVideo.videoUrl)}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-100 p-8 text-center text-stone-500">
          در حال بارگذاری...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}