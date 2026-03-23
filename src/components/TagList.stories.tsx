import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagList } from "./TagList";

const meta: Meta<typeof TagList> = {
  title: "Components/TagList",
  component: TagList,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="max-w-2xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof TagList>;

export const Default: Story = {
  args: {
    tags: [
      { name: "Dark Spots & Hyperpigmentation", slug: "dark-spots-hyperpigmentation" },
      { name: "Vegan", slug: "vegan" },
      { name: "La Roche-Posay", slug: "la-roche-posay" },
      { name: "Eucerin", slug: "eucerin" },
    ],
  },
};

export const SingleTag: Story = {
  args: {
    tags: [{ name: "Mature Skin", slug: "mature-skin" }],
  },
};

export const Empty: Story = {
  args: { tags: [] },
};
