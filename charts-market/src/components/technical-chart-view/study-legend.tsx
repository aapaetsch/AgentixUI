import * as React from 'react';
import {Button, Dialog, DialogTitle, DialogDescription} from 'aapaetsch-ui-kit';
import {DialogContent} from './scoped-theme';
import {readableValue} from './study-presentation';
import type {SuppliedCalculationResult} from '../../core';

export interface StudyLegendGroup {
  id: string;
  label: string;
  lines: Array<{label: string; value: number | null; color: string; style?: 'line' | 'histogram' | 'dashed'; showValue?: boolean; formatValue?: (value: number) => string}>;
  result?: SuppliedCalculationResult;
  references?: Array<{value: number; label?: string}>;
  description?: string;
  valueContext?: 'range' | 'time';
}
export function studyStatus(result?: SuppliedCalculationResult): string {
  return [result?.status ?? 'Waiting', result?.stale && 'Stale', result?.approximate && 'Approximate', result?.warning && 'Warning'].filter(Boolean).join(' · ');
}
/** One compact row, with a keyboard/touch reachable complete readout at every width. */
export function StudyLegend({groups, width, locale, timeLabel, showIdentity, onRequestEvidence, onHeightChange}: {
  groups: StudyLegendGroup[]; width: number; locale?: string; timeLabel: string; showIdentity: boolean; onRequestEvidence?: () => void; onHeightChange?: (height: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const returnFocus = React.useRef<HTMLButtonElement | null>(null);
  const openLegend: React.MouseEventHandler<HTMLButtonElement> = event => {returnFocus.current = event.currentTarget; setOpen(true);};
  const root = React.useRef<HTMLDivElement>(null), heightCallback = React.useRef(onHeightChange); heightCallback.current = onHeightChange;
  React.useLayoutEffect(() => {
    const element = root.current; if (!element) return;
    const measure = () => heightCallback.current?.(Math.max(28, element.getBoundingClientRect().height));
    measure(); if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure); observer.observe(element); return () => observer.disconnect();
  }, []);
  const compact = width < 540;
  const visibleGroups = compact ? [] : groups;
  const primaryLine = groups[0]?.lines.find(line => line.showValue !== false);
  const swatch = (line: StudyLegendGroup['lines'][number]) => <span aria-hidden="true" data-legend-swatch={line.label} className={line.style === 'histogram' ? 'h-2 w-2 shrink-0' : line.style === 'dashed' ? 'w-3 shrink-0 border-t border-dashed' : 'h-0.5 w-3 shrink-0'} style={line.style === 'dashed' ? {borderColor: line.color} : {background: line.color}}/>;
  return <>
    <div ref={root} className="pointer-events-auto flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0" aria-label="Visible chart legend">
      {groups.length ? <Button type="button" size="xs" colorStyle="ghost" className="h-7 shrink-0 px-1" onClick={openLegend} aria-label={`Legend: all ${groups.length} study and overlay mappings`}>Legend{compact ? ` (${groups.length})` : ''}</Button> : null}
      {compact && primaryLine ? <span className="inline-flex min-w-0 items-center gap-1 font-mono tabular-nums" aria-label={`${groups[0].label}: ${primaryLine.label} ${primaryLine.value ?? 'No supplied sample'}`}>
        {swatch(primaryLine)}{showIdentity ? <span className="max-w-20 truncate font-sans font-medium">{groups[0].label}</span> : null}<span className="truncate">{readableValue(primaryLine.value, locale, primaryLine.formatValue)}</span>
      </span> : null}
      {visibleGroups.map(group => <Button key={group.id} type="button" size="xs" colorStyle="ghost"
        className="h-auto min-h-7 min-w-0 max-w-full flex-wrap justify-start px-1 py-1 font-normal" onClick={openLegend}
        aria-label={`${group.label}: ${group.lines.map(line => `${line.label}${line.showValue === false ? '' : ` ${line.value ?? 'No supplied sample'}`}`).join(', ')}. Study details`}
        title={`${group.label} · ${group.valueContext === 'range' ? 'Range summary' : timeLabel}`}>
        {showIdentity ? <span className="max-w-48 truncate font-medium">{group.label}</span> : null}
        {group.lines.map((line, i) => <span key={i} className="inline-flex min-w-0 items-baseline gap-1 font-mono tabular-nums">
          {swatch(line)}
          {group.lines.length !== 1 || !showIdentity ? <span className="text-muted-foreground">{line.label}</span> : null}{line.showValue !== false ? <span>{readableValue(line.value, locale, line.formatValue)}</span> : null}
        </span>)}
      </Button>)}
    </div>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onCloseAutoFocus={event => {event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus(); else root.current?.querySelector('button')?.focus();}} className="max-h-[80dvh] max-w-[min(36rem,calc(100%-1rem))] overflow-auto text-foreground motion-reduce:animate-none">
        <DialogTitle>Chart legend and values</DialogTitle>
        <DialogDescription>{timeLabel}. Chart display values; missing or warmup observations remain unavailable. Use complete source evidence for exact source values.</DialogDescription>
        <div className="space-y-4">{groups.map(group => <section key={group.id} aria-label={group.label} className="min-w-0 border-b border-border pb-3 last:border-0">
          <h3 className="break-words text-sm font-semibold">{group.label}</h3>
          {group.valueContext === 'range' ? <p className="text-xs text-muted-foreground">Range summary · not a crosshair-time observation</p> : null}
          {group.description ? <p className="break-words text-xs text-muted-foreground">{group.description}</p> : null}
          {group.result ? <p className="break-words text-xs text-muted-foreground">{studyStatus(group.result)}</p> : null}
          <dl className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">{group.lines.map((line, i) => <React.Fragment key={i}>
            <dt className="inline-flex min-w-0 items-center gap-2 break-words">{swatch(line)}{line.label}</dt>
            <dd className="break-all text-right font-mono tabular-nums">{line.showValue === false ? 'Color key' : line.value == null ? 'No supplied sample / warmup' : String(line.value)}</dd>
          </React.Fragment>)}</dl>
          {group.references?.map((reference, i) => <p key={i} className="mt-1 break-words text-xs text-muted-foreground">{reference.label ?? 'Reference'}: {reference.value}</p>)}
          {group.result ? <details className="mt-1 text-xs"><summary className="cursor-pointer py-1" aria-label={`${group.label} source evidence`}>Source evidence</summary>
            {group.result.warning ? <p className="mt-1 break-words">Warning: {group.result.warning}</p> : null}
            {group.result.provenanceLabel ? <p className="mt-1 break-words">Source: {group.result.provenanceLabel}</p> : null}
            {group.result.coverageSummary ? <p className="mt-1 break-words">Coverage: {group.result.coverageSummary}</p> : null}
          </details> : null}
        </section>)}</div>
        {onRequestEvidence ? <Button type="button" onClick={onRequestEvidence}>Complete source evidence</Button> : null}
      </DialogContent>
    </Dialog>
  </>;
}
