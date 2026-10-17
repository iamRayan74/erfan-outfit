"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";

export default function FeaturedArticle({ article }) {
  if (!article) {
    return null;
  }

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-neutral-200 bg-primary/5 shadow-sm transition-all duration-500 hover:border-[#e5c158] hover:shadow-[0_15px_40px_-15px_rgba(229,193,88,0.25)]">
      <div className="grid lg:grid-cols-2">
        {/* Image */}
        <Link
          href={`/blog/${article.slug}`}
          className="relative block min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[430px]"
        >
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center bg-card text-sm text-muted">
              تصویری وجود ندارد
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Featured Badge */}
          <span className="absolute right-5 top-5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-content shadow-lg">
            مقاله منتخب
          </span>

          {/* Read Time */}
          {article.read_time && (
            <span className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <ClockIcon className="h-4 w-4 text-primary" />

              {article.read_time}
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          {/* Category */}
          {article.category && (
            <div className="mb-4">
              <span className="text-sm font-bold text-primary">
                #{article.category}
              </span>
            </div>
          )}

          {/* Title */}
          <Link href={`/blog/${article.slug}`}>
            <h2 className="text-2xl font-black leading-tight text-neutral-800 transition-colors hover:text-primary sm:text-3xl">
              {article.title}
            </h2>
          </Link>

          {/* Summary */}
          {article.summary && (
            <p className="mt-5 line-clamp-4 text-sm leading-8 text-gray-500 sm:text-base">
              {article.summary}
            </p>
          )}

          {/* Meta */}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-primary/10 pt-5 text-xs font-semibold text-gray-400">
            {article.author && (
              <span className="text-neutral-700">
                {article.author}
              </span>
            )}

            {article.date && (
              <>
                <span>•</span>
                <span>{article.date}</span>
              </>
            )}

            {typeof article.views === "number" && (
              <>
                <span>•</span>

                <span className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4 text-amber-500" />

                  {article.views.toLocaleString("fa-IR")}
                </span>
              </>
            )}
          </div>

          {/* Button */}
          <Link
            href={`/blog/${article.slug}`}
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-content transition hover:bg-primary-hover"
          >
            مطالعه مقاله

            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}