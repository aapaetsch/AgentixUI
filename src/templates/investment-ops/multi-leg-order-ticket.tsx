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
  /** Controlled spread template. */
  spread?: SpreadType;
  /** Called whenever the active spread changes. */
  onSpreadChange?: (spread: SpreadType) => void;
  /** Initial legs for uncontrolled usage. Overrides the generated spread legs. */
  defaultLegs?: OptionLeg[];
  /** Controlled leg collection. */
  legs?: OptionLeg[];
  /** Called whenever the leg collection changes. */
  onLegsChange?: (legs: OptionLeg[]) => void;
  /** Custom spread-to-legs factory. */
  createLegsForSpread?: (spread: SpreadType, context: { expiry: number; strike: number }) => OptionLeg[];
  /** Currency code used in totals and preview. @default "USD" */
  currency?: string;
  /** Hide the payoff preview. @default false */
  hidePreview?: boolean;
  /** Replace the standard payoff preview. */
  renderPreview?: (context: { legs: OptionLeg[]; spot: number; net: number }) => React.ReactNode;
  /** Props forwarded to the spread selector. */
  spreadSelectorProps?: Omit<React.ComponentProps<typeof SpreadTypeSelector>, "value" | "onChange">;
  /** Props forwarded to each leg row. */
  legRowProps?: Omit<React.ComponentProps<typeof LegBuilderRow>, "value" | "onChange" | "strikes" | "expiries">;
  /** Props forwarded to the default payoff preview. */
  payoffBundleProps?: Omit<React.ComponentProps<typeof PayoffBundleCard>, "legs" | "spotPrice" | "netDebitCredit">;
  /** Override common ticket labels. */
  labels?: Partial<Record<"title" | "description" | "addLeg" | "net" | "review" | "confirmTitle" | "cancel" | "submit", React.ReactNode>>;
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
  spread: spreadProp,
  onSpreadChange,
  defaultLegs,
  legs: legsProp,
  onLegsChange,
  createLegsForSpread,
  currency = "USD",
  hidePreview = false,
  renderPreview,
  spreadSelectorProps,
  legRowProps,
  payoffBundleProps,
  labels,
  className,
}: MultiLegOrderTicketProps) {
  const [internalSpread, setInternalSpread] = React.useState<SpreadType>(defaultSpread);
  const [internalLegs, setInternalLegs] = React.useState<OptionLeg[]>(() =>
    defaultLegs ?? legsForSpread(
      defaultSpread,
      expiries[Math.floor(expiries.length / 2)] ?? Date.now(),
      strikes[Math.floor(strikes.length / 2)] ?? spot
    )
  );
  const spread = spreadProp ?? internalSpread;
  const legs = legsProp ?? internalLegs;

  const updateLegs = React.useCallback((updater: OptionLeg[] | ((current: OptionLeg[]) => OptionLeg[])) => {
    const next = typeof updater === "function" ? updater(legs) : updater;
    if (legsProp == null) setInternalLegs(next);
    onLegsChange?.(next);
  }, [legs, legsProp, onLegsChange]);
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
      if (spreadProp == null) setInternalSpread(next);
      onSpreadChange?.(next);
      const midExp = expiries[Math.floor(expiries.length / 2)] ?? Date.now();
      const midStrike = strikes[Math.floor(strikes.length / 2)] ?? spot;
      updateLegs(createLegsForSpread?.(next, { expiry: midExp, strike: midStrike }) ?? legsForSpread(next, midExp, midStrike));
    },
    [createLegsForSpread, expiries, onSpreadChange, spreadProp, spot, strikes, updateLegs]
  );

  const updateLeg = React.useCallback(
    (id: string, next: OptionLeg) => {
      updateLegs((prev) => prev.map((l) => (l.id === id ? next : l)));
    },
    [updateLegs]
  );

  const addLeg = React.useCallback(() => {
    updateLegs((prev) => [
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
  }, [strikes, expiries, spot, updateLegs]);

  const removeLeg = React.useCallback((id: string) => {
    updateLegs((prev) => prev.filter((l) => l.id !== id));
  }, [updateLegs]);

  const duplicateLeg = React.useCallback((id: string) => {
    updateLegs((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx < 0) return prev;
      const copy = { ...prev[idx]!, id: newLegId() };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });
  }, [updateLegs]);

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
          <SheetTitle>{labels?.title ?? <>Multi-leg option order · {underlying}</>}</SheetTitle>
          <SheetDescription>
            {labels?.description ?? "Pick a spread template, adjust the legs, preview the payoff, then submit."}
          </SheetDescription>
        </SheetHeader>

        <SpreadTypeSelector {...spreadSelectorProps} value={spread} onChange={handleSpreadChange} />

        <div className="flex flex-col gap-2">
          {legs.map((leg) => (
            <LegBuilderRow
              {...legRowProps}
              key={leg.id}
              value={leg}
              onChange={(next) => updateLeg(leg.id, next)}
              strikes={strikes}
              expiries={expiries}
              onDelete={legRowProps?.onDelete ?? (() => removeLeg(leg.id))}
              onDuplicate={legRowProps?.onDuplicate ?? (() => duplicateLeg(leg.id))}
              disableDelete={legRowProps?.disableDelete ?? legs.length <= 1}
              compact={legRowProps?.compact ?? true}
            />
          ))}
          <Button
            colorStyle="tonal"
            size="sm"
            onClick={addLeg}
            className="w-fit"
          >
            <Plus className="size-3.5" /> {labels?.addLeg ?? "Add leg"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Typography variant="overline">{labels?.net ?? "Net"}</Typography>
          <NumericText
            value={net}
            format="currency"
            currency={currency}
            signed
            colorize
            ariaLabel={`Net ${net < 0 ? "debit" : "credit"} ${Math.abs(net)}`}
          />
        </div>

        {!hidePreview && (renderPreview?.({ legs, spot, net }) ?? (
          <PayoffBundleCard
            {...payoffBundleProps}
            legs={legs}
            spotPrice={spot}
            netDebitCredit={net}
            currency={payoffBundleProps?.currency ?? currency}
          />
        ))}

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
            {labels?.review ?? "Review & submit"}
          </Button>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels?.confirmTitle ?? "Submit multi-leg order?"}</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit a {legs.length}-leg {spread} order on
              {" "}{underlying}. Net{" "}
              {net < 0 ? "debit" : "credit"}{" "}
              <NumericText
                value={Math.abs(net)}
                format="currency"
                currency={currency}
                align="left"
                className="font-semibold"
              />
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels?.cancel ?? "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              {labels?.submit ?? "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}

MultiLegOrderTicket.displayName = "MultiLegOrderTicket";
