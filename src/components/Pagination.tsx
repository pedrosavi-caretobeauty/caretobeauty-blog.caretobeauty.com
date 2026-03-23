import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 3) pages.push("...");

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push("...");

  // Always show last page
  if (totalPages > 1) pages.push(totalPages);

  function pageHref(page: number) {
    return page === 1 ? basePath : `${basePath}page/${page}/`;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="rounded-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          aria-label="Previous page"
        >
          ←
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-sm text-neutral-400">
            ...
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="rounded-full bg-brown-700 px-3.5 py-2 text-sm font-semibold text-white"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className="rounded-full px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="rounded-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          aria-label="Next page"
        >
          →
        </Link>
      )}
    </nav>
  );
}
