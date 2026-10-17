"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import useBlog from "@/features/blog/hooks/useBlog";

import BlogHero from "@/features/blog/components/BlogHero";
import BlogCategories from "@/features/blog/components/BlogCategories";
import FeaturedArticle from "@/features/blog/components/FeaturedArticle";
import ArticleGrid from "@/features/blog/components/ArticleGrid";

export default function BlogPage() {
  const {
    articles,
    categories,
    featuredArticle,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading,
  } = useBlog();

  return (
    <main
      dir="rtl"
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Hero */}
        <BlogHero article={null} />

        {/* Search */}
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در بین مقالات..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3.5 pl-4 pr-11 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

            <MagnifyingGlassIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          </div>
        </section>

        {/* Categories */}
        <section>
          <BlogCategories
            categories={categories}
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        {/* Featured */}
        {!loading &&
          featuredArticle &&
          selectedCategory === "" &&
          !searchQuery.trim() && (
            <section className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-foreground sm:text-2xl">
                  مقاله ویژه
                </h2>

                <p className="mt-2 text-sm text-muted">
                  پیشنهاد ویژه ما برای مطالعه
                </p>
              </div>

              <FeaturedArticle article={featuredArticle} />
            </section>
          )}

        {/* Articles */}
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-foreground sm:text-2xl">
                جدیدترین مقالات
              </h2>

              <p className="mt-2 text-sm text-muted">
                مطالب جدید مجله را اینجا دنبال کنید.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-2xl border border-border bg-card"
                />
              ))}
            </div>
          ) : (
            <ArticleGrid articles={articles} />
          )}
        </section>
      </div>
    </main>
  );
}