"use client"; import * as React from "react"; import { RadarChart } from "../radar-chart";
export interface RiskFactor{factor:string;portfolio:number;limit?:number;[key:string]:string|number|null|undefined}
export interface RiskChartProps{data:RiskFactor[];"aria-label":string;height?:number;className?:string}
export function RiskChart({data,"aria-label":ariaLabel,...props}:RiskChartProps){return <RadarChart aria-label={ariaLabel} data={data} categoryKey="factor" series={[{dataKey:"portfolio",label:"Portfolio risk",color:"hsl(var(--negative))"},...(data.some(x=>x.limit!=null)?[{dataKey:"limit",label:"Risk limit",color:"hsl(var(--muted-foreground))"}]:[])]} {...props}/>}
