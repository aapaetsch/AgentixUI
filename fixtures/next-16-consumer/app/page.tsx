import { Typography, formatCurrency } from "@agentix/ui";
import { computePayoffAtExpiry } from "@agentix/ui/finance";
import { AccountSummary } from "@agentix/ui/templates/investment-ops";

import { InteractiveSmoke } from "./interactive-smoke";

export default function Home() {
  const payoff = computePayoffAtExpiry(
    [
      {
        id: "fixture-call",
        type: "call",
        side: "buy",
        strike: 100,
        expiry: Date.UTC(2027, 0, 15),
        contracts: 1,
        limitPrice: 5,
      },
    ],
    [110]
  );

  return (
    <main style={{ minHeight: "100vh", padding: "2rem" }}>
      <Typography variant="h1">Packed artifact consumer</Typography>
      <Typography>
        Server imports: {formatCurrency(1234.5)} / payoff {payoff[0].value}
      </Typography>
      <AccountSummary
        tiles={[
          {
            label: "Portfolio value",
            value: 1234.5,
          },
        ]}
      />
      <InteractiveSmoke />
    </main>
  );
}
