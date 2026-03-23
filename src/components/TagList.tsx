import Link from "next/link";

interface TagListProps {
  tags: Array<{ name: string; slug: string }>;
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Tags
      </span>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/tag/${tag.slug}/`}
          className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600 transition-colors hover:border-brown-700 hover:text-brown-700"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
