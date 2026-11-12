import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {createMarketChartEngine} from './canvas-engine';
import type {MarketChartEngine} from '../core';
let engine:MarketChartEngine|undefined;
beforeEach(()=>{
 vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(500);
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
 vi.stubGlobal('devicePixelRatio',1);
});
afterEach(()=>{engine?.destroy();engine=undefined;vi.restoreAllMocks();vi.unstubAllGlobals();});
it('does not clear an unchanged canvas bitmap and publishes content geometry after writes',()=>{
 const host=document.createElement('div'),observations:Array<{reported:number;css:string;width:number;height:number}>=[];
 const width=vi.spyOn(HTMLCanvasElement.prototype,'width','set'),height=vi.spyOn(HTMLCanvasElement.prototype,'height','set');
 engine=createMarketChartEngine(host,{data:[{time:1,open:10,high:12,low:9,close:11}],chartType:'line',height:236.7,showVolume:false,scaleMode:'normal',markers:[],theme:{background:'white',text:'black',border:'gray',grid:'gray',positive:'green',negative:'red',primary:'blue'},panes:[{id:'price',order:0,size:.56,minimumSize:56,studyIds:[]}],interactions:{mode:'workspace'},onContentHeightChange:reported=>{const c=host.querySelector('canvas');if(c)observations.push({reported,css:c.style.height,width:c.width,height:c.height});}});
 engine.resize(500,236.7);width.mockClear();height.mockClear();observations.length=0;
 for(let i=0;i<5;i++)engine.resize(500,236.7);
 expect(width).not.toHaveBeenCalled();expect(height).not.toHaveBeenCalled();
 vi.stubGlobal('devicePixelRatio',2);engine.resize(500,236.7);expect(width).toHaveBeenCalledExactlyOnceWith(1000);expect(height).toHaveBeenCalledExactlyOnceWith(473);expect(observations.at(-1)).toEqual({reported:236.7,css:'236.7px',width:1000,height:473});
 width.mockClear();height.mockClear();engine.resize(500,236.7);expect(width).not.toHaveBeenCalled();expect(height).not.toHaveBeenCalled();
 engine.resize(430,160);expect(width).toHaveBeenCalledExactlyOnceWith(860);expect(height).toHaveBeenCalledExactlyOnceWith(320);expect(observations.at(-1)).toEqual({reported:160,css:'160px',width:860,height:320});
});
