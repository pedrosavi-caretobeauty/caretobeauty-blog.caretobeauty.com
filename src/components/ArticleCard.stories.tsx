import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArticleCard } from "./ArticleCard";

const meta: Meta<typeof ArticleCard> = {
  title: "Components/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="max-w-2xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

const sampleImage = {
  url: "https://blogstatic.beautytocare.com/wp-content/uploads/2026/03/maybelline-lipsticks.jpg",
  altText: "Maybelline Lipsticks",
};

export const Default: Story = {
  args: {
    slug: "maybelline-lipsticks",
    title: "Maybelline Lipsticks: A Quick Guide",
    excerpt:
      "Discover Maybelline lipstick formulas, finishes, and shades, from Superstay Matte Ink to glossy options.",
    featuredImage: sampleImage,
    category: { name: "Makeup", fullPath: "beauty/makeup" },
    author: { name: "Sofia Alves", slug: "sofia" },
    publishedAt: new Date("2026-03-17"),
    readingTimeMinutes: 5,
  },
};

export const WithoutImage: Story = {
  args: {
    slug: "best-sunscreen-dark-spots",
    title: "The Best Sunscreen for Dark Spots & Hyperpigmentation",
    excerpt:
      "Find the best sunscreen to protect your skin and reduce dark spots, melasma, and hyperpigmentation.",
    category: { name: "Sunscreen", fullPath: "beauty/sunscreen" },
    author: { name: "Rafaela Ferreira", slug: "rafaela" },
    publishedAt: new Date("2026-03-03"),
    readingTimeMinutes: 8,
  },
};

export const WithoutExcerpt: Story = {
  args: {
    slug: "thermal-spring-water",
    title: "How To Use Thermal Spring Water In Your Skincare Routine",
    featuredImage: sampleImage,
    category: { name: "Skin Care", fullPath: "beauty/skincare" },
    author: { name: "Ana Alexandre", slug: "ana-alexandre" },
    publishedAt: new Date("2026-03-10"),
  },
};

export const WithoutCategory: Story = {
  args: {
    slug: "makeup-tips-mature-skin",
    title: "How to Make Makeup Look Good on Mature Skin",
    excerpt: "Simple makeup tips that enhance rather than mask.",
    featuredImage: sampleImage,
    author: { name: "Sofia Alves", slug: "sofia" },
    publishedAt: new Date("2026-03-05"),
    readingTimeMinutes: 6,
  },
};
