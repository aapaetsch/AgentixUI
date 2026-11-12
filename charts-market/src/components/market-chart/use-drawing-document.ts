import * as React from 'react';
import type {DrawingState} from '../../core';
import {drawingDocumentComparisonKey} from '../../drawings/document-key';

/** Optimistic editor transactions survive delayed, ordered host acknowledgements. */
export function useDrawingDocument(incoming:DrawingState[],enabled:boolean,context:string) {
  const [pending,setPending]=React.useState<{document:DrawingState[];key:string;context:string}|null>(null);
  const echoes=React.useRef(new Set<string>()),key=drawingDocumentComparisonKey(incoming);
  const accepts=enabled&&pending?.context===context&&(key===pending.key||echoes.current.has(key));
  const drawings=accepts&&pending?pending.document:incoming;
  React.useEffect(()=>{
    if(!enabled||pending?.context!==context||pending&&!echoes.current.has(key)){setPending(null);echoes.current.clear();}
  },[enabled,context,key,pending]);
  const commit=(document:DrawingState[])=>{if(!enabled)return;const nextKey=drawingDocumentComparisonKey(document);echoes.current.add(key);echoes.current.add(nextKey);while(echoes.current.size>102)echoes.current.delete(echoes.current.values().next().value!);setPending({document,key:nextKey,context});};
  const reset=()=>{echoes.current.clear();setPending(null);};
  return {drawings,commit,reset};
}
