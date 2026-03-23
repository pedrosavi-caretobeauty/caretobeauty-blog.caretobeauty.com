import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthorBio } from "./AuthorBio";

const meta: Meta<typeof AuthorBio> = {
  title: "Components/AuthorBio",
  component: AuthorBio,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="max-w-2xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof AuthorBio>;

export const WithBio: Story = {
  args: {
    name: "Ana Alexandre",
    slug: "ana-alexandre",
    bio: "As a teenager, I had sensitive skin and acne. A few years later, I developed eczema on my elbows and seborrheic dermatitis on the nose area. I've now been writing about cosmetics for over 10 years.",
  },
};

export const WithAvatar: Story = {
  args: {
    name: "Rafaela Ferreira",
    slug: "rafaela",
    bio: "When it comes to skincare routines, I like to breeze through them as fast as I can. I go through hydrating serums and sunscreens for sport.",
    avatarUrl: "https://blogstatic.beautytocare.com/wp-content/uploads/2021/01/rafaela.jpg",
  },
};

export const NoBio: Story = {
  args: {
    name: "Bruno de Gouveia",
    slug: "bruno",
    bio: null,
  },
};
