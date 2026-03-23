import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SearchForm } from "@/components/SearchForm";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const query = sp.q || "";

  return {
    title: query ? `Search Results for: ${query}` : "Search",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";

  let posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date;
    readingTimeMinutes: number | null;
    author: { name: string; slug: string };
    primaryCategory: { name: string; fullPath: string } | null;
    featuredImage: { url: string; altText: string | null } | null;
  }> = [];

  if (query) {
    posts = await prisma.post.findMany({
      where: {
        status: "publish",
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { excerpt: { contains: query } },
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
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
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          {query ? (
            <>
              Search Results for: <strong>{query}</strong>
            </>
          ) : (
            "Search"
          )}
        </h1>
        <div className="mt-4 max-w-md">
          <SearchForm defaultValue={query} />
        </div>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        <section className="min-w-0 flex-1">
          {query && posts.length === 0 && (
            <p className="text-neutral-500">
              No results found for &quot;{query}&quot;. Try a different search term.
            </p>
          )}

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
        </section>

        <aside className="w-full shrink-0 lg:w-72">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
