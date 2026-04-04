import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./index";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "md3"],
      description: "Spinner variant - default circular or MD3 morphing shape",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description: "Spinner size (MD3 spec: 24px-240px)",
    },
    contained: {
      control: "boolean",
      description: "Show container background (MD3 contained variant)",
    },
    label: {
      control: "text",
      description: "Accessible label for screen readers",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
};

export const MD3Variant: Story = {
  args: {
    variant: "md3",
  },
};

export const MD3Contained: Story = {
  args: {
    variant: "md3",
    contained: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const MD3Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner variant="md3" size="xs" />
      <Spinner variant="md3" size="sm" />
      <Spinner variant="md3" size="md" />
      <Spinner variant="md3" size="lg" />
      <Spinner variant="md3" size="xl" />
    </div>
  ),
};

export const MD3ContainedSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner variant="md3" contained size="xs" />
      <Spinner variant="md3" contained size="sm" />
      <Spinner variant="md3" contained size="md" />
      <Spinner variant="md3" contained size="lg" />
      <Spinner variant="md3" contained size="xl" />
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-primary">
      <Spinner size="md" />
      <span>Loading...</span>
    </div>
  ),
};

export const MD3WithText: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-primary">
        <Spinner variant="md3" size="md" />
        <span>Loading content...</span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner variant="md3" contained size="md" />
        <span>Refreshing...</span>
      </div>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="text-primary" />
      <Spinner className="text-destructive" />
      <Spinner className="text-muted-foreground" />
      <Spinner className="text-green-500" />
    </div>
  ),
};

export const MD3CustomColor: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="md3" className="text-primary" />
      <Spinner variant="md3" className="text-destructive" />
      <Spinner variant="md3" className="text-green-500" />
      <Spinner variant="md3" className="text-purple-500" />
    </div>
  ),
};

export const VariantComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Default Variant</h3>
        <div className="flex items-center gap-6">
          <Spinner variant="default" size="xs" />
          <Spinner variant="default" size="sm" />
          <Spinner variant="default" size="md" />
          <Spinner variant="default" size="lg" />
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">MD3 Variant</h3>
        <div className="flex items-center gap-6">
          <Spinner variant="md3" size="xs" />
          <Spinner variant="md3" size="sm" />
          <Spinner variant="md3" size="md" />
          <Spinner variant="md3" size="lg" />
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">MD3 Contained</h3>
        <div className="flex items-center gap-6">
          <Spinner variant="md3" contained size="xs" />
          <Spinner variant="md3" contained size="sm" />
          <Spinner variant="md3" contained size="md" />
          <Spinner variant="md3" contained size="lg" />
        </div>
      </div>
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        <Spinner size="xs" className="text-primary-foreground" />
        Loading...
      </button>
      <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        <Spinner variant="md3" size="xs" className="text-primary-foreground" />
        Processing...
      </button>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  render: () => (
    <div className="flex flex-col gap-6 rounded-lg bg-slate-900 p-8">
      <div className="flex items-center gap-6">
        <Spinner variant="default" className="text-white" />
        <Spinner variant="md3" className="text-white" />
        <Spinner variant="md3" contained className="text-white" />
      </div>
      <div className="flex items-center gap-2 text-white">
        <Spinner variant="md3" size="sm" className="text-white" />
        <span>Loading in dark mode...</span>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};
