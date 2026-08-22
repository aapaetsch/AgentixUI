"use client";
import * as React from "react"; import { AreaChart } from "../area-chart";
export interface DepthLevel{price:number;size:number}
export interface DepthChartProps{bids:DepthLevel[];asks:DepthLevel[];"aria-label":string;height?:number;className?:string}
export function cumulativeDepth(levels:readonly DepthLevel[],descending=false){let total=0;return [...levels].sort((a,b)=>descending?b.price-a.price:a.price-b.price).map(level=>({price:level.price,size:(total+=level.size)}));}
export function DepthChart({bids,asks,"aria-label":ariaLabel,height=320,className}:DepthChartProps){const bidData=cumulativeDepth(bids,true).reverse();const askData=cumulativeDepth(asks);const prices=[...new Set([...bidData.map(x=>x.price),...askData.map(x=>x.price)])].sort((a,b)=>a-b);const data=prices.map(price=>({price,bid:bidData.find(x=>x.price===price)?.size??null,ask:askData.find(x=>x.price===price)?.size??null}));return <AreaChart aria-label={ariaLabel} data={data} xKey="price" series={[{dataKey:"bid",label:"Bid depth",color:"hsl(var(--positive))"},{dataKey:"ask",label:"Ask depth",color:"hsl(var(--negative))"}]} height={height} className={className}/>}
