"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function BlogHero({ article }) {
  if (!article) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 sm:px-10 lg:px-14">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted">
            <BookOpenIcon className="h-4 w-4" />
            مجله آنلاین مد
          </div>

          <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
            مجله آنلاین مد
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            جدیدترین مطالب دنیای مد، استایل، راهنمای خرید و نگهداری پوشاک
          </p>
        </div>

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
      <div className="grid min-h-[360px] lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-content">
              <SparklesIcon className="h-4 w-4" />
              {article.category}
            </span>

            {article.featured && (
              <span className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted">
                مقاله منتخب
              </span>
            )}
          </div>

          <h1 className="max-w-2xl text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.summary && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {article.summary}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href={`/blog/${encodeURIComponent(article.slug)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-content transition hover:bg-primary-hover"
            >
              مطالعه مقاله
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 text-sm text-muted">
              <span>{article.read_time}</span>
              <span>•</span>
              <span>{article.views?.toLocaleString("fa-IR")} بازدید</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[280px] lg:min-h-full">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <BookOpenIcon className="h-16 w-16 text-muted" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-card lg:bg-gradient-to-l lg:from-transparent lg:via-card/20 lg:to-card" />
        </div>
      </div>
    </section>
  );
}