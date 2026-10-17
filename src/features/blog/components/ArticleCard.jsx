"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ClockIcon,
  UserIcon,
  EyeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

export default function ArticleCard({ article }) {
  if (!article) {
    return null;
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-neutral-200 bg-primary/5 p-3.5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#e5c158] hover:bg-primary/10 hover:shadow-[0_15px_30px_-10px_rgba(229,193,88,0.22)]"
    >
      <div className="flex flex-1 flex-col">
        {/* Image */}
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-black/20 shadow-md">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card text-sm text-muted">
              تصویری وجود ندارد
            </div>
          )}

          {/* Category */}
          {article.category && (
            <div className="absolute right-3 top-3 z-20 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
              <span className="ml-1 text-primary">#</span>
              {article.category}
            </div>
          )}

          {/* Read Time */}
          {article.read_time && (
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
              <ClockIcon className="h-3 w-3 text-primary" />

              <span>{article.read_time}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between space-y-2 pt-4">
          <div className="space-y-2">
            {/* Author + Views */}
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
              {article.author && (
                <span className="flex min-w-0 items-center gap-1 text-[#6E6868]">
                  <UserIcon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />

                  <span className="truncate">
                    {article.author}
                  </span>
                </span>
              )}

              {typeof article.views === "number" && (
                <span className="flex flex-shrink-0 items-center gap-1">
                  <EyeIcon className="h-3.5 w-3.5 text-amber-500" />

                  {article.views.toLocaleString("fa-IR")}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-neutral-800 transition-colors group-hover:text-primary">
              {article.title}
            </h3>
          </div>

          {/* Summary */}
          {article.summary && (
            <p className="mt-auto line-clamp-2 text-xs font-medium leading-relaxed text-gray-500">
              {article.summary}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex flex-shrink-0 items-center justify-between border-t border-primary/10 pt-4">
        <span className="text-[11px] font-bold text-gray-400">
          {article.date}
        </span>

        <div className="flex items-center gap-1.5 text-xs font-bold text-primary transition-transform duration-300 group-hover:-translate-x-1">
          <span>ادامه مطلب</span>

          <ArrowLeftIcon className="h-3.5 w-3.5 stroke-[2.5]" />
        </div>
      </div>
    </Link>
  );
}