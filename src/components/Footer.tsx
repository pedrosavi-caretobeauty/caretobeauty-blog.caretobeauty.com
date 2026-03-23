import Link from "next/link";

interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterProps {
  columns: FooterColumn[];
}

export function Footer({ columns }: FooterProps) {
  return (
    <footer className="bg-brown-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Logo */}
        <Link href="/" className="inline-block font-serif text-2xl font-semibold">
          Care to Beauty
        </Link>

        {/* Columns */}
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-neutral-400 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Care to Beauty. All rights reserved.</p>
          <Link
            href="https://www.caretobeauty.com"
            className="transition-colors hover:text-white"
          >
            Shop at caretobeauty.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
