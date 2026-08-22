"use client";
import * as React from "react";
import { Button } from "../button";
import { cn } from "../../lib/utils";
import type { ComparisonOperator, ScreenerFieldDefinition, ScreenerFilter } from "../../lib/trading-workflow-types";
const control="h-11 rounded-[var(--radius)] border-2 border-border bg-background px-3 text-sm outline-none focus-visible:border-ring";
export interface ScreenerFilterBuilderProps extends Omit<React.HTMLAttributes<HTMLDivElement>,"onChange"> { definitions: ScreenerFieldDefinition[]; filters: ScreenerFilter[]; onFiltersChange: (filters:ScreenerFilter[])=>void }
export function ScreenerFilterBuilder({definitions,filters,onFiltersChange,className,...props}:ScreenerFilterBuilderProps){
 const update=(id:string,changes:Partial<ScreenerFilter>)=>onFiltersChange(filters.map((f)=>f.id===id?{...f,...changes}:f));
 const add=()=>{const field=definitions[0];if(field)onFiltersChange([...filters,{id:`filter-${Date.now()}`,field:field.id,operator:field.operators?.[0]??"greaterThan",value:""}]);};
 return <div className={cn("grid gap-2",className)} {...props}>{filters.map((filter)=>{const definition=definitions.find((item)=>item.id===filter.field);return <div key={filter.id} className="grid gap-2 sm:grid-cols-[1fr_10rem_1fr_auto]"><select aria-label="Filter field" className={control} value={filter.field} onChange={(e)=>update(filter.id,{field:e.target.value})}>{definitions.map((d)=><option key={d.id} value={d.id}>{d.label}</option>)}</select><select aria-label="Filter operator" className={control} value={filter.operator} onChange={(e)=>update(filter.id,{operator:e.target.value as ComparisonOperator})}>{(definition?.operators??["greaterThan","lessThan","equal"]).map((o)=><option key={o} value={o}>{o}</option>)}</select><input aria-label="Filter value" className={control} type={definition?.type==="number"?"number":"text"} value={filter.value} onChange={(e)=>update(filter.id,{value:definition?.type==="number"?Number(e.target.value):e.target.value})}/><Button size="md" colorStyle="ghost" onClick={()=>onFiltersChange(filters.filter((f)=>f.id!==filter.id))}>Remove</Button></div>;})}<Button className="justify-self-start" size="sm" colorStyle="outlined" onClick={add}>Add filter</Button></div>;
}
