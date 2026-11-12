import * as React from 'react';
import type {DrawingState,DrawingRendererContext,MarketChartEngine} from '../core';
import {marketTimeKey} from '../core';
import type {MarketDrawingEditorOptions} from './editor-types';
import {drawingPresentation,drawingStatisticValue,drawingStatistics,statisticLabels,validExactPrice,validExactTime,chartTimeZone} from './editor-state';

/** Authored annotations only. Financial statistics are exclusively supplied through the typed channel. */
export function DrawingPresentationOverlay({drawing,context,selected,hovered,editor,geometryDraft,plotBounds}:{drawing:DrawingState;context:DrawingRendererContext;selected:boolean;hovered:boolean;editor?:MarketDrawingEditorOptions;geometryDraft:boolean;plotBounds?:{left?:number;top:number;width:number;height:number}}) {
  const p=drawingPresentation(drawing),[a,b]=context.points,color=typeof drawing.parameters.color==='string'?drawing.parameters.color:'currentColor';
  if(!a)return null;
  const paired=['trend-line','rectangle'].includes(drawing.type)&&b;
  const center={x:b?(a.x+b.x)/2:a.x,y:b?(a.y+b.y)/2:a.y};
  const text=p.text&&typeof p.text.value==='string'&&typeof p.text.color==='string'&&Number.isFinite(p.text.fontSize)&&p.text.fontSize>=8&&p.text.fontSize<=48?p.text:undefined,top=b?Math.min(a.y,b.y):a.y,bottom=b?Math.max(a.y,b.y):a.y;
  const textX=text?.horizontalAlignment==='left'?Math.min(a.x,b?.x??a.x):text?.horizontalAlignment==='right'?Math.max(a.x,b?.x??a.x):center.x;
  const textY=text?.verticalAlignment==='top'?top-8:text?.verticalAlignment==='bottom'?bottom+(text?.fontSize??12):center.y;
  const stats=paired&&(selected||hovered||p.alwaysShowStatistics===true)&&Array.isArray(p.statistics)?p.statistics.filter(stat=>drawingStatistics.includes(stat)):[];
  const lines=stats.map(stat=>{
    const value=geometryDraft&&!['distance','angle'].includes(stat)?null:drawingStatisticValue(stat,drawing,context.points,editor?.statistics??[],editor?.statisticsContextKey);
    return `${statisticLabels[stat]}: ${value??(stat==='change_in_pips'?'Unavailable · no convention':'Unavailable')}`;
  });
  const bounds=plotBounds??{left:0,top:0,...context.bounds};
  const statsWidth=Math.min(bounds.width,Math.max(100,...lines.map(line=>line.length*6+12)));
  const requestedX=p.statisticsPosition==='left'?Math.min(a.x,b?.x??a.x)-statsWidth-8:p.statisticsPosition==='right'?Math.max(a.x,b?.x??a.x)+8:center.x-statsWidth/2;
  const statsX=Math.max(bounds.left??0,Math.min((bounds.left??0)+bounds.width-statsWidth,requestedX));
  const statsHeight=lines.length*15+8,requestedY=p.statisticsPosition==='auto'||p.statisticsPosition===undefined?bottom+12:top-statsHeight-12;
  const statsY=Math.max(bounds.top,Math.min(bounds.top+bounds.height-statsHeight,requestedY));
  const statsCharacters=Math.max(1,Math.floor((statsWidth-12)/6));
  return <g data-drawing-presentation={drawing.id} stroke="none" fill={color} fillOpacity={1}>
    {p.middlePoint===true&&paired?<circle data-drawing-midpoint="true" cx={center.x} cy={center.y} r={3} fill="hsl(var(--background))" stroke={color}/>:null}
    {drawing.type==='trend-line'&&b?(['startCap','endCap'] as const).map((cap,index)=>{
      if(p[cap]!=='arrow')return null;const at=index===0?a:b,from=index===0?b:a,angle=Math.atan2(at.y-from.y,at.x-from.x),size=10;
      return <polygon key={cap} data-drawing-cap={cap} points={`${at.x},${at.y} ${at.x-Math.cos(angle-.5)*size},${at.y-Math.sin(angle-.5)*size} ${at.x-Math.cos(angle+.5)*size},${at.y-Math.sin(angle+.5)*size}`} fill={color}/>;
    }):null}
    {p.priceLabels===true&&drawing.type!=='vertical-line'?context.points.map((point,index)=>point?<text key={index} x={point.x+7} y={point.y-8} fontSize={11} fill={color}><title>Authored anchor price</title>{validExactPrice(drawing.points[index]?.priceText,drawing.points[index]?.price)?drawing.points[index].priceText:String(drawing.points[index]?.price)}</text>:null):null}
    {text?.value?<text data-drawing-text="true" x={textX} y={textY} textAnchor={text.horizontalAlignment==='left'?'start':text.horizontalAlignment==='right'?'end':'middle'} fill={text.color} fontSize={text.fontSize} fontWeight={text.bold?'bold':'normal'} fontStyle={text.italic?'italic':'normal'}><title>{text.value}</title>{text.value.split('\n').map((line,index)=><tspan key={index} x={textX} dy={index?text.fontSize*1.25:0}>{line}</tspan>)}</text>:null}
    {lines.length?<g data-drawing-statistics="true" aria-label={lines.join('; ')}>
      <rect x={statsX} y={statsY} width={statsWidth} height={statsHeight} rx={3} fill="hsl(var(--background))" opacity={.94} stroke="hsl(var(--border))"/>
      {lines.map((line,index)=><text key={index} x={statsX+6} y={statsY+15+index*15} fill="hsl(var(--foreground))" fontSize={10}><title>{line}</title>{line.length>statsCharacters?`${line.slice(0,Math.max(0,statsCharacters-1))}…`:line}</text>)}
    </g>:null}
  </g>;
}

