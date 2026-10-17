"use client";

import ArticleCard from "./ArticleCard";

export default function ArticleGrid({ articles = [] }) {
  if (!articles.length) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
        <p className="text-base font-medium text-foreground">
          مقاله‌ای پیدا نشد.
        </p>

        <p className="mt-2 text-sm text-muted">
          لطفاً دسته‌بندی یا عبارت جستجو را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}