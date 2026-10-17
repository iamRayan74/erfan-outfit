"use client";

import {
  BookmarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function ArticleSidebar({ article }) {
  if (!article) {
    return null;
  }

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.title,
          url,
        });
      } catch {
        // کاربر پنجره اشتراک‌گذاری را بسته است.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard ممکن است در بعضی محیط‌ها در دسترس نباشد.
    }
  };

  const handleBookmark = () => {
    // فعلاً فقط UI است.
    // برای ذخیره واقعی می‌توان localStorage یا API اضافه کرد.
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      {/* Author */}
      {article.author && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            {article.author.avatar ? (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background">
                <UserIcon className="h-6 w-6 text-muted" />
              </div>
            )}

            <div className="min-w-0">
              <p className="font-bold text-foreground">
                {article.author.name}
              </p>

              {article.author.role && (
                <p className="mt-1 text-xs leading-5 text-muted">
                  {article.author.role}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article info */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="space-y-4">
          {article.date && (
            <div className="flex items-center gap-3 text-sm">
              <CalendarDaysIcon className="h-5 w-5 text-primary" />
              <span className="text-muted">{article.date}</span>
            </div>
          )}

          {article.read_time && (
            <div className="flex items-center gap-3 text-sm">
              <ClockIcon className="h-5 w-5 text-primary" />
              <span className="text-muted">{article.read_time}</span>
            </div>
          )}

          {typeof article.views === "number" && (
            <div className="flex items-center gap-3 text-sm">
              <EyeIcon className="h-5 w-5 text-primary" />
              <span className="text-muted">
                {article.views.toLocaleString("fa-IR")} بازدید
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-card-hover"
        >
          <ShareIcon className="h-5 w-5" />
          اشتراک‌گذاری
        </button>

        <button
          type="button"
          onClick={handleBookmark}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-card-hover"
        >
          <BookmarkIcon className="h-5 w-5" />
          ذخیره
        </button>
      </div>

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold text-foreground">برچسب‌ها</h3>

          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-background px-3 py-2 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table of contents */}
      {article.table_of_contents?.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold text-foreground">
            فهرست مطالب
          </h3>

          <ul className="space-y-3">
            {article.table_of_contents.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="text-sm leading-7 text-muted"
              >
                <span className="ml-2 text-primary">
                  {index + 1}.
                </span>

                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}