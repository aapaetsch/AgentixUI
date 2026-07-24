import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { OrderTicket } from "./order-ticket";
import { PremiumToastProvider } from "../../components/toast/api";
import { Button } from "../../components/button";

/**
 * # OrderTicket
 *
 * Order entry form for a simple equity flow. Defaults to a right-docked
 * `Sheet`. Uses `ToggleGroup`, `InputIncrementor`, `Select`, `AlertDialog`,
 * and `toast.promise` for submission feedback.
 *
 * v1 scope: ships a simple equity flow only. Multi-leg option support is
 * deferred (per the plan).
 */
const meta: Meta<typeof OrderTicket> = {
  title: "Templates/Investment-Ops/OrderTicket",
  component: OrderTicket,
  tags: ["autodocs"],
  argTypes: {
    symbol: { control: "text" },
    defaultSide: {
      control: "select",
      options: ["buy", "sell"],
    },
    buyingPower: { control: "number" },
    patternDayTraderWarning: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof OrderTicket>;

// Wrap stories in the premium toast provider since OrderTicket uses
// toast.promise for submission feedback.
function withToast(node: React.ReactElement) {
  return <PremiumToastProvider position="bottom-right">{node}</PremiumToastProvider>;
}

function OpenButton({
  label,
  onOpen,
}: {
  label: string;
  onOpen: () => void;
}) {
  return <Button onClick={onOpen}>{label}</Button>;
}

// Helper that toggles the sheet open from a trigger button.
function TicketStory({
  symbol,
  defaultSide = "buy",
  buyingPower,
  patternDayTraderWarning = false,
  triggerLabel = "Place Order",
  onSubmit,
}: {
  symbol: string;
  defaultSide?: "buy" | "sell";
  buyingPower?: number;
  patternDayTraderWarning?: boolean;
  triggerLabel?: string;
  onSubmit?: () => Promise<void>;
}) {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <OpenButton label={triggerLabel} onOpen={() => setOpen(true)} />
      <OrderTicket
        open={open}
        onOpenChange={setOpen}
        symbol={symbol}
        defaultSide={defaultSide}
        buyingPower={buyingPower}
        patternDayTraderWarning={patternDayTraderWarning}
        onSubmit={onSubmit ?? (async () => {})}
      />
    </>
  );
}

// ============================================================================
// Basic Stories (open on init to be visible in Storybook)
// ============================================================================

export const Default: Story = {
  render: () =>
    withToast(<TicketStory symbol="AAPL" buyingPower={25000} />),
};

export const Sell: Story = {
  render: () =>
    withToast(
      <TicketStory symbol="NVDA" defaultSide="sell" buyingPower={25000} />
    ),
};

// ============================================================================
// Warnings & validation
// ============================================================================

export const InsufficientFunds: Story = {
  render: () =>
    withToast(
      <TicketStory
        symbol="GOOGL"
        buyingPower={100}
        triggerLabel="Open Order (low buying power)"
      />
    ),
};

export const PatternDayTraderWarning: Story = {
  render: () =>
    withToast(
      <TicketStory
        symbol="TSLA"
        buyingPower={50000}
        patternDayTraderWarning
        triggerLabel="Open Order (PDT)"
      />
    ),
};

// ============================================================================
// Submission flow
// ============================================================================

export const WithSubmitHandler: Story = {
  render: () =>
    withToast(
      <TicketStory
        symbol="META"
        buyingPower={100000}
        triggerLabel="Open Order (live submit)"
        onSubmit={async () => {
          // Simulate a network latency so the toast.promise loading state shows.
          await new Promise((resolve) => setTimeout(resolve, 600));
        }}
      />
    ),
};

export const RejectedSubmit: Story = {
  render: () =>
    withToast(
      <TicketStory
        symbol="AMZN"
        buyingPower={100000}
        triggerLabel="Open Order (rejects)"
        onSubmit={async () => {
          await new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Broker rejected order")), 600)
          );
        }}
      />
    ),
};