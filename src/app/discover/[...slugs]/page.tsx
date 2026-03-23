import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/Sidebar";

const POSTS_PER_PAGE = 12;

function parseSlugs(slugs: string[]): { fullPath: string; page: number } {
  const len = slugs.length;
  if (len >= 2 && slugs[len - 2] === "page") {
    const pageNum = parseInt(slugs[len - 1], 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      return { fullPath: slugs.slice(0, len - 2).join("/"), page: pageNum };
    }
  }
  return { fullPath: slugs.join("/"), page: 1 };
}

interface CategoryPageProps {
  params: Promise<{ slugs: string[] }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slugs } = await params;
  const { fullPath } = parseSlugs(slugs);
  const category = await prisma.category.findUnique({
    where: { fullPath },
    select: { name: true, seoTitle: true, seoDescription: true, description: true },
  });

  if (!category) return {};

  const title = category.seoTitle || category.name;
  const description = category.seoDescription || category.description || "";

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/discover/${fullPath}/` },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slugs } = await params;
  const { fullPath, page } = parseSlugs(slugs);

  const category = await prisma.category.findUnique({
    where: { fullPath },
    include: {
      children: {
        orderBy: { name: "asc" },
        select: { name: true, fullPath: true },
      },
    },
  });

  if (!category) notFound();

  const where = {
    post: { status: "publish" as const },
    categoryId: category.id,
  };

  const totalPosts = await prisma.postCategory.count({ where });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const postCategories = await prisma.postCategory.findMany({
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

  const posts = postCategories.map((pc) => pc.post);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Archive header */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-neutral-600">{category.description}</p>
        )}
        {category.children.length > 0 && (
          <nav className="mt-4 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.fullPath}
                href={`/discover/${child.fullPath}/`}
                className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-600 transition-colors hover:border-brown-700 hover:text-brown-700"
              >
                {child.name}
              </Link>
            ))}
          </nav>
        )}
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
            <p className="text-neutral-500">No posts found in this category.</p>
          )}

          <div className="mt-10">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/discover/${fullPath}/`}
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
