import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/Sidebar";

const POSTS_PER_PAGE = 12;

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!tag) return {};

  return {
    title: tag.name,
    openGraph: { title: tag.name },
    alternates: { canonical: `/tag/${slug}/` },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));

  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const where = {
    post: { status: "publish" as const },
    tagId: tag.id,
  };

  const totalPosts = await prisma.postTag.count({ where });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const postTags = await prisma.postTag.findMany({
    where,
    orderBy: { post: { publishedAt: "desc" } },
    skip: (page - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
    select: {
      post: {
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
      },
    },
  });

  const posts = postTags.map((pt) => pt.post);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          {tag.name}
        </h1>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        <section className="min-w-0 flex-1">
          <div className="space-y-8">
            {posts.map((post) => (
              <ArticleCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                featuredImage={post.featuredImage}
                category={post.primaryCategory}
                author={post.author}
                publishedAt={post.publishedAt}
                readingTimeMinutes={post.readingTimeMinutes}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-neutral-500">No posts found with this tag.</p>
          )}

          <div className="mt-10">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/tag/${slug}/`}
            />
          </div>
        </section>

        <aside className="w-full shrink-0 lg:w-72">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
