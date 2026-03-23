import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";

interface FeaturedPostCardProps {
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
}

export function FeaturedPostCard({
  slug,
  title,
  excerpt,
  featuredImage,
  category,
  author,
  publishedAt,
}: FeaturedPostCardProps) {
  const date =
    typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;

  return (
    <article className="relative overflow-hidden rounded-xl">
      {featuredImage && (
        <Link href={`/${slug}/`} className="block">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={featuredImage.url}
              alt={featuredImage.altText || title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />
          </div>
        </Link>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        {category && (
          <Badge
            label={category.name}
            href={`/discover/${category.fullPath}/`}
            variant="salmon"
            size="md"
          />
        )}

        <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-white md:text-4xl">
          <Link href={`/${slug}/`} className="hover:underline">
            {title}
          </Link>
        </h2>

        {excerpt && (
          <p className="mt-2 text-sm text-neutral-200 line-clamp-2 md:text-base max-w-2xl">
            {excerpt}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-300">
          <span className="font-semibold uppercase">{author.name}</span>
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
