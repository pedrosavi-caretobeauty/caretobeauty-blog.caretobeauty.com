import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "8", 10)));

  const posts = await prisma.post.findMany({
    where: { status: "publish" },
    orderBy: { publishedAt: "desc" },
    skip: offset,
    take: limit,
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

  return Response.json(posts);
}
