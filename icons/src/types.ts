import type * as React from "react";

/** Shared SVG attributes accepted by every original AgentixUI icon. */
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "children" | "ref"> {
  /** Square presentation size. Explicit width/height and CSS sizing take precedence. @default "1.5rem" */
  size?: number | string;
}

/** Structural SVG component contract; accepts both original icons and compatible caller-supplied icons. */
export type IconComponent = React.ComponentType<IconProps & React.RefAttributes<SVGSVGElement>>;

