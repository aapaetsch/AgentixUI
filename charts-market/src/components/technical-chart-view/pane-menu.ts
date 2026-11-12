import * as React from 'react';

/** Runtime menu positioning in viewport CSS pixels; never serialized into chart state. */
export interface TechnicalPaneMenuState {
  paneId:string;
  anchor:{x:number;y:number};
  /** Connected host trigger restored after dismissal. */
  returnFocus?:HTMLElement;
}

/** Host-owned native title button adapter. Plot/card gestures stay with their existing owners. */
export function useTechnicalPaneMenu() {
  const [paneMenu,setPaneMenu]=React.useState<TechnicalPaneMenuState|null>(null);
  return {paneMenu,onPaneMenuChange:setPaneMenu,
    getTriggerProps(paneId:string):React.ButtonHTMLAttributes<HTMLButtonElement>{return{
      type:'button','aria-haspopup':'menu','aria-expanded':paneMenu?.paneId===paneId,
      onClick:event=>{event.stopPropagation();const trigger=event.currentTarget,bounds=trigger.getBoundingClientRect();setPaneMenu(previous=>previous?.paneId===paneId?null:{paneId,anchor:{x:bounds.left,y:bounds.bottom},returnFocus:trigger});},
    };},
  };
}
