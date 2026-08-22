"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  type DefaultLegendContentProps,
  type TooltipContentProps,
  type TooltipValueType,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "aapaetsch-ui-kit";

import type { ChartConfig } from "../../lib/chart-types";
import { formatChartValue } from "../../lib/chart-utils";

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart(): { config: ChartConfig } {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("Chart components must be used inside <ChartContainer />");
  return context;
}

export interface ChartContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
}

/** Responsive chart root that provides series labels and scoped color tokens. */
export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, style, ...props }, ref) => {
    const generatedId = React.useId().replace(/:/g, "");
    const chartId = `chart-${id ?? generatedId}`;

    const colorVariables = React.useMemo(
      () =>
        Object.fromEntries(
          Object.entries(config)
            .filter(([, item]) => item.color)
            .map(([key, item]) => [`--color-${key}`, item.color]),
        ) as React.CSSProperties,
      [config],
    );

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          data-chart={chartId}
          className={cn(
            "flex min-h-48 w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/60 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
            className,
          )}
          style={{ ...colorVariables, ...style }}
          {...props}
        >
          <ResponsiveContainer>{children}</ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  },
);
ChartContainer.displayName = "ChartContainer";

export interface ChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/** Standard chart panel composed from the UI kit's Card primitives. */
export const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, description, actions, children, className, ...props }, ref) => (
    <Card ref={ref} variant="outlined" className={cn("min-w-0", className)} {...props}>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  ),
);
ChartCard.displayName = "ChartCard";

export const ChartTooltip = RechartsTooltip;
export const ChartGrid = CartesianGrid;
export const ChartXAxis = XAxis;
export const ChartYAxis = YAxis;

export interface ChartTooltipContentProps
  extends Partial<TooltipContentProps<TooltipValueType, string>> {
  className?: string;
  indicator?: "dot" | "line";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  valueFormatter?: (value: number) => string;
}

/** Theme-aware tooltip content for Recharts' Tooltip component. */
export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  valueFormatter,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "grid min-w-32 gap-1.5 rounded-md border border-border/70 bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg",
        className,
      )}
    >
      {!hideLabel && label != null ? <div className="font-medium">{label}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? item.name ?? index);
          const itemConfig = config[key];
          const color = item.color ?? item.payload?.fill ?? itemConfig?.color;
          return (
            <div key={key} className="flex min-w-0 items-center gap-2">
              {!hideIndicator ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 bg-[var(--indicator-color)]",
                    indicator === "dot" ? "size-2 rounded-full" : "h-3 w-0.5 rounded-full",
                  )}
                  style={{ "--indicator-color": color } as React.CSSProperties}
                />
              ) : null}
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {itemConfig?.label ?? item.name ?? key}
              </span>
              <span className="font-mono font-medium tabular-nums">
                {formatChartValue(item.value, valueFormatter)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = RechartsLegend;

export interface ChartLegendContentProps extends Partial<DefaultLegendContentProps> {
  className?: string;
  nameKey?: string;
}

/** Compact theme-aware legend content for Recharts' Legend component. */
export function ChartLegendContent({ payload, className, nameKey }: ChartLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3", className)}>
      {payload.map((item) => {
        const sourcePayload = item.payload as Record<string, unknown> | undefined;
        const key = String(nameKey ? sourcePayload?.[nameKey] : item.dataKey ?? item.value);
        const itemConfig = config[key];
        return (
          <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2 rounded-sm bg-[var(--legend-color)]"
              style={{ "--legend-color": item.color ?? itemConfig?.color } as React.CSSProperties}
            />
            <span>{itemConfig?.label ?? item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export type { ChartConfig } from "../../lib/chart-types";
