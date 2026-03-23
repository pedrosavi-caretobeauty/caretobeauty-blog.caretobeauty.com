import Link from "next/link";

interface AuthorBioProps {
  name: string;
  slug: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export function AuthorBio({ name, slug, bio, avatarUrl }: AuthorBioProps) {
  if (!bio) return null;

  return (
    <div className="flex gap-4 rounded-xl bg-neutral-50 p-5 md:p-6">
      <Link href={`/author/${slug}/`} className="shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brown-100 text-lg font-semibold text-brown-700">
            {name.charAt(0)}
          </div>
        )}
      </Link>

      <div className="min-w-0">
        <Link
          href={`/author/${slug}/`}
          className="text-sm font-semibold uppercase tracking-wide hover:text-salmon-500"
        >
          {name}
        </Link>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-3">{bio}</p>
      </div>
    </div>
  );
}
