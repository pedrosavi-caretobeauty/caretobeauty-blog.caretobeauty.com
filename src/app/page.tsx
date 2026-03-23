import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { LatestPosts } from "@/components/LatestPosts";

const postSelect = {
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  readingTimeMinutes: true,
  author: { select: { name: true, slug: true } },
  primaryCategory: { select: { name: true, fullPath: true } },
  featuredImage: { select: { url: true, altText: true } },
} as const;

const CATEGORY_FILTERS = [
  { label: "Fragrance", fullPath: "beauty/fragrance" },
  { label: "Hair Care", fullPath: "beauty/haircare" },
  { label: "Makeup", fullPath: "beauty/makeup" },
  { label: "Skin Care", fullPath: "beauty/skincare" },
  { label: "Sunscreen", fullPath: "beauty/sunscreen" },
];

export default async function HomePage() {
  // Popular Reads: posts with tag "popular-reads", random order
  const popularTag = await prisma.tag.findUnique({
    where: { slug: "popular-reads" },
  });

  const popularPosts = popularTag
    ? await prisma.post.findMany({
        where: {
          status: "publish",
          tags: { some: { tagId: popularTag.id } },
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
        select: postSelect,
      })
    : [];

  // Latest posts: 8 initial
  const latestPosts = await prisma.post.findMany({
    where: { status: "publish" },
    orderBy: { publishedAt: "desc" },
    take: 8,
    select: postSelect,
  });

  // Serialize dates for client component
  const serializedLatest = latestPosts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Popular Reads */}
      {popularPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold md:text-3xl">
            Popular Reads
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                featuredImage={post.featuredImage}
                category={post.primaryCategory}
                author={post.author}
                publishedAt={post.publishedAt}
                layout="vertical"
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-semibold md:text-3xl">
          Latest
        </h2>

        {/* Category filter labels */}
        <nav className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <Link
              key={cat.fullPath}
              href={`/discover/${cat.fullPath}/`}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-600 transition-colors hover:border-brown-700 hover:text-brown-700"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <LatestPosts initialPosts={serializedLatest} />
      </section>

      {/* Newsletter */}
      <section>
        <NewsletterForm />
      </section>
    </div>
  );
}
