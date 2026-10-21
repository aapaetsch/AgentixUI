import * as React from 'react';
import {Button, Dialog, DialogTitle, DialogDescription, cn} from 'aapaetsch-ui-kit';
import {DialogContent} from './scoped-theme';
import type {CalculationRequest, SuppliedCalculationResults} from '../../core';

export interface TechnicalSuppliedDetails {requests: readonly CalculationRequest[]; results: SuppliedCalculationResults; rejectedResults?: SuppliedCalculationResults; missingIdentity: boolean; availability?: {status: string; description?: string}}
interface SuppliedStatusProps extends TechnicalSuppliedDetails {
  incoming: SuppliedCalculationResults;
  compact: boolean;
  inline?: boolean;
  labels?: Record<string, string>;
  onRequestDetails?: (details: TechnicalSuppliedDetails) => void;
}
export function suppliedStatusSummary({requests, results, incoming, availability}: Pick<SuppliedStatusProps, 'requests' | 'results' | 'incoming' | 'availability'>): string {
  const counts = new Map<string, number>();
  const count = (label: string) => counts.set(label, (counts.get(label) ?? 0) + 1);
  for (const request of requests) {
    const result = results[request.instanceId];
    count(incoming[request.instanceId] && !result ? 'Stale response rejected' : result?.status ?? 'loading');
    if (result?.stale) count('Stale');
    if (result?.approximate) count('Approximate');
    if (result?.warning) count('Warning');
  }
  const labels: string[] = [];
  if (availability?.status === 'stale' || counts.has('Stale')) labels.push('Stale');
  else if (availability) labels.push(availability.status);
  for (const [label, count] of counts) if (label !== 'Stale') labels.push(`${count} ${label}`);
  return labels.join(' · ') || 'No supplied studies';
}
export function SuppliedStatus({requests, results, incoming, missingIdentity, compact, inline, labels = {}, onRequestDetails, availability}: SuppliedStatusProps) {
  const [open, setOpen] = React.useState(false);
  const detailsButton = React.useRef<HTMLButtonElement>(null);
  const full = (request: CalculationRequest) => {
    const result = results[request.instanceId], superseded = !!incoming[request.instanceId] && !result;
    return `${labels[request.instanceId] ?? (request.kind === 'indicator' ? 'Study' : request.kind === 'profile' ? 'Volume profile' : 'Drawing')}: ${superseded ? 'Stale response rejected' : result?.status ?? 'loading'} · ${result?.provenanceLabel ?? 'Waiting for supplied result'}${result?.stale ? ' · Stale' : ''}${result?.approximate ? ' · Approximate' : ''}${result?.warning ? ` · ${result.warning}` : ''}${result?.coverageSummary ? ` · ${result.coverageSummary}` : ''}`;
  };
  const details = () => {
    const rejectedResults = Object.fromEntries(requests.filter(request => incoming[request.instanceId] && !results[request.instanceId]).map(request => [request.instanceId, incoming[request.instanceId]]));
    const payload = {requests, results, rejectedResults, missingIdentity, availability};
    if (onRequestDetails) onRequestDetails(payload); else setOpen(true);
  };
  const summary = suppliedStatusSummary({requests, results, incoming, availability});
  return <>
    <div role="status" aria-label="Supplied calculation status" className={cn('flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground forced-colors:text-[CanvasText]', inline ? 'py-0' : 'px-3 py-1')}>
      {missingIdentity ? <span>Supplied results unavailable: calculationIdentity is required.</span>
        : compact ? <span className="break-words">{summary}</span> : requests.map(request => <span key={request.instanceId} className="break-words">{full(request)}</span>)}
      {compact ? <Button ref={detailsButton} type="button" size="xs" colorStyle="text" className="h-7 shrink-0" onClick={details} aria-label="Supplied calculation details">Details</Button> : null}
    </div>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onCloseAutoFocus={event => {event.preventDefault(); detailsButton.current?.focus();}} className="max-h-[80dvh] max-w-[min(40rem,calc(100%-1rem))] overflow-auto text-foreground motion-reduce:animate-none">
        <DialogTitle>Supplied calculation details</DialogTitle>
        <DialogDescription>Host-supplied status, provenance, coverage and warnings. Superseded results are never rendered.</DialogDescription>
        {availability ? <p className="break-words text-sm">{availability.status} · {availability.description}</p> : null}
        <ul className="space-y-3 text-sm">{requests.map(request => {
          const result = results[request.instanceId];
          return <li key={request.instanceId} className="break-words">{full(request)}
            {incoming[request.instanceId] && !result ? <p>Rejected response warning: {incoming[request.instanceId]?.warning ?? 'None supplied'}. Source: {incoming[request.instanceId]?.provenanceLabel}</p> : null}
            {result?.kind === 'profile' ? <p>{result.profile.provenance} · POC {result.profile.poc ?? '—'} · VAH {result.profile.vah ?? '—'} · VAL {result.profile.val ?? '—'} · Volume {result.profile.totalVolume} {result.profile.unavailable}</p> : result?.kind === 'drawing' ? <p>{Object.entries(result.derivedValues ?? {}).map(([key, value]) => `${key}: ${value}`).join(' · ')}</p> : null}
            <details className="mt-1 text-xs"><summary className="cursor-pointer">Request identity</summary><code className="break-all">{request.instanceId}</code></details>
          </li>;
        })}</ul>
      </DialogContent>
    </Dialog>
  </>;
}
