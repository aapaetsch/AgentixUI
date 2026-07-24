import * as React from "react";

import { cn } from "../../lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/avatar";

export interface TickerImageProps {
  /** Ticker symbol (used for the fallback initials). */
  symbol: string;
  /** Optional logo URL. When omitted, only the fallback initials render. */
  src?: string;
  /** Avatar size. @default "xs" (24px) — tuned for inline table rows. */
  size?: "xs" | "sm" | "md";
  className?: string;
  /** Accessible alt text for the logo. @default `${symbol} logo` */
  alt?: string;
}

/**
 * TickerImage - Small brand-mark avatar for a ticker symbol.
 *
 * Composes the existing `Avatar` primitive (Radix Avatar). No new primitive is
 * invented here — this is a thin presentation helper shared by the
 * `Watchlist` and `HoldingsTable` templates so the ticker image column stays
 * consistent. When `src` is omitted or the image fails to load, Radix's
 * `AvatarFallback` shows the symbol's first character(s).
 */
export function TickerImage({
  symbol,
  src,
  size = "xs",
  className,
  alt,
}: TickerImageProps) {
  const fallback = React.useMemo(() => initialsFor(symbol), [symbol]);
  return (
    <Avatar size={size} shape="circle" className={cn("bg-muted", className)}>
      {src ? (
        <AvatarImage src={src} alt={alt ?? `${symbol} logo`} />
      ) : null}
      <AvatarFallback className="text-[10px] font-medium text-muted-foreground">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
TickerImage.displayName = "TickerImage";

function initialsFor(symbol: string): string {
  const cleaned = symbol.trim();
  if (!cleaned) return "?";
  // For tickers with a class suffix (e.g. "BRK.A", "BRK/B") keep the prefix.
  const base = cleaned.split(/[./]/)[0];
  if (base.length <= 2) return base.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}