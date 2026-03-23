import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    columns: [
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
          { label: "About Us", href: "https://www.caretobeauty.com/about/" },
        ],
      },
      {
        title: "Shop",
        links: [
          { label: "caretobeauty.com", href: "https://www.caretobeauty.com" },
        ],
      },
    ],
  },
};
