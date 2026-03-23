import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsletterForm } from "./NewsletterForm";

const meta: Meta<typeof NewsletterForm> = {
  title: "Components/NewsletterForm",
  component: NewsletterForm,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="max-w-2xl"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof NewsletterForm>;

export const Default: Story = {};
