import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { AccountSummary } from "./account-summary";
import type { StatTileProps } from "./stat-tile";
import { Alert, AlertTitle, AlertDescription } from "../../components/alert";

/**
 * # AccountSummary
 *
 * KPI row of `StatTile`s for account-level financials. Renders a 4-tile
 * (sm+ → 2 cols, lg+ → 4) or 6-tile (lg+ → 3 cols) grid. When a `warning`
 * node is provided it renders as an `Alert` below the grid.
 */
const meta: Meta<typeof AccountSummary> = {
  title: "Templates/Investment-Ops/AccountSummary",
  component: AccountSummary,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof AccountSummary>;

const fourTiles: StatTileProps[] = [
  { label: "Cash", value: 12000, format: "currency" },
  { label: "Equity", value: 234000, format: "currency", delta: 2.1, deltaFormat: "percent" },
  { label: "Day P&L", value: -1234, format: "currency", delta: -1.2, deltaFormat: "percent" },
  { label: "Total P&L", value: 8000, format: "currency", delta: 4.3, deltaFormat: "percent" },
];

const sixTiles: StatTileProps[] = [
  ...fourTiles,
  { label: "Margin", value: -1500, format: "currency", delta: -0.4, deltaFormat: "percent" },
  { label: "Buying Power", value: 25000, format: "currency" },
];

// ============================================================================
// Basic Stories
// ============================================================================

export const FourTiles: Story = {
  render: () => <AccountSummary tiles={fourTiles} />,
};

export const SixTiles: Story = {
  render: () => <AccountSummary tiles={sixTiles} />,
};

// ============================================================================
// With warning
// ============================================================================

export const WithWarning: Story = {
  render: () => (
    <AccountSummary
      tiles={fourTiles}
      warning={
        <>
          <AlertTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Margin call warning
          </AlertTitle>
          <AlertDescription>
            Your account is approaching the minimum margin requirement.
          </AlertDescription>
        </>
      }
    />
  ),
};

// ============================================================================
// States
// ============================================================================

export const Loading: Story = {
  render: () => <AccountSummary tiles={fourTiles} loading />,
};