import * as React from 'react';
import {TechnicalChartView,type TechnicalChartViewProps,type TechnicalChartGeometry,type MarketChartInteractions,type MarketChartScrollOwner,type MarketChartInteractionState,type MarketChartHandle,type MarketViewportCommand,type TechnicalPaneState,type MarketChartChangeMetadata} from 'aapaetsch-charts-market';

/** Host availableHeight stays independent from the intrinsic wrapper allocation. */
export function SuppliedWorkspaceInteractions({availableHeight,interactionContextKey,onPaneDraft,...props}:Omit<TechnicalChartViewProps,'interactions'|'interactionState'|'onInteractionStateChange'|'onGeometryChange'|'appearance'|'calculationMode'> & {availableHeight:number;interactionContextKey:string;onPaneDraft?:(panes:TechnicalPaneState[],metadata:MarketChartChangeMetadata)=>void}) {
 const workspace=React.useRef<HTMLDivElement>(null),api=React.useRef<MarketChartHandle>(null);
 const[geometry,setGeometry]=React.useState<TechnicalChartGeometry>(),[temporary,setTemporary]=React.useState<MarketChartInteractionState>({}),[pendingRestore,setPendingRestore]=React.useState<number|null>(null);
 const latestDraft=React.useRef(props.state.panes);
 const owner=React.useMemo<MarketChartScrollOwner>(()=>({getScrollTop:()=>workspace.current?.scrollTop??0,scrollTo:top=>{if(workspace.current)workspace.current.scrollTop=top;},restoreScrollTop:setPendingRestore}),[]);
 const interactions=React.useMemo<MarketChartInteractions>(()=>({mode:'workspace',contextKey:interactionContextKey,scrollOwner:owner,rightPaddingBars:10}),[owner,interactionContextKey]);
 React.useLayoutEffect(()=>{if(pendingRestore!=null&&geometry?.intrinsicHeight){owner.scrollTo(pendingRestore);setPendingRestore(null);}},[pendingRestore,geometry,owner]);
 return <div ref={workspace} style={{height:availableHeight,overflowY:'auto',paddingRight:'1.5rem'}}>
  <div style={{height:geometry?.intrinsicHeight??availableHeight,overflow:'hidden'}}><div style={{height:'100%',overflow:'hidden'}}>
   <TechnicalChartView {...props} chartApiRef={api} calculationMode="supplied" interactions={interactions} interactionState={temporary} onInteractionStateChange={setTemporary} onGeometryChange={setGeometry} onPaneLayoutChange={(panes,metadata)=>{latestDraft.current=panes;onPaneDraft?.(panes,metadata);}} appearance={{height:availableHeight,heightMode:'available',minimumPlotHeight:280,navigation:'integrated'}}/>
  </div></div>
 </div>;
}
export const historicalSelection={id:'host-date-revision-1',viewport:{visibleRange:{from:1790985600,to:1791072000}}} satisfies MarketViewportCommand;
