"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchForm } from "./SearchForm";

interface NavChild {
  label: string;
  href: string;
  external?: boolean;
  children?: NavChild[];
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavChild[];
}

interface HeaderProps {
  navItems: NavItem[];
}

function NavLink({ href, external, children, className }: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <Link href={href} className={className}>{children}</Link>;
}

export function Header({ navItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);

  return (
    <header className="bg-salmon-200">
      {/* Logo row */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Care to Beauty Blog"
            width={300}
            height={130}
            priority
            className="h-20 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-brown-700 hover:text-brown-900"
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-500 hover:text-brown-700 lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="border-t border-salmon-500/20 px-4 py-3">
          <div className="mx-auto max-w-md">
            <SearchForm />
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="hidden border-t border-salmon-500/20 lg:block">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2.5">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <NavLink
                  href={item.href}
                  external={item.external}
                  className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-brown-700 transition-colors hover:text-brown-900"
                >
                  {item.label}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </NavLink>

                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 mt-0 min-w-48 rounded-b-lg border border-t-0 border-neutral-200 bg-white py-2 shadow-lg">
                    {item.children.map((child) => (
                      <div key={child.label}>
                        <NavLink
                          href={child.href}
                          external={child.external}
                          className="block px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-brown-700"
                        >
                          {child.label}
                        </NavLink>
                        {child.children && child.children.map((grandchild) => (
                          <NavLink
                            key={grandchild.label}
                            href={grandchild.href}
                            external={grandchild.external}
                            className="block px-4 py-2 pl-8 text-sm text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-brown-700"
                          >
                            {grandchild.label}
                          </NavLink>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                href={item.href}
                external={item.external}
                className="text-sm font-semibold uppercase tracking-wide text-brown-700 transition-colors hover:text-brown-900"
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="border-t border-salmon-500/20 lg:hidden">
          <div className="flex flex-col px-4 py-3">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-salmon-500/20 last:border-b-0">
                  <button
                    onClick={() => setOpenMobileSub(openMobileSub === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-wide text-brown-700"
                  >
                    {item.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className={`h-3 w-3 transition-transform ${openMobileSub === item.label ? "rotate-180" : ""}`}
                    >
                      <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {openMobileSub === item.label && (
                    <div className="pb-3 pl-4">
                      <NavLink
                        href={item.href}
                        external={item.external}
                        className="block py-2 text-sm text-brown-700/70"
                      >
                        All {item.label}
                      </NavLink>
                      {item.children.map((child) => (
                        <div key={child.label}>
                          <NavLink
                            href={child.href}
                            external={child.external}
                            className="block py-2 text-sm text-brown-700"
                          >
                            {child.label}
                          </NavLink>
                          {child.children && child.children.map((grandchild) => (
                            <NavLink
                              key={grandchild.label}
                              href={grandchild.href}
                              external={grandchild.external}
                              className="block py-2 pl-4 text-sm text-brown-700/70"
                            >
                              {grandchild.label}
                            </NavLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  href={item.href}
                  external={item.external}
                  className="border-b border-salmon-500/20 py-3 text-sm font-semibold uppercase tracking-wide text-brown-700 last:border-b-0"
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
