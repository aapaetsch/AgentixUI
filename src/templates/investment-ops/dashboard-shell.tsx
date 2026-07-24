import * as React from "react";

import { cn } from "../../lib/utils";
import { Resizable, ResizablePanel, ResizableHandle } from "../../components/resizable";
import { PremiumNavItem as NavItem } from "../../components/navigation/items";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/tabs";
import { ExtendedFAB } from "../../components/fab/extended-fab";
import { Plus, Star, Briefcase, Filter, Newspaper, Bell, Settings } from "lucide-react";

import { AccountSummary } from "./account-summary";
import { Watchlist } from "./watchlist";
import { HoldingsTable } from "./holdings-table";
import { OrderBook } from "../../components/order-book";
import { TimeAndSales } from "../../components/time-and-sales";
import type { OrderBookLevel, Trade, WatchlistItem } from "../../lib/finance-types";
import { OrderTicket, type OrderTicketProps } from "./order-ticket";

export interface InvestmentOpsDashboardProps {
  /** Top-bar Navbar content (search trigger, account switcher, theme toggle). */
  navbar?: React.ReactNode;
  /** Left rail node when the consumer wants a custom rail. */
  leftRail?: React.ReactNode;
  /** Optional order-book data for the right rail. */
  orderBookData?: { bids: OrderBookLevel[]; asks: OrderBookLevel[] };
  /** Optional time-and-sales data for the right rail. */
  tape?: Trade[];
  /** Optional watchlist items for the center "Overview" tab. */
  watchlist?: { items: WatchlistItem[] };
  /** Account summary tiles for the "Overview" tab. */
  accountTiles?: React.ComponentProps<typeof AccountSummary>["tiles"];
  /** Holdings for the "Positions" tab. */
  holdings?: React.ComponentProps<typeof HoldingsTable>["holdings"];
  /** Order ticket props (the FAB opens this Sheet). */
  orderTicket?: OrderTicketProps;
  onOpenOrder?: () => void;
  className?: string;
}

/**
 * InvestmentOpsDashboard - Composed dashboard shell for investment-ops.
 *
 * Composes ONLY already-shipped primitives. This is the integration showcase
 * and regression surface — no new primitives are invented here. Per the plan,
 * any blockers should be added to the relevant earlier phase instead.
 *
 * Layout: Top `Navbar` + horizontal `Resizable` wrapping left rail | center
 * tabs | right rail (vertical `Resizable` of `OrderBook` + `TimeAndSales`).
 * A floating `ExtendedFAB` opens the `OrderTicket` as a right-docked Sheet.
 *
 * @example
 * ```tsx
 * <InvestmentOpsDashboard
 *   navbar={<Navbar>...</Navbar>}
 *   accountTiles={tiles}
 *   watchlist={{ items }}
 *   orderTicket={orderTicketProps}
 * />
 * ```
 */
export function InvestmentOpsDashboard({
  navbar,
  leftRail,
  orderBookData,
  tape,
  watchlist,
  accountTiles,
  holdings,
  orderTicket,
  onOpenOrder,
  className,
}: InvestmentOpsDashboardProps) {
  const [orderOpen, setOrderOpen] = React.useState(false);
  const openOrder = React.useCallback(() => {
    onOpenOrder?.();
    setOrderOpen(true);
  }, [onOpenOrder]);

  return (
    <div className={cn("flex flex-col h-screen bg-background", className)}>
      {navbar ?? (
        <nav className="h-12 border-b flex items-center px-4 gap-2">
          <span className="font-semibold">Investment Ops</span>
        </nav>
      )}

      <Resizable direction="horizontal" autoSaveId="investment-ops-main" className="flex-1 min-h-0">
        {leftRail ?? (
          <ResizablePanel id="left" defaultSize="8%" minSize="6" maxSize="20">
            <Rail />
          </ResizablePanel>
        )}
        <ResizableHandle direction="horizontal" />
        <ResizablePanel id="center" defaultSize="60%" minSize="30">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="border-b px-2 pt-2">
              <TabsList variant="primary">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="flex-1 overflow-auto p-4 space-y-4">
              {accountTiles?.length ? (
                <AccountSummary tiles={accountTiles} />
              ) : null}
              {watchlist?.items.length ? (
                <Watchlist items={watchlist.items} />
              ) : null}
            </TabsContent>
            <TabsContent value="chart" className="flex-1 p-4 text-sm text-muted-foreground">
              Chart tab — external chart lib renders here via render slot.
            </TabsContent>
            <TabsContent value="positions" className="flex-1 overflow-auto p-4">
              {holdings?.length ? <HoldingsTable holdings={holdings} virtualize /> : null}
            </TabsContent>
            <TabsContent value="activity" className="flex-1 overflow-auto">
              {tape?.length ? (
                <TimeAndSales trades={tape} maxRows={100} autoScroll />
              ) : (
                <div className="p-4 text-sm text-muted-foreground">No activity yet.</div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle direction="horizontal" />
        <ResizablePanel id="right" defaultSize="30%" minSize="18" maxSize="50">
          <Resizable direction="vertical" autoSaveId="investment-ops-right" className="h-full">
            <ResizablePanel id="order-book" defaultSize="50%" minSize="20">
              <div className="h-full overflow-hidden border-l">
                {orderBookData ? (
                  <OrderBook bids={orderBookData.bids} asks={orderBookData.asks} maxRows={10} />
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">No order book data.</div>
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle direction="vertical" />
            <ResizablePanel id="tape" defaultSize="50%" minSize="20">
              <div className="h-full overflow-hidden border-l border-t">
                {tape?.length ? (
                  <TimeAndSales trades={tape} maxRows={50} autoScroll className="h-full" />
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">No tape data.</div>
                )}
              </div>
            </ResizablePanel>
          </Resizable>
        </ResizablePanel>
      </Resizable>

      <ExtendedFAB
        label="Place Order"
        icon={<Plus className="size-4" />}
        onClick={openOrder}
        className="fixed bottom-6 right-6 z-40"
      />

      {orderTicket ? (
        <OrderTicket {...orderTicket} open={orderOpen} onOpenChange={setOrderOpen} />
      ) : null}
    </div>
  );
}
InvestmentOpsDashboard.displayName = "InvestmentOpsDashboard";

function Rail() {
  return (
    <div className="h-full border-r bg-[hsl(var(--surface-container-low))]">
      <nav className="flex flex-col gap-1 h-full py-2 px-1">
        <NavItem id="watchlists" label="Watchlists" icon={<Star className="size-4" />} />
        <NavItem id="portfolios" label="Portfolios" icon={<Briefcase className="size-4" />} />
        <NavItem id="screener" label="Screener" icon={<Filter className="size-4" />} />
        <NavItem id="news" label="News" icon={<Newspaper className="size-4" />} />
        <NavItem id="alerts" label="Alerts" icon={<Bell className="size-4" />} />
        <NavItem id="settings" label="Settings" icon={<Settings className="size-4" />} />
      </nav>
    </div>
  );
}