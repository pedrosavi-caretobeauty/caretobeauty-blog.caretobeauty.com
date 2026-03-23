import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { AuthorBio } from "@/components/AuthorBio";
import { TagList } from "@/components/TagList";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
      featuredImage: { select: { url: true } },
    },
  });

  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(post.featuredImage && { images: [post.featuredImage.url] }),
    },
    alternates: {
      canonical: `/${slug}/`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, status: "publish" },
    include: {
      author: true,
      featuredImage: true,
      primaryCategory: true,
      categories: {
        include: { category: true },
      },
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post) notFound();

  const relatedPosts = post.primaryCategory
    ? await prisma.post.findMany({
        where: {
          status: "publish",
          id: { not: post.id },
          categories: {
            some: { categoryId: post.primaryCategory.id },
          },
        },
        orderBy: { publishedAt: "desc" },
        take: 6,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          readingTimeMinutes: true,
          author: { select: { name: true, slug: true } },
          primaryCategory: { select: { name: true, fullPath: true } },
          featuredImage: { select: { url: true, altText: true } },
        },
      })
    : [];

  const categories = post.categories.map((pc) => pc.category);
  const tags = post.tags.map((pt) => pt.tag);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(post.featuredImage && { image: post.featuredImage.url }),
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.lastRevisedAt || post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `/author/${post.author.slug}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "Care to Beauty",
    },
    ...(post.seoDescription && { description: post.seoDescription }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article itemScope itemType="https://schema.org/Article">
        {/* Post header */}
        <header className="mx-auto max-w-6xl px-4 pt-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <Badge
                key={cat.fullPath}
                label={cat.name}
                href={`/discover/${cat.fullPath}/`}
              />
            ))}
          </div>

          <h1
            className="font-serif text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl"
            itemProp="headline"
          >
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <Link
              href={`/author/${post.author.slug}/`}
              className="font-semibold uppercase tracking-wide hover:text-brown-700"
            >
              {post.author.name}
            </Link>
            <span>·</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.lastRevisedAt && (
              <>
                <span>·</span>
                <span>
                  Updated{" "}
                  {post.lastRevisedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
            {post.readingTimeMinutes && (
              <>
                <span>·</span>
                <span>{post.readingTimeMinutes} min read</span>
              </>
            )}
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="mx-auto mt-6 max-w-6xl px-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.altText || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1199px) 100vw, 1152px"
              />
            </div>
          </div>
        )}

        {/* Content + sidebar */}
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            {/* Article body */}
            <div
              className="prose prose-lg max-w-none"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <TagList tags={tags} />
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="mt-8">
              <NewsletterForm />
            </div>

            {/* Author bio */}
            <div className="mt-8">
              <AuthorBio
                name={post.author.name}
                slug={post.author.slug}
                bio={post.author.bio}
                avatarUrl={post.author.avatarUrl}
              />
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-72">
            <Sidebar />
          </aside>
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <h2 className="mb-6 font-serif text-2xl font-semibold">
            Related Posts
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <ArticleCard
                key={rp.slug}
                slug={rp.slug}
                title={rp.title}
                excerpt={rp.excerpt}
                featuredImage={rp.featuredImage}
                category={rp.primaryCategory}
                author={rp.author}
                publishedAt={rp.publishedAt}
                readingTimeMinutes={rp.readingTimeMinutes}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
