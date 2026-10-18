import * as React from "react";
import type { IconProps } from "./types";
import { cn } from "./lib/utils";

interface IconBaseProps extends IconProps { children?: React.ReactNode; }

/** Internal SVG presentation shared by static, ref-forwarding icon components. */
export const IconBase = React.forwardRef<SVGSVGElement,IconBaseProps>(function IconBase({
  size="1.5rem", width, height, strokeWidth=2, className, children,
  "aria-label":ariaLabel, "aria-labelledby":ariaLabelledby,
  "aria-hidden":ariaHidden, role, focusable=false, ...svgProps
},ref) {
  const named = Boolean(ariaLabel?.trim() || ariaLabelledby?.trim());
  const hidden = ariaHidden ?? !named;
  return <svg
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    width={width ?? size} height={height ?? size} fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    data-slot="icon" {...svgProps}
    ref={ref} className={cn("aapaetsch-icon",className)}
    focusable={focusable} aria-label={ariaLabel} aria-labelledby={ariaLabelledby}
    aria-hidden={hidden} role={role ?? (named && hidden !== true && hidden !== "true" ? "img" : undefined)}
  >{children}</svg>;
});

