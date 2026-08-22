import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MarketChart } from "../components/market-chart";
import type { DrawingState } from "../core";

const data = Array.from({ length: 40 }, (_, index) => ({ time: index + 1, open: 100 + index, high: 102 + index, low: 98 + index, close: 101 + index, volume: 1000 + index * 20 }));
function ControlledDrawings() {
  const [drawings, setDrawings] = React.useState<DrawingState[]>([{ id: "level", type: "horizontal-line", version: 1, points: [{ time: 20, price: 122 }], parameters: { color: "#7c3aed", lineWidth: 2 }, visible: true, locked: false, selected: true }]);
  const [tool, setTool] = React.useState<string>();
  return <MarketChart data={data} symbol="DEMO" drawings={drawings} onDrawingsChange={setDrawings} activeDrawingTool={tool} onActiveDrawingToolChange={setTool} />;
}
const meta = { title: "Charts Market/Drawings", component: ControlledDrawings } satisfies Meta<typeof ControlledDrawings>;
export default meta; export const Controlled: StoryObj<typeof meta> = {};
