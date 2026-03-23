/**
 * Migration script: WordPress (blogctbdev) → caretobeauty_blog
 *
 * Reads from the WordPress database via mysql2 and writes to the new
 * normalized schema via Prisma. Run once:
 *
 *   npx ts-node scripts/migrate-from-wp.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";

const prisma = new PrismaClient();

// WordPress DB connection (read-only)
async function wpConnection() {
  const url = process.env.WP_DATABASE_URL;
  if (!url) throw new Error("WP_DATABASE_URL not set");
  return mysql.createConnection(url);
}

// Helper: run a WP query and return typed rows
async function wpQuery<T>(conn: mysql.Connection, sql: string): Promise<T[]> {
  const [rows] = await conn.query(sql);
  return rows as T[];
}

// Helper: parse PHP serialized date string "DD/MM/YYYY" → Date | null
function parseRevisionDate(value: string | null): Date | null {
  if (!value) return null;
  // Format observed: "20/03/2026" or similar
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    return new Date(`${match[3]}-${match[2]}-${match[1]}T00:00:00Z`);
  }
  // Try ISO-ish formats
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// HTML entity decode (basic — covers &amp; &lt; &gt; &quot; &#039; and numeric)
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// ─── Authors ────────────────────────────────────────────────────────
async function migrateAuthors(wp: mysql.Connection) {
  console.log("Migrating authors...");

  interface WpUser {
    ID: number;
    user_nicename: string;
    user_email: string;
    display_name: string;
    bio: string | null;
  }

  const users = await wpQuery<WpUser>(wp, `
    SELECT u.ID, u.user_nicename, u.user_email, u.display_name,
      MAX(CASE WHEN um.meta_key = 'description' THEN um.meta_value END) as bio
    FROM wp_users u
    LEFT JOIN wp_usermeta um ON u.ID = um.user_id AND um.meta_key = 'description'
    GROUP BY u.ID
  `);

  for (const u of users) {
    await prisma.author.create({
      data: {
        name: u.display_name,
        slug: u.user_nicename,
        email: u.user_email || null,
        bio: u.bio && u.bio.trim() ? u.bio : null,
        wpId: u.ID,
      },
    });
  }

  console.log(`  ✓ ${users.length} authors migrated`);
}

// ─── Categories ─────────────────────────────────────────────────────
async function migrateCategories(wp: mysql.Connection) {
  console.log("Migrating categories...");

  interface WpCategory {
    term_id: number;
    name: string;
    slug: string;
    description: string;
    parent: number;
  }

  const cats = await wpQuery<WpCategory>(wp, `
    SELECT t.term_id, t.name, t.slug, tt.description, tt.parent
    FROM wp_terms t
    JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
    WHERE tt.taxonomy = 'category'
    ORDER BY tt.parent ASC, t.term_id ASC
  `);

  // Yoast SEO data for categories
  interface YoastCat {
    object_id: number;
    title: string | null;
    description: string | null;
  }

  const yoastCats = await wpQuery<YoastCat>(wp, `
    SELECT object_id, title, description
    FROM wp_yoast_indexable
    WHERE object_type = 'term' AND object_sub_type = 'category'
      AND (title IS NOT NULL OR description IS NOT NULL)
  `);

  const yoastMap = new Map(yoastCats.map((y) => [y.object_id, y]));

  // First pass: create all categories without parent references
  for (const c of cats) {
    const yoast = yoastMap.get(c.term_id);
    await prisma.category.create({
      data: {
        name: decodeEntities(c.name),
        slug: c.slug,
        description: c.description?.trim() || null,
        seoTitle: yoast?.title || null,
        seoDescription: yoast?.description || null,
        wpId: c.term_id,
      },
    });
  }

  // Second pass: set parent references
  for (const c of cats) {
    if (c.parent && c.parent > 0) {
      const parent = await prisma.category.findUnique({ where: { wpId: c.parent } });
      if (parent) {
        await prisma.category.update({
          where: { wpId: c.term_id },
          data: { parentId: parent.id },
        });
      }
    }
  }

  console.log(`  ✓ ${cats.length} categories migrated`);
}

// ─── Tags ───────────────────────────────────────────────────────────
async function migrateTags(wp: mysql.Connection) {
  console.log("Migrating tags...");

  interface WpTag {
    term_id: number;
    name: string;
    slug: string;
  }

  const tags = await wpQuery<WpTag>(wp, `
    SELECT t.term_id, t.name, t.slug
    FROM wp_terms t
    JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
    WHERE tt.taxonomy = 'post_tag'
  `);

  for (const t of tags) {
    await prisma.tag.create({
      data: {
        name: decodeEntities(t.name),
        slug: t.slug,
        wpId: t.term_id,
      },
    });
  }

  console.log(`  ✓ ${tags.length} tags migrated`);
}

// ─── Media ──────────────────────────────────────────────────────────
async function migrateMedia(wp: mysql.Connection) {
  console.log("Migrating media...");

  interface WpAttachment {
    ID: number;
    guid: string;
    post_mime_type: string;
    post_date: Date;
    file: string | null;
    alt_text: string | null;
    metadata: string | null;
  }

  const attachments = await wpQuery<WpAttachment>(wp, `
    SELECT p.ID, p.guid, p.post_mime_type, p.post_date,
      MAX(CASE WHEN pm.meta_key = '_wp_attached_file' THEN pm.meta_value END) as file,
      MAX(CASE WHEN pm.meta_key = '_wp_attachment_image_alt' THEN pm.meta_value END) as alt_text,
      MAX(CASE WHEN pm.meta_key = '_wp_attachment_metadata' THEN pm.meta_value END) as metadata
    FROM wp_posts p
    LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
      AND pm.meta_key IN ('_wp_attached_file', '_wp_attachment_image_alt', '_wp_attachment_metadata')
    WHERE p.post_type = 'attachment'
    GROUP BY p.ID
  `);

  let count = 0;
  for (const a of attachments) {
    // Extract dimensions from PHP serialized metadata
    let width: number | null = null;
    let height: number | null = null;
    if (a.metadata) {
      const wMatch = a.metadata.match(/"width";i:(\d+)/);
      const hMatch = a.metadata.match(/"height";i:(\d+)/);
      if (wMatch) width = parseInt(wMatch[1], 10);
      if (hMatch) height = parseInt(hMatch[1], 10);
    }

    // Build CDN URL from file path
    const url = a.file
      ? `https://blogstatic.beautytocare.com/wp-content/uploads/${a.file}`
      : a.guid;

    const filename = (a.file || a.guid).split("/").pop() || "";

    await prisma.media.create({
      data: {
        filename,
        url,
        altText: a.alt_text?.trim() || null,
        width,
        height,
        mimeType: a.post_mime_type,
        createdAt: a.post_date,
        wpId: a.ID,
      },
    });
    count++;
  }

  console.log(`  ✓ ${count} media items migrated`);
}

// ─── Posts ───────────────────────────────────────────────────────────
async function migratePosts(wp: mysql.Connection) {
  console.log("Migrating posts...");

  interface WpPost {
    ID: number;
    post_name: string;
    post_title: string;
    post_excerpt: string;
    post_content: string;
    post_status: string;
    post_date: Date;
    post_modified: Date;
    post_author: number;
    thumbnail_id: number | null;
    custom_last_revision: string | null;
    seo_title: string | null;
    seo_desc: string | null;
    seo_kw: string | null;
    reading_time: string | null;
    primary_cat_wp: string | null;
    yoast_primary_cat: string | null;
  }

  const posts = await wpQuery<WpPost>(wp, `
    SELECT
      p.ID, p.post_name, p.post_title, p.post_excerpt, p.post_content,
      p.post_status, p.post_date, p.post_modified, p.post_author,
      MAX(CASE WHEN pm.meta_key = '_thumbnail_id' THEN pm.meta_value END) as thumbnail_id,
      MAX(CASE WHEN pm.meta_key = 'custom_last_revision' THEN pm.meta_value END) as custom_last_revision,
      MAX(CASE WHEN pm.meta_key = '_yoast_wpseo_title' THEN pm.meta_value END) as seo_title,
      MAX(CASE WHEN pm.meta_key = '_yoast_wpseo_metadesc' THEN pm.meta_value END) as seo_desc,
      MAX(CASE WHEN pm.meta_key = '_yoast_wpseo_focuskw' THEN pm.meta_value END) as seo_kw,
      MAX(CASE WHEN pm.meta_key = '_yoast_wpseo_estimated-reading-time-minutes' THEN pm.meta_value END) as reading_time,
      MAX(CASE WHEN pm.meta_key = 'post-primary-category' THEN pm.meta_value END) as primary_cat_wp,
      MAX(CASE WHEN pm.meta_key = '_yoast_wpseo_primary_category' THEN pm.meta_value END) as yoast_primary_cat
    FROM wp_posts p
    LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
    WHERE p.post_type = 'post' AND p.post_status IN ('publish', 'draft', 'pending', 'rejected', 'private')
      AND p.post_name != ''
    GROUP BY p.ID
  `);

  let count = 0;
  for (const p of posts) {
    // Resolve author
    const author = await prisma.author.findUnique({ where: { wpId: p.post_author } });
    if (!author) {
      console.warn(`  ⚠ Skipping post ${p.ID} "${p.post_name}": author ${p.post_author} not found`);
      continue;
    }

    // Resolve featured image
    let featuredImageId: number | null = null;
    if (p.thumbnail_id) {
      const media = await prisma.media.findUnique({ where: { wpId: Number(p.thumbnail_id) } });
      if (media) featuredImageId = media.id;
    }

    // Resolve primary category (prefer Yoast, fall back to Option Tree)
    let primaryCategoryId: number | null = null;
    const primaryCatWpId = p.yoast_primary_cat || p.primary_cat_wp;
    if (primaryCatWpId && primaryCatWpId.trim() && Number(primaryCatWpId) > 0) {
      const cat = await prisma.category.findUnique({ where: { wpId: Number(primaryCatWpId) } });
      if (cat) primaryCategoryId = cat.id;
    }

    await prisma.post.create({
      data: {
        slug: p.post_name,
        title: decodeEntities(p.post_title),
        excerpt: p.post_excerpt?.trim() || null,
        content: p.post_content,
        status: p.post_status === "private" ? "draft" : p.post_status,
        publishedAt: p.post_date,
        updatedAt: p.post_modified,
        lastRevisedAt: parseRevisionDate(p.custom_last_revision),
        authorId: author.id,
        featuredImageId,
        primaryCategoryId,
        seoTitle: p.seo_title?.trim() || null,
        seoDescription: p.seo_desc?.trim() || null,
        seoFocusKeyword: p.seo_kw?.trim() || null,
        readingTimeMinutes: p.reading_time ? parseInt(p.reading_time, 10) : null,
        wpId: p.ID,
      },
    });
    count++;
  }

  console.log(`  ✓ ${count} posts migrated`);
}

// ─── Post ↔ Category relationships ─────────────────────────────────
async function migratePostCategories(wp: mysql.Connection) {
  console.log("Migrating post → category relationships...");

  interface WpRelation {
    object_id: number;
    term_id: number;
  }

  const rels = await wpQuery<WpRelation>(wp, `
    SELECT tr.object_id, tt.term_id
    FROM wp_term_relationships tr
    JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
    WHERE tt.taxonomy = 'category'
  `);

  let count = 0;
  for (const r of rels) {
    const post = await prisma.post.findUnique({ where: { wpId: r.object_id } });
    const cat = await prisma.category.findUnique({ where: { wpId: r.term_id } });
    if (post && cat) {
      await prisma.postCategory.create({
        data: { postId: post.id, categoryId: cat.id },
      }).catch(() => {
        // Duplicate — ignore
      });
      count++;
    }
  }

  console.log(`  ✓ ${count} post-category links migrated`);
}

// ─── Post ↔ Tag relationships ───────────────────────────────────────
async function migratePostTags(wp: mysql.Connection) {
  console.log("Migrating post → tag relationships...");

  interface WpRelation {
    object_id: number;
    term_id: number;
  }

  const rels = await wpQuery<WpRelation>(wp, `
    SELECT tr.object_id, tt.term_id
    FROM wp_term_relationships tr
    JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
    WHERE tt.taxonomy = 'post_tag'
  `);

  let count = 0;
  for (const r of rels) {
    const post = await prisma.post.findUnique({ where: { wpId: r.object_id } });
    const tag = await prisma.tag.findUnique({ where: { wpId: r.term_id } });
    if (post && tag) {
      await prisma.postTag.create({
        data: { postId: post.id, tagId: tag.id },
      }).catch(() => {
        // Duplicate — ignore
      });
      count++;
    }
  }

  console.log(`  ✓ ${count} post-tag links migrated`);
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log("=== WordPress → caretobeauty_blog Migration ===\n");

  const wp = await wpConnection();

  try {
    // Clear existing data (idempotent re-runs)
    console.log("Clearing existing data...");
    await prisma.postTag.deleteMany();
    await prisma.postCategory.deleteMany();
    await prisma.post.deleteMany();
    await prisma.media.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.author.deleteMany();
    console.log("  ✓ Clean slate\n");

    await migrateAuthors(wp);
    await migrateCategories(wp);
    await migrateTags(wp);
    await migrateMedia(wp);
    await migratePosts(wp);
    await migratePostCategories(wp);
    await migratePostTags(wp);

    console.log("\n=== Migration complete ===");
  } finally {
    await wp.end();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
