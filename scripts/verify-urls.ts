/**
 * URL Verification Script
 *
 * Verifies that all migrated public-facing URLs exist in the new database
 * by comparing WordPress slugs against the new schema.
 *
 * This does NOT make HTTP requests (no Next.js app yet). Instead it verifies
 * data integrity: every WP public URL has a corresponding record in the new DB.
 *
 *   npx ts-node scripts/verify-urls.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";

const prisma = new PrismaClient();

async function main() {
  const wp = await mysql.createConnection(process.env.WP_DATABASE_URL!);
  let errors = 0;

  // ─── Posts: /%postname%/ ───────────────────────────────────────
  console.log("Verifying post URLs...");
  const [wpPosts] = await wp.query(`
    SELECT ID, post_name FROM wp_posts
    WHERE post_type = 'post' AND post_status = 'publish'
  `) as any[];

  for (const p of wpPosts) {
    const found = await prisma.post.findUnique({ where: { wpId: p.ID } });
    if (!found) {
      console.error(`  ✗ MISSING post: /${p.post_name}/ (WP ID: ${p.ID})`);
      errors++;
    } else if (found.slug !== p.post_name) {
      console.error(`  ✗ SLUG MISMATCH: WP "/${p.post_name}/" vs new "/${found.slug}/"`);
      errors++;
    }
  }
  console.log(`  ${wpPosts.length} post URLs checked`);

  // ─── Categories: /discover/<slug>/ ─────────────────────────────
  console.log("Verifying category URLs...");
  const [wpCats] = await wp.query(`
    SELECT t.term_id, t.slug FROM wp_terms t
    JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
    WHERE tt.taxonomy = 'category'
  `) as any[];

  for (const c of wpCats) {
    const found = await prisma.category.findUnique({ where: { wpId: c.term_id } });
    if (!found) {
      console.error(`  ✗ MISSING category: /discover/${c.slug}/ (WP ID: ${c.term_id})`);
      errors++;
    } else if (found.slug !== c.slug) {
      console.error(`  ✗ SLUG MISMATCH: WP "/discover/${c.slug}/" vs new "/discover/${found.slug}/"`);
      errors++;
    }
  }
  console.log(`  ${wpCats.length} category URLs checked`);

  // ─── Tags: /tag/<slug>/ ────────────────────────────────────────
  console.log("Verifying tag URLs...");
  const [wpTags] = await wp.query(`
    SELECT t.term_id, t.slug FROM wp_terms t
    JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id
    WHERE tt.taxonomy = 'post_tag'
  `) as any[];

  for (const t of wpTags) {
    const found = await prisma.tag.findUnique({ where: { wpId: t.term_id } });
    if (!found) {
      console.error(`  ✗ MISSING tag: /tag/${t.slug}/ (WP ID: ${t.term_id})`);
      errors++;
    } else if (found.slug !== t.slug) {
      console.error(`  ✗ SLUG MISMATCH: WP "/tag/${t.slug}/" vs new "/tag/${found.slug}/"`);
      errors++;
    }
  }
  console.log(`  ${wpTags.length} tag URLs checked`);

  // ─── Summary ───────────────────────────────────────────────────
  console.log("\n=== URL Verification Summary ===");
  console.log(`Posts:      ${wpPosts.length}`);
  console.log(`Categories: ${wpCats.length}`);
  console.log(`Tags:       ${wpTags.length}`);
  console.log(`Errors:     ${errors}`);

  if (errors === 0) {
    console.log("\n✓ All URLs verified — every WP public URL has a matching record in the new database.");
  } else {
    console.log(`\n✗ ${errors} URL(s) failed verification.`);
    process.exit(1);
  }

  await wp.end();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});
