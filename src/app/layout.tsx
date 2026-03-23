import type { Metadata } from "next";
import { Header, type NavItem } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const SITE_URL = "https://blog.caretobeauty.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Care to Beauty Blog",
    template: "%s | Care to Beauty Blog",
  },
  description:
    "Skincare tips, beauty guides, and product recommendations from the Care to Beauty team.",
  openGraph: {
    type: "website",
    siteName: "Care to Beauty Blog",
    locale: "en_US",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed/",
    },
  },
};

const navItems: NavItem[] = [
  { label: "Best Of Skincare", href: "/discover/best-of-skincare/" },
  { label: "Best Of Brands", href: "/discover/best-of-brands/" },
  {
    label: "Beauty",
    href: "/discover/beauty/",
    children: [
      {
        label: "Skin Care",
        href: "/discover/beauty/skincare/",
        children: [
          { label: "Ingredients", href: "/discover/beauty/skincare/ingredient-glossary/" },
        ],
      },
      { label: "Sunscreen", href: "/discover/beauty/sunscreen/" },
      { label: "Body Care", href: "/discover/beauty/body-care/" },
      { label: "Hair Care", href: "/discover/beauty/haircare/" },
      { label: "Makeup", href: "/discover/beauty/makeup/" },
      { label: "Nails", href: "/discover/beauty/nail-care-and-color/" },
      { label: "Fragrance", href: "/discover/beauty/fragrance/" },
      { label: "Oral Care", href: "/discover/beauty/oral-dental-care/" },
    ],
  },
  {
    label: "Skincare Routines",
    href: "/discover/skincare-routines/",
    children: [
      { label: "Ask a Pharmacist", href: "/discover/skincare-routines/ask-a-pharmacist/" },
    ],
  },
  { label: "YouTube", href: "https://www.youtube.com/c/caretobeauty", external: true },
  { label: "Shop", href: "https://www.caretobeauty.com", external: true },
];

const footerColumns = [
  {
    title: "Categories",
    links: [
      { label: "Skin Care", href: "/discover/beauty/skincare/" },
      { label: "Makeup", href: "/discover/beauty/makeup/" },
      { label: "Hair Care", href: "/discover/beauty/haircare/" },
      { label: "Sunscreen", href: "/discover/beauty/sunscreen/" },
      { label: "Fragrance", href: "/discover/beauty/fragrance/" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Best Of Brands", href: "/discover/best-of-brands/" },
      { label: "Best Of Skincare", href: "/discover/best-of-skincare/" },
      { label: "Team Favorites", href: "/discover/team-favorites/" },
      { label: "Ingredients", href: "/discover/beauty/skincare/ingredient-glossary/" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "caretobeauty.com", href: "https://www.caretobeauty.com" },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://blogstatic.beautytocare.com" />
      </head>
      <body className="bg-cream-50 text-brown-700 font-sans antialiased">
        <Header navItems={navItems} />
        <div role="main">{children}</div>
        <Footer columns={footerColumns} />
      </body>
    </html>
  );
}
