"use client"; import * as React from "react"; import { Heatmap } from "../heatmap";
export interface CorrelationMatrixProps{labels:string[];values:number[][];"aria-label":string;height?:number;className?:string}
export function correlationCells(labels:readonly string[],values:readonly (readonly number[])[]){return labels.flatMap((y,row)=>labels.map((x,column)=>({x,y,value:values[row]?.[column]??0})))}
export function CorrelationMatrix({labels,values,...props}:CorrelationMatrixProps){return <Heatmap data={correlationCells(labels,values)} valueFormatter={v=>v.toFixed(2)} {...props}/>}
