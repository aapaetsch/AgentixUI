import * as React from 'react';
import {Button, Tooltip, TooltipTrigger} from 'aapaetsch-ui-kit';
import {MaximizeIcon, MoveIcon, TrendingUpIcon, ChartAreaIcon} from 'aapaetsch-icons';
import {TooltipContent} from './scoped-theme';
import type {MarketScaleOptions} from '../../core';

/** Fixed CSS hit geometry matches the engine's 88px axis lane; icons remain 1rem. */
export function TimelineScaleControls({scale,onAuto,onLog,allowLogScale=true}: {scale:MarketScaleOptions;onAuto:()=>void;onLog:()=>void;allowLogScale?:boolean}) {
  const Auto=scale.autoScale?MaximizeIcon:MoveIcon;
  const Log=scale.mode==='logarithmic'?ChartAreaIcon:TrendingUpIcon;
  const buttons=[{label:scale.autoScale?'Automatic price scale — switch to manual':'Manual price scale — reset to automatic',pressed:scale.autoScale,onClick:onAuto,Icon:Auto,state:scale.autoScale?'auto':'manual'},
    {label:scale.mode==='logarithmic'?'Logarithmic price scale — switch to linear':`${scale.mode==='normal'?'Linear':scale.mode==='percentage'?'Percentage':'Indexed'} price scale — switch to logarithmic`,pressed:scale.mode==='logarithmic',onClick:onLog,Icon:Log,state:scale.mode}];
  return <div role="group" aria-label="Price scale controls" className="flex shrink-0 items-start">
    {buttons.map(({label,pressed,onClick,Icon,state},i)=><Tooltip key={i}><TooltipTrigger asChild>
      <Button type="button" colorStyle="ghost" size="sm" iconOnly disabled={i===1&&!allowLogScale&&scale.mode!=='logarithmic'} aria-label={label} aria-pressed={pressed} data-scale-state={state} onClick={onClick}
        className="h-[44px] min-h-[44px] w-[44px] min-w-[44px] shrink-0 rounded-none p-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <Icon className="size-4" aria-hidden="true"/>
      </Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>)}
  </div>;
}
