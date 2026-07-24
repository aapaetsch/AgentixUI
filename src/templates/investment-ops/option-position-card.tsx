import * as React from "react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "../../components/card";
import { NumericText, Typography } from "../../components/typography";
import { Badge } from "../../components/badge";
import { OptionSymbolBadge } from "../../components/option-symbol-badge";
import { ExpiryBadge } from "../../components/expiry-badge";
import { GreeksDisplay } from "../../components/greeks-display";
import { BreakevenBadges } from "../../components/breakeven-badges";
import {
  PayoffDiagram,
} from "../../components/payoff-diagram";
import {
  computePayoffAtExpiry,
  breakevensAtExpiry,
  maxProfitAtExpiry,
  maxLossAtExpiry,
  priceGrid,
} from "../../lib/finance-utils";
import type { OptionPosition, OptionLeg } from "../../lib/finance-types";

export interface OptionPositionCardProps {
  /** The open position to summarize. */
  position: OptionPosition;
  /** Current underlying spot price. @default position.markPrice */
  spotPrice?: number;
  /** Show the inline payoff diagram. @default true */
  showPayoff?: boolean;
  /** Show a tracked dot and price/P&L tooltip over the payoff curve. @default false */
  showHoverDetails?: boolean;
  /** Show expiry metadata. @default true */
  showExpiry?: boolean;
  /** Show position status. @default true */
  showStatus?: boolean;
  /** Show breakeven badges. @default true */
  showBreakevens?: boolean;
  /** Show the summary stat strip. @default true */
  showStats?: boolean;
  /** Show the Greeks readout. @default true */
  showGreeks?: boolean;
  /** Currency code used by monetary values. @default "USD" */
  currency?: string;
  /** Small header descriptor. @default "Position" */
  title?: React.ReactNode;
  /** Content appended to the right side of the header. */
  headerRight?: React.ReactNode;
  /** Override stat labels. */
  labels?: Partial<Record<"maxProfit" | "maxLoss" | "pnl" | "quantity", React.ReactNode>>;
  /** Props forwarded to the payoff primitive. */
  payoffDiagramProps?: Omit<React.ComponentProps<typeof PayoffDiagram>, "points" | "spotPrice" | "currentPnL" | "breakevens">;
  /** Props forwarded to the breakeven primitive. */
  breakevenProps?: Omit<React.ComponentProps<typeof BreakevenBadges>, "values">;
  /** Props forwarded to the Greeks primitive. */
  greeksProps?: Omit<React.ComponentProps<typeof GreeksDisplay>, "greeks">;
  /** Extra classes merged last via `cn()`. */
  className?: string;
}

/**
 * OptionPositionCard - composed template summarizing a single open position.
 *
 * Header: `OptionSymbolBadge` + `ExpiryBadge` + status `Badge`. Body: a mini
 * `PayoffDiagram` (when `showPayoff`), breakevens (`BreakevenBadges`), max
 * profit / max loss `NumericText` tiles, and `GreeksDisplay` for the position.
 *
 * Pure composition — no new primitives. Suitable for a positions detail pane
 * or an at-a-glance roll/adjust screen.
 *
 * @example
 * ```tsx
 * <OptionPositionCard position={position} spotPrice={400} />
 * ```
 */
