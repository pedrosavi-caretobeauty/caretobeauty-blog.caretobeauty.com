"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchForm({
  defaultValue = "",
  placeholder = "Search articles...",
}: SearchFormProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search/?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pl-4 pr-10 text-sm outline-none transition-colors focus:border-brown-700"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brown-700"
        aria-label="Search"
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
    </form>
  );
}
