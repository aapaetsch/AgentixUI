import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { MultiLegOrderTicket } from "./multi-leg-order-ticket";
import { PremiumToastProvider } from "../../components/toast/api";

const meta: Meta<typeof MultiLegOrderTicket> = {
  title: "Templates/Options/MultiLegOrderTicket",
  component: MultiLegOrderTicket,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MultiLegOrderTicket>;

const strikes = Array.from({ length: 21 }, (_, i) => 380 + i * 5);
const expiries = [
  Date.now() + 7 * 86_400_000,
  Date.now() + 30 * 86_400_000,
  Date.now() + 60 * 86_400_000,
];

// Wrap stories in the premium toast provider since MultiLegOrderTicket uses
// toast.promise for submission feedback.
function withToast(node: React.ReactElement) {
  return <PremiumToastProvider position="bottom-right">{node}</PremiumToastProvider>;
}

export const Default: Story = {
  render: () =>
    withToast(
      (() => {
        const [open, setOpen] = useState(true);
        return (
          <>
            <button
              className="m-4 rounded-md border border-border px-3 py-1"
              onClick={() => setOpen(true)}
            >
              Open ticket
            </button>
            <MultiLegOrderTicket
              open={open}
              onOpenChange={setOpen}
              underlying="SPY"
              strikes={strikes}
              expiries={expiries}
              spot={400}
              defaultSpread="iron-condor"
              onSubmit={async (legs) => {
                // Fake latency so the loading toast shows.
                await new Promise((r) => setTimeout(r, 800));
                // eslint-disable-next-line no-console
                console.log("submitted legs:", legs);
              }}
            />
          </>
        );
      })()
    ),
};

export const SingleLeg: Story = {
  render: () =>
    withToast(
      (() => {
        const [open, setOpen] = useState(true);
        return (
          <MultiLegOrderTicket
            open={open}
            onOpenChange={setOpen}
            underlying="AAPL"
            strikes={strikes}
            expiries={expiries}
            spot={400}
            defaultSpread="single"
            onSubmit={async (legs) => {
              await new Promise((r) => setTimeout(r, 600));
              // eslint-disable-next-line no-console
              console.log(legs);
            }}
          />
        );
      })()
    ),
};

export const Butterfly: Story = {
  render: () =>
    withToast(
      (() => {
        const [open, setOpen] = useState(true);
        return (
          <MultiLegOrderTicket
            open={open}
            onOpenChange={setOpen}
            underlying="SPY"
            strikes={strikes}
            expiries={expiries}
            spot={400}
            defaultSpread="butterfly"
            onSubmit={async (legs) => {
              await new Promise((r) => setTimeout(r, 700));
              // eslint-disable-next-line no-console
              console.log(legs);
            }}
          />
        );
      })()
    ),
};

export const RejectedSubmit: Story = {
  render: () =>
    withToast(
      (() => {
        const [open, setOpen] = useState(true);
        return (
          <MultiLegOrderTicket
            open={open}
            onOpenChange={setOpen}
            underlying="AMZN"
            strikes={strikes}
            expiries={expiries}
            spot={400}
            defaultSpread="iron-condor"
            onSubmit={async () => {
              await new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Broker rejected order")), 600)
              );
            }}
          />
        );
      })()
    ),
};

export const ControlledCustomized: Story = {
  render: () =>
    withToast(
      (() => {
        const [open, setOpen] = useState(true);
        const [spread, setSpread] = useState<"single" | "vertical">("vertical");
        return (
          <MultiLegOrderTicket
            open={open}
            onOpenChange={setOpen}
            underlying="SPY"
            strikes={strikes}
            expiries={expiries}
            spot={400}
            spread={spread}
            onSpreadChange={(next) => {
              if (next === "single" || next === "vertical") setSpread(next);
            }}
            spreadSelectorProps={{ options: ["single", "vertical"], labels: { single: "One leg", vertical: "Two legs" } }}
            legRowProps={{ contractStep: 5, labels: { buy: "Long", sell: "Short" } }}
            payoffBundleProps={{ showBreakevens: false, payoffDiagramProps: { variant: "line" } }}
            currency="CAD"
            labels={{ title: "Build an options strategy", addLeg: "Add another leg", review: "Review strategy" }}
            onSubmit={async () => undefined}
          />
        );
      })()
    ),
};
