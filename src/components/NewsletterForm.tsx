"use client";

import { useState } from "react";
import { Button } from "./Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  return (
    <aside className="rounded-xl bg-cream-100 p-6 md:p-8 text-center">
      <h3 className="font-serif text-xl font-semibold md:text-2xl">
        Sign Up to Our Newsletter
      </h3>
      <p className="mt-2 text-sm text-neutral-600">
        Get notified about exclusive offers every week!
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your e-mail"
          required
          className="rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brown-700 sm:w-64"
        />
        <Button type="submit" variant="primary" size="md">
          Sign Up
        </Button>
      </form>
    </aside>
  );
}