export function OptionPositionCard({
  position,
  spotPrice,
  showPayoff = true,
  showHoverDetails = false,
  showExpiry = true,
  showStatus = true,
  showBreakevens = true,
  showStats = true,
  showGreeks = true,
  currency = "USD",
  title = "Position",
  headerRight,
  labels,
  payoffDiagramProps,
  breakevenProps,
  greeksProps,
  className,
}: OptionPositionCardProps) {
  const spot = spotPrice ?? position.markPrice;

  const leg: OptionLeg = React.useMemo(
    () => ({
      id: position.root,
      side: position.contracts >= 0 ? "buy" : "sell",
      type: position.type,
      strike: position.strike,
      expiry: position.expiry,
      contracts: Math.abs(position.contracts),
      // `averageCost` may be recorded as a negative credit for shorts (see
      // `OptionPosition.averageCost` JSDoc). `netPremium` already applies the
      // buy/sell sign via `leg.side`, so the per-share price must be a
      // non-negative magnitude; normalize with `Math.abs` so credit semantics
      // are correct regardless of how the consuming app signs shorts.
      limitPrice: Math.abs(position.averageCost),
    }),
    [position]
  );

  const prices = React.useMemo(
    () => priceGrid([leg], spot, 0.3, 81),
    [leg, spot]
  );
  const points = React.useMemo(
    () => computePayoffAtExpiry([leg], prices),
    [leg, prices]
  );
  const breakevens = React.useMemo(
    () => breakevensAtExpiry([leg], prices),
    [leg, prices]
  );
  const maxProfit = React.useMemo(
    () => maxProfitAtExpiry([leg], prices),
    [leg, prices]
  );
  const maxLoss = React.useMemo(
    () => maxLossAtExpiry([leg], prices),
    [leg, prices]
  );

  return (
    <Card
      variant="elevated"
      className={cn(
        "w-full overflow-hidden border-l-4",
        position.type === "call" ? "border-l-positive" : "border-l-negative",
        className
      )}
    >
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <OptionSymbolBadge contract={position} />
          {showExpiry && <ExpiryBadge
            expiry={position.expiry}
            daysToExpiry={position.daysToExpiry}
            showDate
          />}
          {showStatus && position.status && (
            <Badge variant="outline" size="medium" className="capitalize">
              {position.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="overline">{title}</Typography>
          {headerRight}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {showPayoff && (
          <div className="w-full rounded-md bg-muted/20 p-2">
            <PayoffDiagram
              {...payoffDiagramProps}
              points={points}
              spotPrice={spot}
              currentPnL={position.unrealizedPnL}
              breakevens={breakevens}
              positiveColor={payoffDiagramProps?.positiveColor ?? "hsl(var(--positive))"}
              negativeColor={payoffDiagramProps?.negativeColor ?? "hsl(var(--negative))"}
              showHoverDetails={showHoverDetails}
              width={payoffDiagramProps?.width ?? 320}
              height={payoffDiagramProps?.height ?? 120}
              className={cn("w-full", payoffDiagramProps?.className)}
            />
          </div>
        )}

        {showBreakevens && (
          <BreakevenBadges
            {...breakevenProps}
            values={breakevens}
            currency={breakevenProps?.currency ?? currency}
          />
        )}

        {showStats && <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border bg-muted/10 sm:grid-cols-4 sm:divide-x sm:divide-border">
          <div className="flex flex-col gap-0.5 p-2.5">
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
          <div className="flex flex-col gap-0.5 p-2.5">
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
          <div className={cn("flex flex-col gap-0.5 p-2.5", position.unrealizedPnL >= 0 ? "bg-positive/5" : "bg-negative/5")}>
            <Typography variant="overline">{labels?.pnl ?? "P&L"}</Typography>
            <NumericText
              value={position.unrealizedPnL}
              format="currency"
              currency={currency}
              signed
              colorize
              align="left"
            />
          </div>
          <div className="flex flex-col gap-0.5 p-2.5">
            <Typography variant="overline">{labels?.quantity ?? "Qty"}</Typography>
            <NumericText
              value={position.contracts}
              format="number"
              signed
              align="left"
            />
          </div>
        </div>}

        {showGreeks && <GreeksDisplay
          {...greeksProps}
          greeks={position.greeks ?? {}}
          colorize={greeksProps?.colorize ?? true}
          signed={greeksProps?.signed ?? true}
          layout={greeksProps?.layout ?? "inline"}
        />}
      </CardContent>
    </Card>
  );
}

OptionPositionCard.displayName = "OptionPositionCard";
