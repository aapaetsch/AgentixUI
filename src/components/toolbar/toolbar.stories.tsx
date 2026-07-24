import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Toolbar,
  ToolbarButton,
  ToolbarToggle,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarLabel,
} from "./index";
import { ToggleGroupItem } from "../toggle-group";
import { RotateCw, Download, Filter, CandlestickChart, LineChart, AreaChart } from "lucide-react";

const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    loop: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  render: () => (
    <Toolbar>
      <ToolbarButton tooltip="Refresh"><RotateCw className="size-4" /></ToolbarButton>
      <ToolbarButton tooltip="Export"><Download className="size-4" /></ToolbarButton>
      <ToolbarButton tooltip="Filter"><Filter className="size-4" /></ToolbarButton>
    </Toolbar>
  ),
};

export const ChartToolbar: Story = {
  name: "Chart Toolbar",
  render: () => (
    <Toolbar>
      <ToolbarToggleGroup type="single" defaultValue="candle">
        <ToggleGroupItem value="candle" size="sm">
          <CandlestickChart className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="line" size="sm">
          <LineChart className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="area" size="sm">
          <AreaChart className="size-4" />
        </ToggleGroupItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarLabel>Timeframe</ToolbarLabel>
      <ToolbarToggleGroup type="single" defaultValue="1D">
        <ToggleGroupItem value="1D" size="sm">1D</ToggleGroupItem>
        <ToggleGroupItem value="1W" size="sm">1W</ToggleGroupItem>
        <ToggleGroupItem value="1M" size="sm">1M</ToggleGroupItem>
        <ToggleGroupItem value="1Y" size="sm">1Y</ToggleGroupItem>
      </ToolbarToggleGroup>
    </Toolbar>
  ),
};

export const TableActionBar: Story = {
  name: "Table Action Bar",
  render: () => (
    <Toolbar>
      <ToolbarButton tooltip="Refresh"><RotateCw className="size-4" /></ToolbarButton>
      <ToolbarButton tooltip="Export"><Download className="size-4" /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLabel>Filter</ToolbarLabel>
      <ToolbarButton tooltip="Filter"><Filter className="size-4" /></ToolbarButton>
    </Toolbar>
  ),
};

export const VerticalToolbar: Story = {
  name: "Vertical Toolbar",
  render: () => (
    <Toolbar orientation="vertical">
      <ToolbarButton tooltip="Refresh"><RotateCw className="size-4" /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggle active tooltip="Filter on">
        <Filter className="size-4" />
      </ToolbarToggle>
    </Toolbar>
  ),
};

export const ToggleButton: Story = {
  name: "ToolbarToggle (active state)",
  render: () => (
    <Toolbar>
      <ToolbarToggle active>Active</ToolbarToggle>
      <ToolbarToggle>Inactive</ToolbarToggle>
    </Toolbar>
  ),
};

export const ActiveButton: Story = {
  name: "ToolbarButton active",
  render: () => (
    <Toolbar>
      <ToolbarButton active>Active</ToolbarButton>
      <ToolbarButton>Default</ToolbarButton>
    </Toolbar>
  ),
};