export interface SelectedTimelineLabel {pointIndex:number;x:number;originalX:number;left:number;width:number;row:number;label:string;fullLabel:string;offscreen:boolean}
/** Two colliding endpoint labels use separate ruler rows; reversed/coincident anchors stay distinct. */
export function selectedTimelineLayout(drawing:DrawingState,engine:MarketChartEngine,timeZone='UTC'):SelectedTimelineLabel[] {
  const snapshot=engine.getSnapshot(),axis=snapshot.timeAxis;if(!axis||axis.width<=0)return [];
  const left=axis.left,right=left+axis.width,logical=snapshot.viewport?.logicalRange;
  const first=logical?engine.timeForLogical?.(logical.from):null,last=logical?engine.timeForLogical?.(logical.to):null;
  const labels=drawing.points.slice(0,['trend-line','rectangle'].includes(drawing.type)?2:1).flatMap((point,pointIndex)=>{
    let x=engine.coordinateForTime(point.time);
    if(x==null){if(first!=null&&marketTimeKey(point.time)<marketTimeKey(first))x=left-1;else if(last!=null&&marketTimeKey(point.time)>marketTimeKey(last))x=right+1;else return [];}
    const zone=axis.futureFrom!=null&&marketTimeKey(point.time)>marketTimeKey(axis.futureFrom)?'UTC':chartTimeZone(timeZone);
    const format=new Intl.DateTimeFormat('en-GB',{timeZone:zone,day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
    const offscreen=x<left||x>right,label=`${x<left?'← ':x>right?'→ ':''}${format.format(marketTimeKey(point.time)*1000)}`,fullLabel=`Anchor ${pointIndex+1}: ${validExactTime(point.utcTimeText,point.time)?point.utcTimeText:new Date(marketTimeKey(point.time)*1000).toISOString()} (${zone})`;
    const width=Math.min(axis.width,Math.max(72,label.length*5.3+10)),anchor=Math.max(left,Math.min(right,x));
    return [{pointIndex,x:anchor,originalX:x,left:Math.max(left,Math.min(right-width,anchor-width/2)),width,row:0,label,fullLabel,offscreen}];
  }).sort((a,b)=>a.x-b.x||a.pointIndex-b.pointIndex);
  if(labels.length===2&&labels[1].left<labels[0].left+labels[0].width+3)labels[1].row=1;
  return labels;
}
export function SelectedDrawingTimeline({drawing,engine,timeZone,revision}:{drawing:DrawingState;engine:MarketChartEngine;timeZone?:string;revision?:string|number}) {
  void revision;const axis=engine.getSnapshot().timeAxis,labels=selectedTimelineLayout(drawing,engine,timeZone);const id=React.useId();
  if(!axis||!labels.length)return null;const color=typeof drawing.parameters.color==='string'?drawing.parameters.color:'hsl(var(--primary))';
  const spanVisible=labels.length===2&&Math.max(...labels.map(label=>label.originalX))>=axis.left&&Math.min(...labels.map(label=>label.originalX))<=axis.left+axis.width;
  return <g data-selected-drawing-timeline={drawing.id} aria-label="Selected drawing endpoint dates" pointerEvents="none" stroke="none">
    <defs><clipPath id={id}><rect x={axis.left} y={axis.top} width={axis.width} height={axis.height}/></clipPath></defs>
    <g clipPath={`url(#${id})`}>
      {spanVisible?<rect data-selected-timeline-span="true" x={labels[0].x} y={axis.top} width={Math.max(1,labels[1].x-labels[0].x)} height={axis.height} fill={color} opacity={.13}/>:null}
      {labels.map(label=><g key={label.pointIndex} aria-label={label.fullLabel}><title>{label.fullLabel}</title><line x1={label.x} x2={label.x} y1={axis.top} y2={axis.top+axis.height} stroke={color} opacity={.7}/><rect x={label.left} y={axis.top+label.row*13} width={label.width} height={13} rx={2} fill="hsl(var(--background))" stroke={color} strokeWidth={.6}/><text x={label.left+4} y={axis.top+10+label.row*13} fill="hsl(var(--foreground))" fontSize={9}>{label.label}</text></g>)}
    </g>
  </g>;
}
