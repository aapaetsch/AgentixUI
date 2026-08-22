"use client";
import * as React from "react";
import { Button } from "../button";
import { Switch } from "../switch";
import { cn } from "../../lib/utils";
import type { AlertRule } from "../../lib/trading-workflow-types";
export interface AlertManagerProps extends React.HTMLAttributes<HTMLDivElement> { rules: AlertRule[]; onEnabledChange?: (id: string, enabled: boolean) => void; onEdit?: (rule: AlertRule) => void; onDelete?: (rule: AlertRule) => void }
export function AlertManager({ rules, onEnabledChange, onEdit, onDelete, className, ...props }: AlertManagerProps) {
  return <div className={cn("overflow-x-auto", className)} {...props}><table className="w-full min-w-[40rem] text-left text-sm"><caption className="sr-only">Alert rules</caption><thead className="border-b border-border text-xs text-muted-foreground"><tr>{["Enabled","Symbol","Condition","Actions"].map((x)=><th key={x} className="px-3 py-2 font-medium">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{rules.map((rule)=><tr key={rule.id}><td className="px-3 py-2"><Switch checked={rule.enabled} onCheckedChange={(checked)=>onEnabledChange?.(rule.id,checked)} aria-label={`${rule.symbol} alert enabled`} /></td><th scope="row" className="px-3 py-2 font-mono">{rule.symbol}</th><td className="px-3 py-2 text-muted-foreground">{rule.field} {rule.operator} <span className="font-mono text-foreground">{rule.threshold}</span></td><td className="px-3 py-2"><div className="flex gap-1"><Button size="sm" colorStyle="ghost" onClick={()=>onEdit?.(rule)}>Edit</Button><Button size="sm" colorStyle="text" onClick={()=>onDelete?.(rule)}>Delete</Button></div></td></tr>)}</tbody></table></div>;
}
