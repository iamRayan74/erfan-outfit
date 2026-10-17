"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function RelatedArticles({ articles = [] }) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-border pt-10">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-foreground">
          مقالات مرتبط
        </h2>

        <p className="mt-2 text-sm text-muted">
          مطالب مرتبطی که ممکن است برای شما جالب باشند
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group overflow-hidden rounded-[1.5rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:bg-card-hover"
          >
            {/* Image */}
            <Link
              href={`/blog/${article.slug}`}
              className="block"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                    تصویری وجود ندارد
                  </div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="p-5">
              <Link href={`/blog/${article.slug}`}>
                <h3 className="line-clamp-2 text-base font-bold leading-7 text-foreground transition-colors hover:text-primary">
                  {article.title}
                </h3>
              </Link>

              {article.summary && (
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">
                  {article.summary}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                {article.date ? (
                  <span className="text-xs text-muted">
                    {article.date}
                  </span>
                ) : (
                  <span />
                )}

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-transform hover:-translate-x-1"
                >
                  مطالعه

                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}