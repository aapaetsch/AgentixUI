import * as React from "react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/card";
import { NumericText, Typography } from "../../components/typography";
import { Badge } from "../../components/badge";
import { PayoffDiagram } from "../../components/payoff-diagram";
import { BreakevenBadges } from "../../components/breakeven-badges";
import {
  computePayoffAtExpiry,
  breakevensAtExpiry,
  maxProfitAtExpiry,
  maxLossAtExpiry,
  priceGrid,
} from "../../lib/finance-utils";
import type { OptionLeg } from "../../lib/finance-types";

export interface PayoffBundleCardProps {
  /** Multi-leg position (each leg has `side`, `type`, `strike`, `contracts`). */
  legs: OptionLeg[];
  /** Current underlying spot price. Required — drives the price grid extent. */
  spotPrice: number;
  /** Optional current P&L marker (rendered as a dot at the spot). */
  currentPnL?: number;
  /** Net premium paid/received (debit/credit) for the order. When omitted,
   * computed from `legs[].limitPrice` via `lib/finance-utils.netPremium`. */
  netDebitCredit?: number;
  /** Header label. @default "Payoff at Expiry" */
  title?: React.ReactNode;
  /** Show the breakeven badges row. @default true */
  showBreakevens?: boolean;
  /** Show a tracked dot and price/P&L tooltip over the payoff curve. @default false */
  showHoverDetails?: boolean;
  /** Currency code used for monetary values. @default "USD" */
  currency?: string;
  /** Price-grid range around spot as a decimal. @default 0.25 */
  priceRange?: number;
  /** Number of samples in the payoff grid. @default 81 */
  pointCount?: number;
  /** Show the net debit/credit badge when a net value exists. @default true */
  showNetBadge?: boolean;
  /** Show max-profit and max-loss stats. @default true */
  showStats?: boolean;
  /** Optional header content rendered after the net badge. */
  headerRight?: React.ReactNode;
  /** Override user-facing labels. */
  labels?: Partial<Record<"debit" | "credit" | "maxProfit" | "maxLoss", React.ReactNode>>;
  /** Props forwarded to the payoff primitive. */
  payoffDiagramProps?: Omit<React.ComponentProps<typeof PayoffDiagram>, "points" | "spotPrice" | "currentPnL" | "breakevens">;
  /** Props forwarded to the breakeven primitive. */
  breakevenProps?: Omit<React.ComponentProps<typeof BreakevenBadges>, "values">;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * PayoffBundleCard - composed risk-snapshot card for a multi-leg position.
 *
 * Computes the at-expiry payoff curve via `computePayoffAtExpiry`, then renders
 * a `PayoffDiagram` plus stat tiles for max profit / max loss / net debit (or
 * credit) and a `BreakevenBadges` row. Companion to `MultiLegOrderTicket`.
 *
 * @example
 * ```tsx
 * <PayoffBundleCard legs={legs} spotPrice={400} currentPnL={120} />
 * ```
 */
export function PayoffBundleCard({
  legs,
  spotPrice,
  currentPnL,
  netDebitCredit,
  title = "Payoff at Expiry",
  showBreakevens = true,
  showHoverDetails = false,
  currency = "USD",
  priceRange = 0.25,
  pointCount = 81,
  showNetBadge = true,
  showStats = true,
  headerRight,
  labels,
  payoffDiagramProps,
  breakevenProps,
  className,
}: PayoffBundleCardProps) {
  const prices = React.useMemo(
    () => priceGrid(legs, spotPrice, priceRange, pointCount),
    [legs, pointCount, priceRange, spotPrice]
  );
  const points = React.useMemo(
    () => computePayoffAtExpiry(legs, prices),
    [legs, prices]
  );
  const breakevens = React.useMemo(
    () => breakevensAtExpiry(legs, prices),
    [legs, prices]
  );
  const maxProfit = React.useMemo(
    () => maxProfitAtExpiry(legs, prices),
    [legs, prices]
  );
  const maxLoss = React.useMemo(
    () => maxLossAtExpiry(legs, prices),
    [legs, prices]
  );

  // When the consumer omits `netDebitCredit` for a non-empty position, we
  // intentionally leave `net` undefined so the debit/credit badge is hidden:
  // `computePayoffAtExpiry` already folds `netPremium(legs)` into the curve,
  // so the max profit / max loss tiles below reflect the net cost basis. The
  // explicit badge is only shown when the caller supplies a figure (e.g. an
  // exec broker's actual fill price) that may differ from the leg limits.
  const net = netDebitCredit ?? (legs.length > 0 ? undefined : 0);
  const isDebit = (net ?? 0) < 0;

  return (
    <Card
      variant="outlined"
      aria-label="Multi-leg position payoff summary"
      className={cn("w-full", className)}
    >
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <Typography variant="overline">{title}</Typography>
        <div className="flex items-center gap-2">
        {showNetBadge && net != null && Math.abs(net) > 0 && (
          <Badge variant={isDebit ? "destructive" : "success"} size="medium">
            {isDebit ? labels?.debit ?? "Debit" : labels?.credit ?? "Credit"}{" "}
            <NumericText
              value={Math.abs(net)}
              format="currency"
              currency={currency}
              align="left"
              className="text-white"
            />
          </Badge>
        )}
        {headerRight}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="w-full rounded-md bg-muted/20 p-2">
          <PayoffDiagram
            {...payoffDiagramProps}
            points={points}
            spotPrice={spotPrice}
            currentPnL={currentPnL}
            breakevens={breakevens}
            positiveColor={payoffDiagramProps?.positiveColor ?? "hsl(var(--positive))"}
            negativeColor={payoffDiagramProps?.negativeColor ?? "hsl(var(--negative))"}
            showHoverDetails={showHoverDetails}
            width={payoffDiagramProps?.width ?? 360}
            height={payoffDiagramProps?.height ?? 160}
            className={cn("w-full", payoffDiagramProps?.className)}
          />
        </div>

        {showBreakevens && <BreakevenBadges {...breakevenProps} values={breakevens} currency={breakevenProps?.currency ?? currency} />}

        {showStats && <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border bg-muted/10">
          <div className="flex flex-col gap-0.5 border-r border-border px-3 py-2">
            <Typography variant="overline">{labels?.maxProfit ?? "Max Profit"}</Typography>
            <NumericText
              value={maxProfit ?? 0}
              format="currency"
              currency={currency}
              signed
              colorize
              align="left"
            />
          </div>
          <div className="flex flex-col gap-0.5 px-3 py-2">
            <Typography variant="overline">{labels?.maxLoss ?? "Max Loss"}</Typography>
            <NumericText
              value={maxLoss ?? 0}
              format="currency"
              currency={currency}
              signed
              colorize
              align="left"
            />
          </div>
        </div>}
      </CardContent>
    </Card>
  );
}

PayoffBundleCard.displayName = "PayoffBundleCard";
