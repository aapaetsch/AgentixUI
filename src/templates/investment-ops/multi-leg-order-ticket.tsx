import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/sheet";
import { Button } from "../../components/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "../../components/alert-dialog";
import { NumericText, Typography } from "../../components/typography";
import { Alert, AlertDescription } from "../../components/alert";
import { usePremiumToast } from "../../components/toast/api";

import { LegBuilderRow } from "../../components/leg-builder-row";
import { SpreadTypeSelector, type SpreadType } from "../../components/spread-type-selector";
import { PayoffBundleCard } from "./payoff-bundle-card";
import {
  netPremium,
} from "../../lib/finance-utils";
import type { OptionLeg } from "../../lib/finance-types";

export interface MultiLegOrderTicketProps {
  /** Sheet open state (controlled). */
  open: boolean;
  /** Toggle the sheet open state. */
  onOpenChange: (open: boolean) => void;
  /** Underlying root symbol (e.g. `"SPY"`). */
  underlying: string;
  /** Available strikes for the chosen expiry (passed to each leg row). */
  strikes: number[];
  /** Available expiries (epoch ms), passed to each leg row. */
  expiries: number[];
  /** Current spot price (drives the payoff preview). */
  spot: number;
  /**
   * Called with the final legs on submit. Should return a Promise that
   * resolves on success and rejects on rejection (matches `OrderTicket`).
   */
  onSubmit: (legs: OptionLeg[]) => Promise<void>;
  /** Initial spread template. @default "single" */
  defaultSpread?: SpreadType;
  /** Extra classes for the sheet content. */
  className?: string;
}

// Module-level counter for stable, unique leg row keys.
//
// Note: This is intentionally NOT `React.useId()`. `useId` is for SSR-stable
// aria associations, not necessarily list-row keys. A session-unique monotonic
// counter is sufficient for React row keys here: keys only need to be stable
// across re-renders of the same instance (which this guarantees) — they do
// not need to be deterministic across remounts, hot reloads, or separate
// Storybook stories. Each `MultiLegOrderTicket` instance generates fresh IDs
// via the lazy `useState` initializer and the add/duplicate handlers, so
// there is no cross-instance key collision risk.
let legSeq = 0;
function newLegId(): string {
  legSeq += 1;
  return `leg-${legSeq}`;
}

/** Map a spread template to initial leg skeletons. */
function legsForSpread(
  spread: SpreadType,
  defaultExpiry: number,
  defaultStrike: number
): OptionLeg[] {
  const base = (overrides: Partial<OptionLeg>): OptionLeg => ({
    id: newLegId(),
    side: "buy",
    type: "call",
    strike: defaultStrike,
    expiry: defaultExpiry,
    contracts: 1,
    ...overrides,
  });
  switch (spread) {
    case "single":
      return [base({})];
    case "vertical":
      return [
        base({ side: "buy", type: "call", strike: defaultStrike }),
        base({ side: "sell", type: "call", strike: defaultStrike + 5 }),
      ];
    case "calendar":
      return [
        base({ side: "sell", type: "call", expiry: defaultExpiry }),
        base({ side: "buy", type: "call", expiry: defaultExpiry + 30 * 86_400_000 }),
      ];
    case "straddle":
      return [
        base({ side: "buy", type: "call" }),
        base({ side: "buy", type: "put" }),
      ];
    case "strangle":
      return [
        base({ side: "buy", type: "call", strike: defaultStrike + 5 }),
        base({ side: "buy", type: "put", strike: defaultStrike - 5 }),
      ];
    case "iron-condor":
      return [
        base({ side: "buy", type: "put", strike: defaultStrike - 20 }),
        base({ side: "sell", type: "put", strike: defaultStrike - 10 }),
        base({ side: "sell", type: "call", strike: defaultStrike + 10 }),
        base({ side: "buy", type: "call", strike: defaultStrike + 20 }),
      ];
    case "butterfly":
      return [
        base({ side: "buy", type: "call", strike: defaultStrike - 10 }),
        base({ side: "sell", type: "call", strike: defaultStrike, contracts: 2 }),
        base({ side: "buy", type: "call", strike: defaultStrike + 10 }),
      ];
  }
}

/**
 * MultiLegOrderTicket - composed template for building/submitting multi-leg option orders.
 *
 * Wraps a `Sheet` with a `SpreadTypeSelector` (pre-fills legs), a dynamic list
 * of `LegBuilderRow`s, a `PayoffBundleCard` preview, net debit/credit
 * `NumericText`, and an `AlertDialog`-confirmed submit that fires
 * `toast.promise(onSubmit(legs))` — mirroring `OrderTicket` exactly.
 *
 * @example
 * ```tsx
 * <MultiLegOrderTicket open onOpenChange={setOpen} underlying="SPY"
 *   strikes={[380, 390, 400, 410, 420]} expiries={expiries} spot={400}
 *   onSubmit={async (legs) => api.placeMultiLeg(legs)} />
 * ```
 */
