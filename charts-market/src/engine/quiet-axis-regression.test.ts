import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {createMarketChartEngine} from './canvas-engine';
import {fitReferenceAxisValue} from './price-references';
import type {MarketChartEngine,MarketPriceReference} from '../core';
const theme={background:'#fff',text:'#111',border:'#777',grid:'#aaa',positive:'#080',negative:'#800',primary:'#08f'};
const data=Array.from({length:20},(_,i)=>({time:i,open:20,high:30,low:10,close:20+i*.1}));
const engines:MarketChartEngine[]=[];let texts:Array<{text:string;x:number;y:number}>=[];
const frame=()=>new Promise(resolve=>setTimeout(resolve,35));
beforeEach(()=>{texts=[];vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(500);vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockReturnValue({x:0,y:0,left:0,top:0,right:500,bottom:350,width:500,height:350,toJSON(){return {};}});vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(new Proxy({measureText:(value:string)=>({width:String(value).length*6}),fillText:(text:string,x:number,y:number)=>texts.push({text,x,y})},{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);});
afterEach(()=>{engines.splice(0).forEach(e=>e.destroy());vi.restoreAllMocks();});
function create(reference:MarketPriceReference,side:'left'|'right'='right',axis:72|88=72,fontSize=11,height=350,bars=data){const host=document.createElement('div'),engine=createMarketChartEngine(host,{data:bars,theme,chartType:'line',showVolume:false,height,markers:[],scaleMode:'normal',panes:[{id:'price',order:0,size:3,studyIds:[],scaleSide:side}],priceReferences:[reference],presentation:{badges:{visible:false,style:'outline',fontSize},crosshair:{labels:false},timeline:axis===88?{scaleControls:'icons'}:undefined}});engines.push(engine);return{engine,host};}
const reference:MarketPriceReference={id:'open',price:24,label:'Complete host reference identity',showAxisLabel:true,showPlotLabel:false,axisLabel:'Open'};
describe('independent axis-only reference policy',()=>{
 it('fits a finite-source display exponent even when rounded text exceeds the JS numeric range',()=>{const text=(-Number.MAX_VALUE).toExponential(0),measure=(s:string,font:number)=>s.length*font*.58,result=fitReferenceAxisValue(text,60,24,measure);expect(result.text).toBe(text);expect(measure(result.text,result.fontSize)).toBeLessThanOrEqual(60);});
 it('keeps the complete sign and exponent with realistic large-font text metrics',async()=>{
  const painted:Array<{text:string;font:string;width:number}>=[];
  const target:{font:string;measureText:(s:string)=>{width:number};fillText:(text:string,x:number,y:number)=>void}={font:'24px sans-serif',measureText:(s:string)=>({width:String(s).length*Number.parseFloat(target.font)*.58}),fillText:(text:string,x:number,y:number)=>{texts.push({text,x,y});painted.push({text,font:target.font,width:String(text).length*Number.parseFloat(target.font)*.58});}};
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(new Proxy(target,{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
  const price=-1234567890123,bars=data.map(bar=>({...bar,open:price,close:price,low:price*1.1,high:price*.9}));create({...reference,price},'right',72,24,350,bars);await frame();
  const index=texts.findIndex(t=>t.text==='Open');expect(index).toBeGreaterThanOrEqual(0);expect(texts[index+1].text).not.toContain('…');expect(texts[index+1].text).toMatch(/^-\d(?:\.\d+)?e\+\d+$/);const fitted=painted.find(item=>item.text===texts[index+1].text)!;expect(fitted.width).toBeLessThanOrEqual(60.01);
 });
 it.each([42,false,{},[]])('malformed optional axisLabel %j cannot throw or create a caption/control',async axisLabel=>{
  const input=Object.freeze({...reference,axisLabel}) as unknown as MarketPriceReference;const {engine,host}=create(input);await frame();expect(texts.some(t=>t.text==='R 24.00')).toBe(true);expect(texts.some(t=>t.text==='Open')).toBe(false);expect(host.querySelector('canvas')).toHaveAttribute('aria-description',expect.stringContaining('Complete host reference identity: 24'));
  expect(()=>engine.setPriceReferences!([input])).not.toThrow();expect(host.querySelectorAll('[tabindex]')).toHaveLength(1);
 });
 it.each(['percentage','indexedTo100'] as const)('caption retains transformed %s units and matches the legacy R numeric value',async mode=>{
  const {engine,host}=create(reference);engine.setScale!({mode,autoScale:false,manualRange:{minimum:mode==='percentage'?-100:0,maximum:mode==='percentage'?100:200,anchor:20}});texts=[];await frame();const i=texts.findIndex(t=>t.text==='Open');expect(i).toBeGreaterThanOrEqual(0);const expected=mode==='percentage'?'20.00%':'120.00';expect(texts[i+1].text).toBe(expected);
  texts=[];engine.setPriceReferences!([{...reference,axisLabel:undefined}]);await frame();expect(texts.some(t=>t.text===`R ${expected}`)).toBe(true);expect(host.querySelector('canvas')).toHaveAttribute('aria-description',expect.stringContaining(': 24'));
 });
 it.each([{side:'left' as const,axis:72 as const},{side:'right' as const,axis:88 as const}])('keeps large-font caption/number in actual $side/$axis lane and reuses chart focus',async({side,axis})=>{
  const {engine,host}=create(reference,side,axis,24,160);await frame();const label=texts.find(t=>t.text==='Open')!,pane=engine.getSnapshot().panes[0],lane=engine.getSnapshot().priceAxis!;expect(label).toBeDefined();expect(label.x).toBeGreaterThanOrEqual(lane.left);expect(label.x).toBeLessThan(lane.left+lane.width);expect(label.y).toBeGreaterThan(pane.top);expect(label.y).toBeLessThan(pane.top+pane.height);
  const canvas=host.querySelector('canvas')!;canvas.dispatchEvent(new MouseEvent('pointermove',{clientX:label.x,clientY:label.y,bubbles:true}));expect(canvas.title).toContain('Complete host reference identity: 24');expect(host.querySelectorAll('button,[tabindex]')).toHaveLength(1);engine.setPriceReferences!([]);expect(canvas).not.toHaveAttribute('aria-description');expect(canvas.title).toBe('');
 });
});
