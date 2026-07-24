import { Typography, formatCurrency } from "@agentix/ui";
import { computePayoffAtExpiry } from "@agentix/ui/finance";
import { AccountSummary } from "@agentix/ui/templates/investment-ops";

// These imports must fail when TypeScript resolves with the react-server
// custom condition. An unused @ts-expect-error proves client declarations
// leaked ahead of the server declaration condition.
// @ts-expect-error Button is client-only and absent from react-server types.
import { Button } from "@agentix/ui";
// @ts-expect-error OrderBook is client-only and absent from finance-server types.
import { OrderBook } from "@agentix/ui/finance";
// @ts-expect-error Dashboard is client-only and absent from server template types.
import { InvestmentOpsDashboard } from "@agentix/ui/templates/investment-ops";

void Typography;
void formatCurrency;
void computePayoffAtExpiry;
void AccountSummary;
void Button;
void OrderBook;
void InvestmentOpsDashboard;
