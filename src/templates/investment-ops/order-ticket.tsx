import * as React from "react";

import { cn } from "../../lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  sheetContentVariants,
} from "../../components/sheet";
import { ToggleGroup, ToggleGroupItem } from "../../components/toggle-group";
import { Input } from "../../components/input";
import { InputIncrementor } from "../../components/input-incrementor";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/select";
import { Button } from "../../components/button";
import { Alert, AlertTitle, AlertDescription } from "../../components/alert";
import { NumericText } from "../../components/typography";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "../../components/alert-dialog";
import { usePremiumToast } from "../../components/toast/api";

export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop" | "stop-limit";
export type TimeInForce = "day" | "gtc" | "ioc" | "fok";

export interface OrderTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  defaultSide?: OrderSide;
  onSubmit: (order: {
    side: OrderSide;
    type: OrderType;
    quantity: number;
    limitPrice?: number;
    tif: TimeInForce;
  }) => Promise<void>;
  /** Current buying power; used for estimates and insufficient-funds warning. */
  buyingPower?: number;
  /** Estimated order cost. */
  estimatedCost?: number;
  className?: string;
  /** Pattern-day-trader warning flag. */
  patternDayTraderWarning?: boolean;
}

/**
 * OrderTicket - Order entry form for a simple equity flow.
 *
 * v1 scope: ships a simple equity flow only. Multi-leg option support is
 * deferred (per the plan) — document the extension point, do not build it.
 *
 * Defaults to a right-docked `Sheet` per the plan's resolved decision #4.
 *
 * @example
 * ```tsx
 * <OrderTicket open onOpenChange={setOpen} symbol="AAPL" onSubmit={placeOrder} buyingPower={25000} />
 * ```
 */
export function OrderTicket({
  open,
  onOpenChange,
  symbol,
  defaultSide = "buy",
  onSubmit,
  buyingPower,
  estimatedCost,
  className,
  patternDayTraderWarning = false,
}: OrderTicketProps) {
  const [side, setSide] = React.useState<OrderSide>(defaultSide);
  const [type, setType] = React.useState<OrderType>("market");
  const [quantity, setQuantity] = React.useState<number>(100);
  const [limitPrice, setLimitPrice] = React.useState<number | undefined>(undefined);
  const [tif, setTif] = React.useState<TimeInForce>("day");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = usePremiumToast();

  const requiresLimitPrice = type === "limit" || type === "stop-limit";

  const estCost =
    estimatedCost ?? (limitPrice ? limitPrice * quantity : undefined);
  const insufficientFunds =
    buyingPower !== undefined && estCost !== undefined && estCost > buyingPower;

  const reset = React.useCallback(() => {
    setError(null);
    setQuantity(100);
    setLimitPrice(undefined);
    setType("market");
    setTif("day");
    setConfirmOpen(false);
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    if (requiresLimitPrice && (limitPrice === undefined || limitPrice <= 0)) {
      setError("Limit price is required for this order type.");
      return;
    }
    if (insufficientFunds) {
      setError("Insufficient buying power for this order.");
      return;
    }
    setError(null);
    setConfirmOpen(true);
  }, [quantity, requiresLimitPrice, limitPrice, insufficientFunds]);

  const submitOrder = React.useCallback(async () => {
    try {
      await toast.promise(onSubmit({
        side,
        type,
        quantity,
        limitPrice: requiresLimitPrice ? limitPrice : undefined,
        tif,
      }), {
        loading: { title: "Placing order…" },
        success: { title: "Order placed" },
        error: { title: "Order rejected" },
      });
      reset();
      onOpenChange(false);
    } catch {
      // toast.promise already surfaces the error; keep the sheet open.
    }
  }, [side, type, quantity, limitPrice, requiresLimitPrice, tif, onSubmit, toast, reset, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        position="right"
        size="sm"
        className={cn("w-full max-w-md flex flex-col", className)}
      >
        <SheetHeader>
          <SheetTitle>Order — {symbol}</SheetTitle>
          <SheetDescription>Simple equity order placement</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2 overflow-y-auto">
          {/* Side */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Side</label>
            <ToggleGroup
              type="single"
              value={side}
              onValueChange={(v) => v && setSide(v as OrderSide)}
            >
              <ToggleGroupItem value="buy" className="data-[state=on]:bg-positive data-[state=on]:text-positive-foreground">
                Buy
              </ToggleGroupItem>
              <ToggleGroupItem value="sell" className="data-[state=on]:bg-negative data-[state=on]:text-negative-foreground">
                Sell
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Order type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Order type</label>
            <Select value={type} onValueChange={(v) => setType(v as OrderType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
                <SelectItem value="stop-limit">Stop Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Quantity</label>
            <InputIncrementor
              value={quantity}
              onValueChange={setQuantity}
              step={1}
              min={0}
            />
          </div>

          {/* Limit price (conditional) */}
          {requiresLimitPrice ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Limit price</label>
              <Input
                type="number"
                value={limitPrice ?? ""}
                onChange={(e) => setLimitPrice(e.target.value === "" ? undefined : Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          ) : null}

          {/* TIF */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Time in force</label>
            <Select value={tif} onValueChange={(v) => setTif(v as TimeInForce)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="gtc">GTC</SelectItem>
                <SelectItem value="ioc">IOC</SelectItem>
                <SelectItem value="fok">FOK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimates */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Estimated cost</div>
            <div className="text-right tabular-nums">
              {estCost !== undefined ? (
                <NumericText value={estCost} format="currency" align="right" />
              ) : (
                "—"
              )}
            </div>
            <div className="text-muted-foreground">Buying power after</div>
            <div className="text-right tabular-nums">
              {buyingPower !== undefined && estCost !== undefined ? (
                <NumericText value={buyingPower - estCost} format="currency" align="right" />
              ) : (
                "—"
              )}
            </div>
          </div>

          {/* Warnings */}
          {insufficientFunds ? (
            <Alert variant="destructive">
              <AlertTitle>Insufficient funds</AlertTitle>
              <AlertDescription>
                This order exceeds your available buying power.
              </AlertDescription>
            </Alert>
          ) : null}
          {patternDayTraderWarning ? (
            <Alert variant="warning">
              <AlertTitle>Pattern day trader warning</AlertTitle>
              <AlertDescription>
                Your account is flagged as a pattern day trader. More than 4 day
                trades in 5 business days may trigger a margin call.
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Validation errors */}
          {error ? (
            <div role="alert" className="text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </div>

        <SheetFooter className="border-t pt-3">
          <Button className="w-full" onClick={handleSubmit}>
            Review order
          </Button>

          {/* Confirmation */}
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm {side} order</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to {side} {quantity} share{quantity !== 1 ? "s" : ""} of{" "}
                  {symbol} at {type === "market" ? "market" : `$${limitPrice?.toFixed(2)}`} (
                  {tif.toUpperCase()}).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={submitOrder}>Place order</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
OrderTicket.displayName = "OrderTicket";