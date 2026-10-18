import type {OhlcBar} from "./types";
import {reportMarketDataIssues} from "./validation";
/** Host-owned monotonically increasing snapshot revision within one dataset identity. */
export interface MarketDataRevision {identity:string;revision:number}
export interface MarketDataAcceptance {identity:string;revision:number;status:"accepted"|"unchanged"|"superseded"|"identity-mismatch"|"invalid";message?:string}
export interface MarketDataSnapshot {identity:string;revision:number;data:readonly OhlcBar[]}
/** Full authoritative snapshots; equal economic timestamps replace, never append a second bar. */
export function acceptMarketDataSnapshot(previous:MarketDataSnapshot,expectedIdentity:string,data:readonly OhlcBar[],version:MarketDataRevision):{snapshot:MarketDataSnapshot;receipt:MarketDataAcceptance}{
 const receipt:MarketDataAcceptance={...version,status:"accepted"};
 if(!expectedIdentity||version.identity!==expectedIdentity)receipt.status="identity-mismatch";
 else if(!Number.isSafeInteger(version.revision)||version.revision<0){receipt.status="invalid";receipt.message="Revision must be a nonnegative safe integer.";}
 else if(previous.identity===expectedIdentity&&version.revision<=previous.revision)receipt.status=version.revision===previous.revision&&data===previous.data?"unchanged":"superseded";
 else {const issues=reportMarketDataIssues(data);if(issues.length){receipt.status="invalid";receipt.message=issues[0].message;}}
 return {snapshot:receipt.status==="accepted"?{identity:expectedIdentity,revision:version.revision,data}:previous,receipt};
}
/** Build supplied request keys against the accepted bar revision, never a rejected incoming revision. */
export function marketDataCalculationIdentity(identity:string,revision:number,dataIdentity=identity):string{return JSON.stringify([identity,"market-bars",dataIdentity,revision]);}