export function MultiLegOrderTicket({
  open,
  onOpenChange,
  underlying,
  strikes,
  expiries,
  spot,
  onSubmit,
  defaultSpread = "single",
  className,
}: MultiLegOrderTicketProps) {
  const [spread, setSpread] = React.useState<SpreadType>(defaultSpread);
  const [legs, setLegs] = React.useState<OptionLeg[]>(() =>
    legsForSpread(
      defaultSpread,
      expiries[Math.floor(expiries.length / 2)] ?? Date.now(),
      strikes[Math.floor(strikes.length / 2)] ?? spot
    )
  );
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = usePremiumToast();

  // Clear any stale validation error as soon as the legs change so an
  // old "non-zero contract" message doesn't linger after the user edits.
  React.useEffect(() => {
    setError(null);
  }, [legs]);

  // When the spread template changes, replace the legs.
  const handleSpreadChange = React.useCallback(
    (next: SpreadType) => {
      setSpread(next);
      const midExp = expiries[Math.floor(expiries.length / 2)] ?? Date.now();
      const midStrike = strikes[Math.floor(strikes.length / 2)] ?? spot;
      setLegs(legsForSpread(next, midExp, midStrike));
    },
    [expiries, strikes, spot]
  );

  const updateLeg = React.useCallback(
    (id: string, next: OptionLeg) => {
      setLegs((prev) => prev.map((l) => (l.id === id ? next : l)));
    },
    []
  );

  const addLeg = React.useCallback(() => {
    setLegs((prev) => [
      ...prev,
      {
        id: newLegId(),
        side: "buy",
        type: "call",
        strike: strikes[Math.floor(strikes.length / 2)] ?? spot,
        expiry: expiries[Math.floor(expiries.length / 2)] ?? Date.now(),
        contracts: 1,
      },
    ]);
  }, [strikes, expiries, spot]);

  const removeLeg = React.useCallback((id: string) => {
    setLegs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const duplicateLeg = React.useCallback((id: string) => {
    setLegs((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx < 0) return prev;
      const copy = { ...prev[idx]!, id: newLegId() };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  }, []);

  const net = React.useMemo(() => netPremium(legs), [legs]);
  const isValid = legs.length > 0 && legs.every((l) => l.contracts !== 0);

  const handleSubmit = React.useCallback(async () => {
    if (!isValid) {
      setError("Each leg must have a non-zero contract count.");
      return;
    }
    setError(null);
    setConfirmOpen(false);
    try {
      await toast.promise(onSubmit(legs), {
        loading: { title: "Placing multi-leg order…" },
        success: { title: "Order placed" },
        error: { title: "Order rejected" },
      });
      onOpenChange(false);
    } catch {
      // `toast.promise` already surfaces the rejection as an error toast.
      // Swallow it here to avoid an unhandled promise rejection warning and
      // keep the sheet open so the user can retry. Mirrors `OrderTicket`.
    }
  }, [isValid, legs, onSubmit, toast, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        position="right"
        size="md"
        className={cn("flex flex-col gap-4 overflow-y-auto", className)}
      >
        <SheetHeader>
          <SheetTitle>Multi-leg option order · {underlying}</SheetTitle>
          <SheetDescription>
            Pick a spread template, adjust the legs, preview the payoff, then submit.
          </SheetDescription>
        </SheetHeader>

        <SpreadTypeSelector value={spread} onChange={handleSpreadChange} />

        <div className="flex flex-col gap-2">
          {legs.map((leg) => (
            <LegBuilderRow
              key={leg.id}
              value={leg}
              onChange={(next) => updateLeg(leg.id, next)}
              strikes={strikes}
              expiries={expiries}
              onDelete={() => removeLeg(leg.id)}
              onDuplicate={() => duplicateLeg(leg.id)}
              disableDelete={legs.length <= 1}
              compact
            />
          ))}
          <Button
            colorStyle="tonal"
            size="sm"
            onClick={addLeg}
            className="w-fit"
          >
            <Plus className="size-3.5" /> Add leg
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Typography variant="overline">Net</Typography>
          <NumericText
            value={net}
            format="currency"
            signed
            colorize
            ariaLabel={`Net ${net < 0 ? "debit" : "credit"} ${Math.abs(net)}`}
          />
        </div>

        <PayoffBundleCard legs={legs} spotPrice={spot} netDebitCredit={net} />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SheetFooter className="mt-auto">
          <Button
            colorStyle="filled"
            onClick={() => setConfirmOpen(true)}
            disabled={!isValid}
          >
            Review &amp; submit
          </Button>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit multi-leg order?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit a {legs.length}-leg {spread} order on
              {" "}{underlying}. Net{" "}
              {net < 0 ? "debit" : "credit"}{" "}
              <NumericText
                value={Math.abs(net)}
                format="currency"
                align="left"
                className="font-semibold"
              />
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}

MultiLegOrderTicket.displayName = "MultiLegOrderTicket";