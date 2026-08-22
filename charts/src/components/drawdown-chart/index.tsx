"use client"; import * as React from "react"; import { AreaChart } from "../area-chart";
export interface EquityPoint{time:string|number;equity:number;[key:string]:string|number|null|undefined}
export interface DrawdownPoint extends EquityPoint{drawdown:number}
export function calculateDrawdown(data:readonly EquityPoint[]):DrawdownPoint[]{let peak=Number.NEGATIVE_INFINITY;return data.map(point=>{peak=Math.max(peak,point.equity);return{...point,drawdown:peak===0?0:(point.equity-peak)/peak*100}})}
export interface DrawdownChartProps{data:EquityPoint[];"aria-label":string;height?:number;className?:string}
export function DrawdownChart({data,"aria-label":ariaLabel,...props}:DrawdownChartProps){return <AreaChart aria-label={ariaLabel} data={calculateDrawdown(data)} xKey="time" series={[{dataKey:"drawdown",label:"Drawdown",color:"hsl(var(--negative))"}]} valueFormatter={value=>`${value.toFixed(1)}%`} {...props}/>}
