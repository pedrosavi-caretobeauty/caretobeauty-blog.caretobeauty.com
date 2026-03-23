import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";

const POSTS_PER_PAGE = 12;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await prisma.author.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!author) return {};

  return {
    title: author.name,
    description: `Articles by ${author.name} on Care to Beauty Blog.`,
    openGraph: { title: author.name },
    alternates: { canonical: `/author/${slug}/` },
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));

  const author = await prisma.author.findUnique({ where: { slug } });
  if (!author) notFound();

  const totalPosts = await prisma.post.count({
    where: { status: "publish", authorId: author.id },
  });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const posts = await prisma.post.findMany({
    where: { status: "publish", authorId: author.id },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
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
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Author header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brown-100 text-2xl font-semibold text-brown-700">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="font-serif text-3xl font-semibold">{author.name}</h1>
            <p className="text-sm text-neutral-500">
              {totalPosts} article{totalPosts !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {author.bio && (
          <p className="mt-4 max-w-2xl text-neutral-600">{author.bio}</p>
        )}
      </header>

      <section>
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

        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/author/${slug}/`}
          />
        </div>
      </section>
    </div>
  );
}
