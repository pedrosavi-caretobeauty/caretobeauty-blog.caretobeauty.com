import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

const defaultNavItems = [
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

export const Default: Story = {
  args: { navItems: defaultNavItems },
};
