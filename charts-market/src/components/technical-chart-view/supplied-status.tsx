import * as React from "react";
import {Button,Dialog,DialogTitle,DialogDescription} from "aapaetsch-ui-kit";
import {DialogContent} from "./scoped-theme";
import type {CalculationRequest,SuppliedCalculationResults} from "../../core";
export interface TechnicalSuppliedDetails {requests:readonly CalculationRequest[];results:SuppliedCalculationResults;missingIdentity:boolean;availability?:{status:string;description?:string}}
export function SuppliedStatus({requests,results,incoming,missingIdentity,compact,onRequestDetails,availability}:{requests:readonly CalculationRequest[];results:SuppliedCalculationResults;incoming:SuppliedCalculationResults;missingIdentity:boolean;compact:boolean;onRequestDetails?:(details:TechnicalSuppliedDetails)=>void;availability?:{status:string;description?:string}}){
 const[open,setOpen]=React.useState(false);
 const full=(request:CalculationRequest)=>{const result=results[request.instanceId],superseded=!!incoming[request.instanceId]&&!result;return `${request.instanceId}: ${superseded?"Stale response rejected":result?.status??"loading"} · ${result?.provenanceLabel??"Waiting for supplied result"}${result?.stale?" · Stale":""}${result?.approximate?" · Approximate":""}${result?.warning?` · ${result.warning}`:""}${result?.coverageSummary?` · ${result.coverageSummary}`:""}`;};
 const details=()=>{const payload={requests,results,missingIdentity,availability};if(onRequestDetails)onRequestDetails(payload);else setOpen(true);};
 return <>
  <div role="status" aria-label="Supplied calculation status" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1 text-xs text-foreground forced-colors:text-[CanvasText]">
   {compact&&availability?<span aria-label={`${availability.status}: ${availability.description??""}`} className="max-w-full truncate">Data: {availability.status}</span>:null}
   {missingIdentity?<span>Supplied results unavailable: calculationIdentity is required.</span>:requests.map(request=>{const result=results[request.instanceId];return <span key={request.instanceId} aria-label={full(request)} className={compact?"max-w-full truncate":"break-words"}>{compact?`${request.instanceId}: ${incoming[request.instanceId]&&!result?"Stale response rejected":result?.status??"loading"}${result?.stale?" · Stale":""}${result?.approximate?" · Approximate":""}${result?.warning?" · Warning":""}`:full(request)}</span>;})}
   {compact?<Button type="button" size="xs" colorStyle="text" onClick={details} aria-label="Supplied calculation details">Details</Button>:null}
  </div>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="text-foreground max-h-[80dvh] max-w-[min(40rem,calc(100%-1rem))] overflow-auto motion-reduce:animate-none"><DialogTitle>Supplied calculation details</DialogTitle><DialogDescription>Host-supplied status, provenance, coverage and warnings. Superseded results are never rendered.</DialogDescription>{availability?<p className="break-words text-sm">{availability.status} · {availability.description}</p>:null}<ul className="space-y-3 text-sm">{requests.map(request=>{const result=results[request.instanceId];return <li key={request.instanceId} className="break-words">{full(request)}{result?.kind==="profile"?<p>{result.profile.provenance} · POC {result.profile.poc??"—"} · VAH {result.profile.vah??"—"} · VAL {result.profile.val??"—"} · Volume {result.profile.totalVolume} {result.profile.unavailable}</p>:result?.kind==="drawing"?<p>{Object.entries(result.derivedValues??{}).map(([key,value])=>`${key}: ${value}`).join(" · ")}</p>:null}</li>;})}</ul></DialogContent></Dialog>
 </>;
}
