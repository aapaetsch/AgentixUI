import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { OrderStatus } from "../../lib/trading-workflow-types";
export const orderStatusBadgeVariants=cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",{variants:{status:{pending:"bg-muted text-muted-foreground",working:"bg-primary/10 text-primary",partiallyFilled:"bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]",filled:"bg-[hsl(var(--positive-muted))] text-[hsl(var(--positive))]",cancelled:"bg-muted text-muted-foreground line-through",rejected:"bg-destructive/10 text-destructive"}},defaultVariants:{status:"pending"}});
export interface OrderStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>,VariantProps<typeof orderStatusBadgeVariants>{status:OrderStatus}
const labels:Record<OrderStatus,string>={pending:"Pending",working:"Working",partiallyFilled:"Partially filled",filled:"Filled",cancelled:"Cancelled",rejected:"Rejected"};
export function OrderStatusBadge({status,className,...props}:OrderStatusBadgeProps){return <span className={cn(orderStatusBadgeVariants({status}),className)} {...props}>{labels[status]}</span>}
