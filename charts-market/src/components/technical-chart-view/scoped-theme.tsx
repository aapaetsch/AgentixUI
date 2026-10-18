import * as React from "react";
import { DialogContent as BaseDialogContent, DropdownMenuContent as BaseDropdownMenuContent, TooltipContent as BaseTooltipContent, cn } from "aapaetsch-ui-kit";

export type TechnicalChartTheme = "light" | "dark" | "midnight";
/** HSL channels, matching the UI kit CSS variable contract. Applied to root AND portals. */
export const technicalChartThemes: Record<TechnicalChartTheme, React.CSSProperties> = {
  light: { "--background": "0 0% 100%", "--foreground": "222 47% 11%", "--muted": "210 40% 96%", "--muted-foreground": "215 25% 35%", "--popover": "0 0% 100%", "--popover-foreground": "222 47% 11%", "--primary": "222 47% 11%", "--primary-foreground": "0 0% 100%", "--accent": "210 40% 94%", "--accent-foreground": "222 47% 11%", "--border": "214 25% 80%", "--input": "214 25% 80%", "--ring": "215 80% 40%", "--positive": "155 80% 27%", "--negative": "345 75% 38%" } as React.CSSProperties,
  dark: { "--background": "222 30% 10%", "--foreground": "210 40% 98%", "--muted": "217 25% 20%", "--muted-foreground": "215 20% 75%", "--popover": "222 30% 10%", "--popover-foreground": "210 40% 98%", "--primary": "210 40% 98%", "--primary-foreground": "222 47% 11%", "--accent": "217 25% 23%", "--accent-foreground": "210 40% 98%", "--border": "217 20% 30%", "--input": "217 20% 30%", "--ring": "210 80% 70%", "--positive": "155 65% 60%", "--negative": "345 85% 70%" } as React.CSSProperties,
  midnight: { "--background": "240 45% 7%", "--foreground": "220 50% 96%", "--muted": "240 30% 17%", "--muted-foreground": "220 25% 78%", "--popover": "240 45% 7%", "--popover-foreground": "220 50% 96%", "--primary": "220 50% 96%", "--primary-foreground": "240 45% 7%", "--accent": "240 30% 22%", "--accent-foreground": "220 50% 96%", "--border": "240 20% 32%", "--input": "240 20% 32%", "--ring": "200 80% 70%", "--positive": "165 70% 65%", "--negative": "340 90% 75%" } as React.CSSProperties,
};
for (const palette of Object.values(technicalChartThemes)) Object.assign(palette, {
  "--chart-1": "200 85% 48%", "--chart-2": "35 90% 48%", "--chart-3": "270 80% 65%", "--chart-4": "165 65% 45%", "--chart-5": "335 80% 65%",
  "--secondary": palette["--muted" as keyof React.CSSProperties], "--secondary-foreground": palette["--foreground" as keyof React.CSSProperties], "--destructive": palette["--negative" as keyof React.CSSProperties],
});
export const ChartThemeContext = React.createContext<{ theme?: TechnicalChartTheme; style?: React.CSSProperties }>({});
function usePortalTheme(className?: string, style?: React.CSSProperties) {
  const scope = React.useContext(ChartThemeContext);
  return { className: cn(scope.theme && scope.theme !== "light" && "dark", className), style: { ...scope.style, ...style } };
}
export const DialogContent = React.forwardRef<React.ElementRef<typeof BaseDialogContent>, React.ComponentPropsWithoutRef<typeof BaseDialogContent>>(({ className, style, ...props }, ref) => <BaseDialogContent ref={ref} {...props} {...usePortalTheme(className, style)} />);
export const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof BaseDropdownMenuContent>, React.ComponentPropsWithoutRef<typeof BaseDropdownMenuContent>>(({ className, style, ...props }, ref) => <BaseDropdownMenuContent ref={ref} {...props} {...usePortalTheme(className, style)} />);
export const TooltipContent = React.forwardRef<React.ElementRef<typeof BaseTooltipContent>, React.ComponentPropsWithoutRef<typeof BaseTooltipContent>>(({ className, style, ...props }, ref) => <BaseTooltipContent ref={ref} {...props} {...usePortalTheme(className, style)} />);
