import { prisma } from "@/lib/prisma";

const SITE_URL = "https://blog.caretobeauty.com";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "publish" },
    orderBy: { publishedAt: "desc" },
    take: 50,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/${post.slug}/</guid>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <dc:creator>${escapeXml(post.author.name)}</dc:creator>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Care to Beauty Blog</title>
    <link>${SITE_URL}</link>
    <description>Skincare tips, beauty guides, and product recommendations from the Care to Beauty team.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${posts[0]?.publishedAt.toUTCString() || new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
