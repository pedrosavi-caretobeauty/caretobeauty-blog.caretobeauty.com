import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchForm } from "./SearchForm";

const meta: Meta<typeof SearchForm> = {
  title: "Components/SearchForm",
  component: SearchForm,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "sunscreen" },
};
