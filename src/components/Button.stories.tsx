import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Buy Now", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Read More", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "View All", variant: "ghost" },
};

export const Small: Story = {
  args: { children: "Sign Up", variant: "primary", size: "sm" },
};

export const Large: Story = {
  args: { children: "Subscribe", variant: "primary", size: "lg" },
};

export const FullWidth: Story = {
  args: { children: "Subscribe to Newsletter", variant: "primary", fullWidth: true },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};

export const Disabled: Story = {
  args: { children: "Disabled", variant: "primary", disabled: true },
};

export const AsLink: Story = {
  args: { children: "Go to Blog", variant: "secondary", href: "/" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
