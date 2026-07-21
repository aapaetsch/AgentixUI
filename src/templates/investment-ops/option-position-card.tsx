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
    <Card variant="elevated" className={cn("w-full", className)}>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <OptionSymbolBadge contract={position} />
          <ExpiryBadge
            expiry={position.expiry}
            daysToExpiry={position.daysToExpiry}
            showDate
          />
          {position.status && (
            <Badge variant="outline" size="medium" className="capitalize">
              {position.status}
            </Badge>
          )}
        </div>
        <Typography variant="overline">Position</Typography>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {showPayoff && (
          <div className="w-full text-primary">
            <PayoffDiagram
              points={points}
              spotPrice={spot}
              currentPnL={position.unrealizedPnL}
              breakevens={breakevens}
              width={320}
              height={120}
              className="w-full"
            />
          </div>
        )}

        <BreakevenBadges values={breakevens} />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex flex-col gap-0.5">
            <Typography variant="overline">Max Profit</Typography>
            <NumericText
              value={maxProfit ?? 0}
              format="currency"
              signed
              colorize
              align="left"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography variant="overline">Max Loss</Typography>
            <NumericText
              value={maxLoss ?? 0}
              format="currency"
              signed
              colorize
              align="left"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography variant="overline">P&L</Typography>
            <NumericText
              value={position.unrealizedPnL}
              format="currency"
              signed
              colorize
              align="left"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography variant="overline">Qty</Typography>
            <NumericText
              value={position.contracts}
              format="number"
              signed
              align="left"
            />
          </div>
        </div>

        <GreeksDisplay
          greeks={position.greeks ?? {}}
          colorize
          signed
          layout="inline"
        />
      </CardContent>
    </Card>
  );
}

OptionPositionCard.displayName = "OptionPositionCard";