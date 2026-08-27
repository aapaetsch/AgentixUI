import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MarketChart } from "../components/market-chart";
import type { DrawingState } from "../core";
import type { DrawingInteractionConfig } from ".";

const data = Array.from({ length: 80 }, (_, index) => ({
  time: index + 1,
  open: 100 + index * 0.45 + Math.sin(index / 3) * 2,
  high: 103 + index * 0.45 + Math.sin(index / 3) * 2,
  low: 97 + index * 0.45 + Math.sin(index / 3) * 2,
  close: 101 + index * 0.45 + Math.sin(index / 3) * 2,
  volume: 1000 + index * 20,
}));

const baselineDrawings: DrawingState[] = [
  { id: "level", type: "horizontal-line", version: 1, points: [{ time: 20, price: 116 }], parameters: { color: "#7c3aed", lineWidth: 2, dashStyle: "dashed" }, visible: true, locked: false },
  { id: "angle", type: "trend-line", version: 1, points: [{ time: 8, price: 102 }, { time: 58, price: 132 }], parameters: { color: "#0ea5e9", lineWidth: 2, dashStyle: "solid" }, visible: true, locked: false },
];

interface DrawingPlaygroundProps {
  initialDrawings?: DrawingState[];
  initialSelection?: string[];
  interaction?: Partial<DrawingInteractionConfig>;
  height?: number;
}

function DrawingPlayground({ initialDrawings = baselineDrawings, initialSelection = ["angle"], interaction, height = 500 }: DrawingPlaygroundProps) {
  const [drawings, setDrawings] = React.useState(initialDrawings);
  const [selectedDrawingIds, setSelectedDrawingIds] = React.useState(initialSelection);
  const [tool, setTool] = React.useState<string>();
  return <MarketChart
    data={data}
    symbol="DEMO"
    height={height}
    drawings={drawings}
    selectedDrawingIds={selectedDrawingIds}
    onSelectedDrawingIdsChange={setSelectedDrawingIds}
    onDrawingsChange={setDrawings}
    activeDrawingTool={tool}
    onActiveDrawingToolChange={setTool}
    drawingInteraction={interaction}
  />;
}

const meta = { title: "Charts Market/Drawings", component: DrawingPlayground, parameters: { layout: "fullscreen" } } satisfies Meta<typeof DrawingPlayground>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  parameters: { docs: { description: { story: "Use the pointer menu to select, multi-select, drag, resize, style, lock, hide, duplicate, or delete drawings. Magnet mode is weak by default; hold Alt to bypass it." } } },
};

export const DarkTheme: Story = {
  decorators: [(StoryComponent) => <div className="dark min-h-screen bg-background p-4"><StoryComponent /></div>],
};

export const NarrowLayout: Story = {
  decorators: [(StoryComponent) => <div className="mx-auto w-[22rem] max-w-full p-2"><StoryComponent /></div>],
  args: { height: 420 },
};

export const TouchTargets: Story = {
  parameters: { viewport: { defaultViewport: "mobile2" } },
  args: { height: 420 },
};

export const SelectedLockedAndHidden: Story = {
  args: {
    initialSelection: ["selected", "locked", "hidden"],
    initialDrawings: [
      { id: "selected", type: "rectangle", version: 1, points: [{ time: 12, price: 101 }, { time: 34, price: 120 }], parameters: { color: "#0ea5e9", lineWidth: 2, fillOpacity: 0.16 }, visible: true, locked: false },
      { id: "locked", type: "ellipse", version: 1, points: [{ time: 38, price: 109 }, { time: 61, price: 132 }], parameters: { color: "#f59e0b", lineWidth: 2, fillOpacity: 0.1 }, visible: true, locked: true },
      { id: "hidden", type: "horizontal-line", version: 1, points: [{ time: 20, price: 126 }], parameters: { color: "#ef4444", lineWidth: 2 }, visible: false, locked: false },
    ],
  },
};

const stressDrawings: DrawingState[] = Array.from({ length: 500 }, (_, index) => ({
  id: `stress-${index}`,
  type: index % 4 === 0 ? "horizontal-line" : index % 4 === 1 ? "trend-line" : index % 4 === 2 ? "rectangle" : "ellipse",
  version: 1,
  points: index % 4 === 0
    ? [{ time: (index % 78) + 1, price: 98 + (index % 40) }]
    : [{ time: (index % 60) + 1, price: 98 + (index % 32) }, { time: (index % 60) + 14, price: 104 + (index % 32) }],
  parameters: { color: index % 2 ? "#0ea5e9" : "#7c3aed", lineWidth: 1, fillOpacity: 0.04 },
  visible: true,
  locked: index % 11 === 0,
}));

export const FiveHundredDrawings: Story = {
  args: { initialDrawings: stressDrawings, initialSelection: [], height: 620 },
  parameters: { docs: { description: { story: "Stress scenario with 500 registry-rendered drawings and mixed lock states." } } },
};
