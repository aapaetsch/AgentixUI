import * as React from "react";

import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/card";
import { Avatar, AvatarFallback } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Chip } from "../../components/chip";
import { Typography } from "../../components/typography";
import { MultiSelect } from "../../components/multi-select";
import { ToggleGroup, ToggleGroupItem } from "../../components/toggle-group";
import { ScrollArea } from "../../components/scroll-area";
import { Skeleton } from "../../components/skeleton";
import { formatTime } from "../../lib/date-utils";
import { formatRelativeTime } from "../../lib/time-utils";

export interface NewsItem {
  id: string;
  headline: string;
  snippet: string;
  source: string;
  sourceLogo?: string;
  tickers: string[];
  sentiment: "positive" | "negative" | "neutral";
  /** Epoch ms. */
  time: number;
  blockTrade?: boolean;
}

export interface NewsFeedProps {
  items: NewsItem[];
  tickerOptions?: string[];
  onFilterChange?: (filters: {
    tickers: string[];
    sentiment: ("positive" | "negative" | "neutral")[];
  }) => void;
  onItemOpen?: (item: NewsItem) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * NewsFeed - Composed template for a filterable news feed.
 *
 * Renders a `Card` with a filter bar (`MultiSelect` for tickers, `ToggleGroup`
 * for sentiment), an infinite-scroll `ScrollArea`, and per-item cards with
 * `Avatar`, ticker `Badge`s, sentiment `Chip`, and relative time via
 * `lib/time-utils`.
 *
 * @example
 * ```tsx
 * <NewsFeed items={items} onFilterChange={setFilters} onLoadMore={loadMore} />
 * ```
 */
export function NewsFeed({
  items,
  tickerOptions = [],
  onFilterChange,
  onItemOpen,
  onLoadMore,
  loading = false,
  className,
}: NewsFeedProps) {
  const [tickers, setTickers] = React.useState<string[]>([]);
  const [sentiments, setSentiments] = React.useState<
    ("positive" | "negative" | "neutral")[]
  >([]);

  React.useEffect(() => {
    onFilterChange?.({ tickers, sentiment: sentiments });
  }, [tickers, sentiments, onFilterChange]);

  const filtered = items.filter(
    (it) =>
      (tickers.length === 0 || it.tickers.some((t) => tickers.includes(t))) &&
      (sentiments.length === 0 || sentiments.includes(it.sentiment))
  );

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="border-b">
        <CardTitle>News</CardTitle>
      </CardHeader>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-[hsl(var(--surface-container-low))]">
        {tickerOptions.length > 0 ? (
          <MultiSelect
            options={tickerOptions.map((t) => ({ label: t, value: t }))}
            value={tickers}
            onValueChange={setTickers}
            placeholder="Filter tickers"
          />
        ) : null}
        <ToggleGroup type="multiple" value={sentiments} onValueChange={(v) => setSentiments(v as ("positive"|"negative"|"neutral")[])}>
          <ToggleGroupItem value="positive" size="sm">Positive</ToggleGroupItem>
          <ToggleGroupItem value="negative" size="sm">Negative</ToggleGroupItem>
          <ToggleGroupItem value="neutral" size="sm">Neutral</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ScrollArea className="max-h-[28rem]">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No news matches your filters.
          </div>
        ) : (
          <ul className="divide-y">
            {filtered.map((item) => (
              <NewsFeedRow key={item.id} item={item} onOpen={onItemOpen} />
            ))}
          </ul>
        )}
      </ScrollArea>
    </Card>
  );
}
NewsFeed.displayName = "NewsFeed";

function NewsFeedRow({
  item,
  onOpen,
}: {
  item: NewsItem;
  onOpen?: (item: NewsItem) => void;
}) {
  const sentimentClass =
    item.sentiment === "positive"
      ? "text-positive"
      : item.sentiment === "negative"
      ? "text-negative"
      : "text-muted-foreground";

  return (
    <li
      className="flex items-start gap-3 px-4 py-3 hover:bg-accent/30 cursor-pointer"
      onClick={() => onOpen?.(item)}
    >
      <Avatar size="sm">
        <AvatarFallback>{item.source.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Typography as="span" variant="caption">
            {item.source}
          </Typography>
          <Typography as="span" variant="caption">
            · {formatRelativeTime(item.time)}
          </Typography>
          {item.blockTrade ? <Badge variant="secondary">BLOCK</Badge> : null}
        </div>
        <Typography as="p" variant="body" className="font-medium">
          {item.headline}
        </Typography>
        <Typography as="p" variant="caption" className="truncate">
          {item.snippet}
        </Typography>
        <div className="flex items-center gap-1 mt-1">
          {item.tickers.map((t) => (
            <Badge key={t} variant="secondary">{t}</Badge>
          ))}
          <Chip size="sm" className={sentimentClass}>{item.sentiment}</Chip>
        </div>
      </div>
    </li>
  );
}