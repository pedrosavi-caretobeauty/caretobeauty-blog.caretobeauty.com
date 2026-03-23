import { prisma } from "@/lib/prisma";

const SITE_URL = "https://blog.caretobeauty.com";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "publish" },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { fullPath: true },
  });

  const tags = await prisma.tag.findMany({
    select: { slug: true },
  });

  const authors = await prisma.author.findMany({
    where: { posts: { some: { status: "publish" } } },
    select: { slug: true },
  });

  const urls: Array<{ loc: string; lastmod?: string; priority?: string }> = [];

  // Homepage
  urls.push({ loc: SITE_URL + "/", priority: "1.0" });

  // Posts
  for (const post of posts) {
    urls.push({
      loc: `${SITE_URL}/${post.slug}/`,
      lastmod: post.updatedAt.toISOString().split("T")[0],
      priority: "0.8",
    });
  }

  // Categories
  for (const cat of categories) {
    urls.push({
      loc: `${SITE_URL}/discover/${cat.fullPath}/`,
      priority: "0.6",
    });
  }

  // Tags
  for (const tag of tags) {
    urls.push({
      loc: `${SITE_URL}/tag/${tag.slug}/`,
      priority: "0.4",
    });
  }

  // Authors
  for (const author of authors) {
    urls.push({
      loc: `${SITE_URL}/author/${author.slug}/`,
      priority: "0.5",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    ${u.priority ? `<priority>${u.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
