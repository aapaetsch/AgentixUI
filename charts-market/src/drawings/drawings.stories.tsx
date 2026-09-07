import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MarketChart } from "../components/market-chart";
import type { DrawingState } from "../core";
import { DrawingInlineTextEditor, type DrawingInteractionConfig, type DrawingPreferences } from ".";

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
  showObjectTree?: boolean;
}

function DrawingPlayground({ initialDrawings = baselineDrawings, initialSelection = ["angle"], interaction, height = 500, showObjectTree = false }: DrawingPlaygroundProps) {
  const [drawings, setDrawings] = React.useState(initialDrawings);
  const [selectedDrawingIds, setSelectedDrawingIds] = React.useState(initialSelection);
  const [tool, setTool] = React.useState<string>();
  const [preferences, setPreferences] = React.useState<Partial<DrawingPreferences>>({ favoriteToolIds: ["trend-line", "parallel-channel", "anchored-vwap"], recentToolIds: ["date-price-range", "fibonacci-retracement"], keepDrawingMode: false, defaults: {}, templates: [] });
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
    drawingPreferences={preferences}
    onDrawingPreferencesChange={setPreferences}
    showDrawingObjectTree={showObjectTree}
    onCreateDrawingAlert={(id) => console.info("Create consumer-owned drawing alert", id)}
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

const practicalDrawings: DrawingState[] = [
  { id: "channel", name: "Primary channel", type: "parallel-channel", version: 1, points: [{ time: 8, price: 102 }, { time: 50, price: 128 }, { time: 12, price: 112 }], parameters: { color: "#0ea5e9", lineWidth: 2, fill: true, fillOpacity: 0.08, showBoundaries: true, showMidline: true }, visible: true, locked: false, groupId: "analysis", zIndex: 0 },
  { id: "range", name: "Earnings move", type: "date-price-range", version: 1, points: [{ time: 26, price: 110 }, { time: 44, price: 128 }], parameters: { color: "#8b5cf6", lineWidth: 1, fillOpacity: 0.12 }, visible: true, locked: false, groupId: "analysis", zIndex: 1 },
  { id: "position", type: "long-position", version: 1, points: [{ time: 47, price: 122 }, { time: 68, price: 142 }, { time: 61, price: 114 }], parameters: { color: "#64748b", lineWidth: 1, accountSize: 25000, riskPercent: 1 }, visible: true, locked: false, zIndex: 2 },
  { id: "fib", type: "fibonacci-retracement", version: 1, points: [{ time: 16, price: 105 }, { time: 65, price: 139 }], parameters: { color: "#f59e0b", lineWidth: 1, showPrices: true, levels: [0, 0.382, 0.5, 0.618, 1], extendRight: true }, visible: true, locked: true, zIndex: 3 },
  { id: "vwap", type: "anchored-vwap", version: 1, points: [{ time: 22, price: 112 }], parameters: { color: "#ec4899", lineWidth: 2, source: "hlc3", band1: true }, visible: true, locked: false, zIndex: 4 },
  { id: "note", name: "Catalyst", type: "price-note", version: 1, points: [{ time: 56, price: 132 }, { time: 49, price: 138 }], parameters: { color: "#22c55e", lineWidth: 1, text: "Breakout confirmation" }, visible: true, locked: false, zIndex: 5 },
];

export const PracticalToolPack: Story = { args: { initialDrawings: practicalDrawings, initialSelection: ["channel", "range"], showObjectTree: true, height: 620 }, parameters: { docs: { description: { story: "A chart-first object-management workspace spanning channels, measurements, positions, Fibonacci, VWAP, annotations, grouped movement, z-order, alerts, favorites, recent tools, and per-tool defaults." } } } };

export const InlinePlainTextEditing: Story = { render: () => { const [value, setValue] = React.useState("Breakout confirmed\nVolume expanding"); return <div className="min-h-48 bg-muted/30 p-8"><DrawingInlineTextEditor value={value} onValueChange={setValue} onCommit={() => undefined} onCancel={() => setValue("")} /></div>; } };
