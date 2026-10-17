"use client";

export default function ArticleContent({ content }) {
  if (!content) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-muted">محتوایی برای این مقاله ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <article
      className="
        article-content
        max-w-none
        text-foreground

        [&_h1]:mb-6
        [&_h1]:mt-10
        [&_h1]:text-3xl
        [&_h1]:font-black
        [&_h1]:leading-tight

        [&_h2]:mb-5
        [&_h2]:mt-10
        [&_h2]:text-2xl
        [&_h2]:font-black
        [&_h2]:leading-tight

        [&_h3]:mb-4
        [&_h3]:mt-8
        [&_h3]:text-xl
        [&_h3]:font-bold

        [&_p]:mb-5
        [&_p]:leading-9
        [&_p]:text-muted

        [&_a]:font-medium
        [&_a]:text-primary
        [&_a]:underline
        [&_a]:underline-offset-4

        [&_ul]:mb-6
        [&_ul]:list-disc
        [&_ul]:space-y-2
        [&_ul]:pr-6
        [&_ul]:text-muted

        [&_ol]:mb-6
        [&_ol]:list-decimal
        [&_ol]:space-y-2
        [&_ol]:pr-6
        [&_ol]:text-muted

        [&_li]:leading-8

        [&_blockquote]:my-8
        [&_blockquote]:rounded-2xl
        [&_blockquote]:border-r-4
        [&_blockquote]:border-primary
        [&_blockquote]:bg-card
        [&_blockquote]:px-6
        [&_blockquote]:py-5
        [&_blockquote]:leading-8
        [&_blockquote]:text-muted

        [&_img]:my-8
        [&_img]:w-full
        [&_img]:rounded-2xl

        [&_strong]:font-bold
        [&_strong]:text-foreground

        [&_hr]:my-10
        [&_hr]:border-border

        [&_table]:my-8
        [&_table]:w-full
        [&_table]:overflow-hidden
        [&_table]:rounded-xl
        [&_table]:border
        [&_table]:border-border

        [&_th]:border-b
        [&_th]:border-border
        [&_th]:bg-card
        [&_th]:p-4
        [&_th]:text-right
        [&_th]:font-bold

        [&_td]:border-b
        [&_td]:border-border
        [&_td]:p-4
        [&_td]:text-muted
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}