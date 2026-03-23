import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 10, basePath: "/discover/skincare/" },
};

export const MiddlePage: Story = {
  args: { currentPage: 5, totalPages: 10, basePath: "/discover/skincare/" },
};

export const LastPage: Story = {
  args: { currentPage: 10, totalPages: 10, basePath: "/discover/skincare/" },
};

export const FewPages: Story = {
  args: { currentPage: 2, totalPages: 3, basePath: "/" },
};

export const SinglePage: Story = {
  args: { currentPage: 1, totalPages: 1, basePath: "/" },
};
