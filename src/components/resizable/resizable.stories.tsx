import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Resizable, ResizablePanel, ResizableHandle } from "./index";

const meta: Meta<typeof Resizable> = {
  title: "Components/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "radio", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof Resizable>;

const PanelBox = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-center h-full w-full bg-[hsl(var(--surface-container-low))] text-foreground rounded-md text-sm",
      className
    )}
  >
    {label}
  </div>
);

function cn(...inputs: (string | false | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export const HorizontalThreePane: Story = {
  name: "Horizontal 3-pane",
  render: () => (
    <Resizable direction="horizontal" className="h-64 w-full border rounded-md">
      <ResizablePanel id="a" defaultSize="25%" minSize="10">
        <PanelBox label="Left" />
      </ResizablePanel>
      <ResizableHandle direction="horizontal" />
      <ResizablePanel id="b" defaultSize="50%" minSize="20">
        <PanelBox label="Center" />
      </ResizablePanel>
      <ResizableHandle direction="horizontal" />
      <ResizablePanel id="c" defaultSize="25%" minSize="10">
        <PanelBox label="Right" />
      </ResizablePanel>
    </Resizable>
  ),
};

export const VerticalStacked: Story = {
  name: "Vertical Stacked",
  render: () => (
    <Resizable direction="vertical" className="w-full h-96 border rounded-md">
      <ResizablePanel id="top" defaultSize="60%" minSize="20">
        <PanelBox label="Top" />
      </ResizablePanel>
      <ResizableHandle direction="vertical" />
      <ResizablePanel id="bottom" defaultSize="40%" minSize="20">
        <PanelBox label="Bottom" />
      </ResizablePanel>
    </Resizable>
  ),
};

export const CollapsiblePanels: Story = {
  name: "Collapsible Panels",
  render: () => (
    <Resizable direction="horizontal" className="h-64 w-full border rounded-md">
      <ResizablePanel id="a" defaultSize="25%" minSize="10" collapsible>
        <PanelBox label="Left (collapsible)" />
      </ResizablePanel>
      <ResizableHandle direction="horizontal" />
      <ResizablePanel id="b" defaultSize="50%">
        <PanelBox label="Center" />
      </ResizablePanel>
      <ResizableHandle direction="horizontal" />
      <ResizablePanel id="c" defaultSize="25%" minSize="10" collapsible>
        <PanelBox label="Right (collapsible)" />
      </ResizablePanel>
    </Resizable>
  ),
};

export const NestedGroups: Story = {
  name: "Nested (horizontal inside vertical)",
  render: () => (
    <Resizable direction="vertical" className="w-full h-96 border rounded-md">
      <ResizablePanel id="row1" defaultSize="50%">
        <Resizable direction="horizontal" className="h-full border-b">
          <ResizablePanel id="a" defaultSize="50%">
            <PanelBox label="A" />
          </ResizablePanel>
          <ResizableHandle direction="horizontal" />
          <ResizablePanel id="b" defaultSize="50%">
            <PanelBox label="B" />
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
      <ResizableHandle direction="vertical" />
      <ResizablePanel id="row2" defaultSize="50%">
        <PanelBox label="Full-width row" />
      </ResizablePanel>
    </Resizable>
  ),
};

export const PersistedLayout: Story = {
  name: "Persisted Layout (autoSaveId)",
  render: () => (
    <Resizable direction="horizontal" autoSaveId="storybook-persisted" className="h-64 w-full border rounded-md">
      <ResizablePanel id="left" defaultSize="30%" minSize="10">
        <PanelBox label="Left" />
      </ResizablePanel>
      <ResizableHandle direction="horizontal" />
      <ResizablePanel id="right" defaultSize="70%" minSize="20">
        <PanelBox label="Right" />
      </ResizablePanel>
    </Resizable>
  ),
};

export const HandleVariants: Story = {
  name: "Handle Variants — line / bar / grip",
  render: () => (
    <div className="flex flex-col gap-4">
      <Resizable direction="horizontal" className="h-32 border rounded-md">
        <ResizablePanel><PanelBox label="A" /></ResizablePanel>
        <ResizableHandle direction="horizontal" variant="line" />
        <ResizablePanel><PanelBox label="B" /></ResizablePanel>
      </Resizable>
      <Resizable direction="horizontal" className="h-32 border rounded-md">
        <ResizablePanel><PanelBox label="A" /></ResizablePanel>
        <ResizableHandle direction="horizontal" variant="bar" />
        <ResizablePanel><PanelBox label="B" /></ResizablePanel>
      </Resizable>
      <Resizable direction="horizontal" className="h-32 border rounded-md">
        <ResizablePanel><PanelBox label="A" /></ResizablePanel>
        <ResizableHandle direction="horizontal" variant="grip" />
        <ResizablePanel><PanelBox label="B" /></ResizablePanel>
      </Resizable>
    </div>
  ),
};

export const DisabledHandle: Story = {
  name: "Disabled Handle",
  render: () => (
    <Resizable direction="horizontal" className="h-32 border rounded-md">
      <ResizablePanel><PanelBox label="A" /></ResizablePanel>
      <ResizableHandle direction="horizontal" disabled />
      <ResizablePanel><PanelBox label="B" /></ResizablePanel>
    </Resizable>
  ),
};