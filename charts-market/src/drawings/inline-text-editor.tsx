"use client";

import * as React from "react";
import { cn } from "aapaetsch-ui-kit";

export interface DrawingInlineTextEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  onCommit?: () => void;
  onCancel?: () => void;
}

/** Controlled, plain-text-only editor for drawing annotations. */
export function DrawingInlineTextEditor({ value, onValueChange, onCommit, onCancel, className, ...props }: DrawingInlineTextEditorProps) {
  return <textarea autoFocus rows={Math.max(1, value.split("\n").length)} value={value} onChange={(event) => onValueChange(event.target.value)} onBlur={onCommit} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onCancel?.(); } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); onCommit?.(); } }} className={cn("min-h-9 min-w-40 resize-none rounded-[var(--radius-sm)] border border-border bg-background px-2 py-1.5 text-xs text-foreground shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring", className)} aria-label="Drawing text" {...props} />;
}
