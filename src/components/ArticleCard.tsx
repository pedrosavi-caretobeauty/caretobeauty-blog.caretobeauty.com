import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  category?: {
    name: string;
    fullPath: string;
  } | null;
  author: {
    name: string;
    slug: string;
  };
  publishedAt: Date | string;
  readingTimeMinutes?: number | null;
  layout?: "horizontal" | "vertical";
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  featuredImage,
  category,
  author,
  publishedAt,
  readingTimeMinutes,
  layout = "horizontal",
}: ArticleCardProps) {
  const date =
    typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;

  if (layout === "vertical") {
    return (
      <article className="flex flex-col">
        {featuredImage && (
          <Link
            href={`/${slug}/`}
            className="relative block overflow-hidden rounded-lg aspect-[4/3]"
          >
            <Image
              src={featuredImage.url}
              alt={featuredImage.altText || title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 575px) 100vw, (max-width: 1023px) 50vw, 25vw"
            />
          </Link>
        )}
        <div className="mt-3 flex flex-col gap-1.5">
          {category && (
            <Badge
              label={category.name}
              href={`/discover/${category.fullPath}/`}
            />
          )}
          <h2 className="font-serif text-lg font-semibold leading-snug">
            <Link
              href={`/${slug}/`}
              className="hover:text-salmon-500 transition-colors"
            >
              {title}
            </Link>
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Link
              href={`/author/${author.slug}/`}
              className="font-semibold uppercase hover:text-brown-700"
            >
              {author.name}
            </Link>
            <span>·</span>
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      {featuredImage && (
        <Link
          href={`/${slug}/`}
          className="relative block shrink-0 overflow-hidden rounded-lg sm:w-56 md:w-64 aspect-[4/3]"
        >
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 575px) 100vw, 256px"
          />
        </Link>
      )}

      <div className="flex flex-col justify-center gap-2">
        {category && (
          <Badge
            label={category.name}
            href={`/discover/${category.fullPath}/`}
          />
        )}

        <h2 className="font-serif text-xl font-semibold leading-snug">
          <Link
            href={`/${slug}/`}
            className="hover:text-salmon-500 transition-colors"
          >
            {title}
          </Link>
        </h2>

        {excerpt && (
          <p className="text-sm text-neutral-600 line-clamp-2">{excerpt}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link
            href={`/author/${author.slug}/`}
            className="font-semibold uppercase hover:text-brown-700"
          >
            {author.name}
          </Link>
          <span>·</span>
          <time dateTime={date.toISOString()}>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          {readingTimeMinutes && (
            <>
              <span>·</span>
              <span>{readingTimeMinutes} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
