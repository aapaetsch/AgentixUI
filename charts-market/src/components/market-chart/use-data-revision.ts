import * as React from "react";
import {acceptMarketDataSnapshot,type MarketDataAcceptance,type MarketDataRevision,type MarketDataSnapshot,type OhlcBar} from "../../core";
export function useMarketDataRevision(data:readonly OhlcBar[],identity:string|undefined,version:MarketDataRevision|undefined,onAcceptance?: (receipt:MarketDataAcceptance)=>void){
 const accepted=React.useRef<MarketDataSnapshot>({identity:identity??"",revision:-1,data:[]});
 const result=React.useMemo(()=>{
  const previous=accepted.current.identity===(identity??"")?accepted.current:{identity:identity??"",revision:-1,data:[]};
  return version?acceptMarketDataSnapshot(previous,identity??"",data,version):undefined;
 },[data,identity,version?.identity,version?.revision]);
 // An abandoned concurrent render must never advance the committed revision gate.
 const commitEffect=typeof window==="undefined"?React.useEffect:React.useLayoutEffect;
 commitEffect(()=>{if(result)accepted.current=result.snapshot;},[result]);
 const callback=React.useRef(onAcceptance);callback.current=onAcceptance;
 React.useEffect(()=>{if(result)callback.current?.(result.receipt);},[result]);
 return {data:version?result!.snapshot.data:data,revision:version?result!.snapshot.revision:undefined,receipt:result?.receipt};
}
