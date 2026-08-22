"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import type { AlertRule, ComparisonOperator } from "../../lib/trading-workflow-types";

const controlClass = "h-11 rounded-[var(--radius)] border-2 border-border bg-background px-3 text-sm outline-none focus-visible:border-ring";
const operators: Array<{ value: ComparisonOperator; label: string }> = [
  { value: "greaterThan", label: ">" }, { value: "greaterThanOrEqual", label: "≥" },
  { value: "lessThan", label: "<" }, { value: "lessThanOrEqual", label: "≤" }, { value: "equal", label: "=" },
];

export interface AlertRuleEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: AlertRule;
  fields?: Array<{ id: string; label: string }>;
  onValueChange: (value: AlertRule) => void;
}

/** Controlled editor for alert intent; it never evaluates the rule. */
export function AlertRuleEditor({ value, fields = [{ id: "price", label: "Last price" }, { id: "volume", label: "Volume" }], onValueChange, className, ...props }: AlertRuleEditorProps) {
  const change = <K extends keyof AlertRule>(key: K, next: AlertRule[K]) => onValueChange({ ...value, [key]: next });
  return <div className={cn("grid gap-3 sm:grid-cols-[minmax(7rem,1fr)_minmax(8rem,1fr)_5rem_minmax(7rem,1fr)]", className)} {...props}>
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">Symbol<input className={cn(controlClass, "font-mono uppercase")} value={value.symbol} onChange={(event) => change("symbol", event.target.value.toUpperCase())} /></label>
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">Field<select className={controlClass} value={value.field} onChange={(event) => change("field", event.target.value)}>{fields.map((field) => <option key={field.id} value={field.id}>{field.label}</option>)}</select></label>
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">Rule<select className={controlClass} value={value.operator} onChange={(event) => change("operator", event.target.value as ComparisonOperator)}>{operators.map((operator) => <option key={operator.value} value={operator.value}>{operator.label}</option>)}</select></label>
    <label className="grid gap-1 text-xs font-medium text-muted-foreground">Threshold<input className={cn(controlClass, "font-mono tabular-nums")} type="number" value={value.threshold} onChange={(event) => change("threshold", Number(event.target.value))} /></label>
  </div>;
}
