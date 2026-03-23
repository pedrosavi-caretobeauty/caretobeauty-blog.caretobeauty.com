import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturedPostCard } from "./FeaturedPostCard";

const meta: Meta<typeof FeaturedPostCard> = {
  title: "Components/FeaturedPostCard",
  component: FeaturedPostCard,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="max-w-4xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof FeaturedPostCard>;

export const Default: Story = {
  args: {
    slug: "maybelline-lipsticks",
    title: "Maybelline Lipsticks: A Quick Guide",
    excerpt:
      "Discover Maybelline lipstick formulas, finishes, and shades, from Superstay Matte Ink to glossy options, and find the perfect lip look.",
    featuredImage: {
      url: "https://blogstatic.beautytocare.com/wp-content/uploads/2026/03/maybelline-lipsticks.jpg",
      altText: "Maybelline Lipsticks",
    },
    category: { name: "Best Of Brands", fullPath: "best-of-brands" },
    author: { name: "Sofia Alves", slug: "sofia" },
    publishedAt: new Date("2026-03-17"),
  },
};

export const WithoutExcerpt: Story = {
  args: {
    slug: "best-sunscreen-dark-spots",
    title: "The Best Sunscreen for Dark Spots & Hyperpigmentation",
    featuredImage: {
      url: "https://blogstatic.beautytocare.com/wp-content/uploads/2026/03/best-sunscreen-dark-spots-melasma-hyperpigmentation-2026.jpg",
      altText: "Best Sunscreen for Dark Spots",
    },
    category: { name: "Sunscreen", fullPath: "beauty/sunscreen" },
    author: { name: "Rafaela Ferreira", slug: "rafaela" },
    publishedAt: new Date("2026-03-03"),
  },
};
