import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export async function Sidebar() {
  const categories = await prisma.category.findMany({
    where: {
      posts: { some: { post: { status: "publish" } } },
    },
    orderBy: { name: "asc" },
    select: {
      name: true,
      fullPath: true,
      _count: { select: { posts: true } },
    },
  });

  const recentPosts = await prisma.post.findMany({
    where: { status: "publish" },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: {
      slug: true,
      title: true,
      publishedAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <NewsletterForm />

      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.fullPath}>
              <Link
                href={`/discover/${cat.fullPath}/`}
                className="flex items-center justify-between text-sm text-neutral-600 transition-colors hover:text-brown-700"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-neutral-400">
                  {cat._count.posts}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold">Recent Posts</h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${post.slug}/`}
                className="block text-sm font-semibold leading-snug transition-colors hover:text-salmon-500"
              >
                {post.title}
              </Link>
              <time
                dateTime={post.publishedAt.toISOString()}
                className="mt-0.5 block text-xs text-neutral-400"
              >
                {post.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
