import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "salmon", "menthol", "blue", "outline"],
    },
    size: { control: "select", options: ["sm", "md"] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { label: "Skin Care", variant: "default" },
};

export const Salmon: Story = {
  args: { label: "Makeup", variant: "salmon" },
};

export const Menthol: Story = {
  args: { label: "Sustainability", variant: "menthol" },
};

export const Blue: Story = {
  args: { label: "Hair Care", variant: "blue" },
};

export const Outline: Story = {
  args: { label: "Fragrance", variant: "outline" },
};

export const Medium: Story = {
  args: { label: "Skin Care", variant: "default", size: "md" },
};

export const WithLink: Story = {
  args: { label: "Skin Care", href: "/discover/beauty/skincare/", variant: "default" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge label="Default" variant="default" />
      <Badge label="Salmon" variant="salmon" />
      <Badge label="Menthol" variant="menthol" />
      <Badge label="Blue" variant="blue" />
      <Badge label="Outline" variant="outline" />
    </div>
  ),
};
