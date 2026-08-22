import type { Meta, StoryObj } from "@storybook/react";

import { MultiChartLayout, TechnicalWorkspace, WorkspaceLayoutManager } from ".";

const chart = (id: string) => ({ id, content: <div className="grid min-h-52 place-items-center bg-background font-mono text-sm text-muted-foreground">{id.toUpperCase()}</div> });

const meta = { title: "Charts Market/TechnicalWorkspace", component: TechnicalWorkspace, parameters: { layout: "fullscreen" } } satisfies Meta<typeof TechnicalWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FourCharts: Story = { render: () => (
  <TechnicalWorkspace
    watchlist={<div className="p-3 text-sm">Watchlist</div>}
    details={<div className="p-3 text-sm">Details &amp; news</div>}
    lowerPanel={<div className="p-3 text-sm">Positions</div>}
  >
    <div><WorkspaceLayoutManager layouts={[{ id: "main", name: "Main workspace" }]} value="main" /><MultiChartLayout preset={4} charts={[chart("aapl"), chart("msft"), chart("nvda"), chart("spy")]} activeChartId="aapl" /></div>
  </TechnicalWorkspace>
) };
