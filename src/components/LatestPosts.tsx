"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./Button";

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  readingTimeMinutes: number | null;
  author: { name: string; slug: string };
  primaryCategory: { name: string; fullPath: string } | null;
  featuredImage: { url: string; altText: string | null } | null;
}

interface LatestPostsProps {
  initialPosts: Post[];
}

export function LatestPosts({ initialPosts }: LatestPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?offset=${posts.length}&limit=8`);
      const newPosts: Post[] = await res.json();
      if (newPosts.length < 8) setHasMore(false);
      setPosts((prev) => [...prev, ...newPosts]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
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

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="md"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Show More"}
          </Button>
        </div>
      )}
    </>
  );
}
