"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ClockIcon,
  CalendarIcon,
  EyeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { getArticleBySlug } from "@/features/blog/api/blogApi";

import ArticleContent from "@/features/blog/components/ArticleContent";
import ArticleSidebar from "@/features/blog/components/ArticleSidebar";
import RelatedArticles from "@/features/blog/components/RelatedArticles";

export default function ArticleDetailPage({ params }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadArticle = async () => {
      try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug;

        if (!slug) {
          throw new Error("Article slug is missing");
        }

        const response = await getArticleBySlug(slug);

        const data =
          response?.data !== undefined
            ? response.data
            : response;

        if (!cancelled) {
          setArticle(data);
        }
      } catch (error) {
        console.error("Failed to load article:", error);

        if (!cancelled) {
          setArticle(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /* ---------------------------------------------
     Loading
  --------------------------------------------- */

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl animate-pulse space-y-8">
          {/* Breadcrumb */}
          <div className="h-5 w-48 rounded-lg bg-card" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-6 w-28 rounded-lg bg-card" />
            <div className="h-10 w-3/4 rounded-xl bg-card" />
            <div className="h-5 w-1/2 rounded-lg bg-card" />
          </div>

          {/* Image */}
          <div className="h-64 rounded-3xl bg-card sm:h-96" />

          {/* Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="h-5 rounded-lg bg-card" />
              <div className="h-5 rounded-lg bg-card" />
              <div className="h-5 w-5/6 rounded-lg bg-card" />
              <div className="h-40 rounded-2xl bg-card" />
            </div>

            <div className="space-y-5 lg:col-span-4">
              <div className="h-32 rounded-2xl bg-card" />
              <div className="h-24 rounded-2xl bg-card" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------------------------------------
     Not Found
  --------------------------------------------- */

  if (!article) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center px-4"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card">
            <UserIcon className="h-8 w-8 text-muted" />
          </div>

          <h1 className="mt-5 text-xl font-black text-foreground">
            مقاله پیدا نشد
          </h1>

          <p className="mt-2 text-sm text-muted">
            مقاله موردنظر وجود ندارد یا حذف شده است.
          </p>

          <Link
            href="/blog"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-content transition hover:bg-primary-hover"
          >
            <ArrowRightIcon className="h-4 w-4" />
            بازگشت به مجله
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-muted">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href="/blog"
              className="shrink-0 transition hover:text-foreground"
            >
              مجله
            </Link>

            <span>/</span>

            <span className="truncate font-bold text-foreground">
              {article.title}
            </span>
          </div>

          <Link
            href="/blog"
            className="flex shrink-0 items-center gap-1 font-bold text-muted transition hover:text-foreground"
          >
            <span>بازگشت</span>

            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-5">
          {/* Category */}
          {article.category && (
            <span className="inline-flex w-fit rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground">
              #{article.category}
            </span>
          )}

          {/* Title */}
          <h1 className="max-w-4xl text-2xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {/* Summary */}
          {article.excerpt && (
            <p className="max-w-3xl text-sm leading-8 text-muted sm:text-base">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border pb-5 text-xs font-semibold text-muted">
            {article.author?.name && (
              <span className="flex items-center gap-1.5">
                <UserIcon className="h-4 w-4 text-primary" />

                {article.author.name}
              </span>
            )}

            {article.date && (
              <>
                <span>•</span>

                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />

                  {article.date}
                </span>
              </>
            )}

            {article.read_time && (
              <>
                <span>•</span>

                <span className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />

                  {article.read_time}
                </span>
              </>
            )}

            {typeof article.views === "number" && (
              <>
                <span>•</span>

                <span className="flex items-center gap-1.5">
                  <EyeIcon className="h-4 w-4" />

                  {article.views.toLocaleString("fa-IR")} بازدید
                </span>
              </>
            )}
          </div>
        </header>

        {/* Main Image */}
        {article.image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="min-w-0 lg:col-span-8">
            <ArticleContent content={article.content} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <ArticleSidebar article={article} />
          </div>
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={article.related_articles} />
      </div>
    </main>
  );
}