import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {createMarketChartEngine} from './canvas-engine';
import type {MarketChartEngine,MarketChartEngineOptions,MarketPriceReference} from '../core';
const color='#a946db',theme={background:'white',text:'black',border:'gray',grid:'silver',positive:'green',negative:'red',primary:'blue'};
const data=Array.from({length:30},(_,i)=>({time:i*10,open:20+i/10,high:30,low:10,close:21+i/10}));
const frame=()=>new Promise(resolve=>setTimeout(resolve,40));
function recorder(){
 const strokes:Array<{color:unknown;dash:number[];points:number[][]}>=[],texts:Array<{text:string;x:number;y:number}>=[],outlines:Array<{color:unknown;x:number;width:number}>=[],clips:number[][]=[];
 let points:number[][]=[],dash:number[]=[];const stack:Array<{strokeStyle:unknown;fillStyle:unknown;dash:number[];lineWidth:number}>=[];
 const target={strokeStyle:'' as unknown,fillStyle:'' as unknown,lineWidth:1,font:'',measureText:(s:string)=>({width:String(s).length*6}),
  save(){stack.push({strokeStyle:target.strokeStyle,fillStyle:target.fillStyle,dash:[...dash],lineWidth:target.lineWidth});},restore(){const saved=stack.pop();if(saved){target.strokeStyle=saved.strokeStyle;target.fillStyle=saved.fillStyle;target.lineWidth=saved.lineWidth;dash=saved.dash;}},
  beginPath(){points=[];},moveTo(x:number,y:number){points.push([x,y]);},lineTo(x:number,y:number){points.push([x,y]);},setLineDash(value:number[]){dash=[...value];},stroke(){strokes.push({color:target.strokeStyle,dash:[...dash],points:points.map(p=>[...p])});},fillText(text:string,x:number,y:number){texts.push({text,x,y});},strokeRect(x:number,_y:number,width:number){outlines.push({color:target.strokeStyle,x,width});},rect(...args:number[]){clips.push(args);}};
 return{context:new Proxy(target,{get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D,strokes,texts,outlines,clips,clear(){strokes.length=texts.length=outlines.length=clips.length=0;},referenceStrokes(){return strokes.filter(s=>s.color===color);}};
}
const engines:MarketChartEngine[]=[];let contexts:ReturnType<typeof recorder>[]=[];
beforeEach(()=>{vi.spyOn(HTMLElement.prototype,'clientWidth','get').mockReturnValue(500);vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockImplementation(()=>{const r=recorder();contexts.push(r);return r.context;});vi.stubGlobal('devicePixelRatio',1);});
afterEach(()=>{engines.splice(0).forEach(engine=>engine.destroy());contexts=[];vi.restoreAllMocks();vi.unstubAllGlobals();});
async function create(extra:Partial<MarketChartEngineOptions>={}){const host=document.createElement('div'),engine=createMarketChartEngine(host,{data,chartType:'line',height:350,showVolume:false,scaleMode:'normal',markers:[],theme,panes:[{id:'price',order:0,size:3,minimumSize:56,studyIds:[]}],timeAxis:{mode:'utc',domain:{from:0,to:300},intervalSeconds:10},presentation:{badges:{visible:false},crosshair:{labels:false,lineMarker:{visible:true}}},...extra});engines.push(engine);await frame();return{engine,host,record:contexts.at(-1)!};}
describe('supplied noninteractive price references',()=>{
 it.each([72,88])('paints the additive Open caption and whole numeric value only in the existing %spx axis lane',async axis=>{
  const full='2026-10-25 · 09:30 ET regular-session open · exact supplied USD 24';
  const {engine,host,record}=await create({priceReferences:[{id:'open',price:24,label:full,color,showAxisLabel:true,showPlotLabel:false,axisLabel:'Open'}],presentation:{timeline:axis===88?{scaleControls:'icons'}:undefined,badges:{visible:false},crosshair:{labels:false}}});
  const geometry=engine.getSnapshot().priceAxis!,canvas=host.querySelector('canvas')!;
  expect(record.referenceStrokes()).toHaveLength(1);expect(record.texts.some(t=>t.text===full)).toBe(false);
  const caption=record.texts.find(t=>t.text==='Open')!,price=record.texts.find(t=>t.text==='24')!;
  expect(caption).toBeDefined();expect(caption.x).toBeGreaterThan(geometry.left);expect(caption.x).toBeLessThan(geometry.left+geometry.width);expect(price.x).toBe(caption.x);expect(price.y).toBeGreaterThan(caption.y);
  expect(canvas).toHaveAttribute('aria-description',expect.stringContaining(full));
  canvas.dispatchEvent(new MouseEvent('pointermove',{clientX:caption.x,clientY:caption.y,bubbles:true}));expect(canvas.title).toContain(full);expect(canvas.title).toContain(': 24');
  canvas.dispatchEvent(new MouseEvent('pointerleave',{bubbles:true}));expect(canvas.title).toBe('');
  expect(host.querySelectorAll('[tabindex]')).toHaveLength(1);
  record.clear();engine.setPriceReferences!([{id:'open',price:24,label:full,color,showAxisLabel:true}]);await frame();expect(record.texts.some(t=>t.text===full||t.text.startsWith('2026-10-25'))).toBe(true);expect(record.texts.some(t=>t.text==='R 24.00')).toBe(true);expect(canvas).not.toHaveAttribute('aria-description');
 });
 it.each([0.0000123456789,1234567890123,-1234567890123])('retains whole prices with large/decimal supplied value %s and clears on session replacement',async price=>{
  const local=data.map((bar,index)=>({...bar,open:price,close:price,low:price-Math.max(1,Math.abs(price)*.1),high:price+Math.max(1,Math.abs(price)*.1),time:index*10}));
  const {engine,host,record}=await create({data:local,priceReferences:[{id:'session-one',price,label:'Exact first session',color,showAxisLabel:true,showPlotLabel:false,axisLabel:'Open'}]});
  const axis=engine.getSnapshot().priceAxis!,caption=record.texts.find(t=>t.text==='Open')!;
  const number=record.texts.find(t=>t.x===caption.x&&t.y>caption.y&&!t.text.includes('Open'))!;
  expect(number).toBeDefined();expect(number.text).not.toContain('…');expect(number.text.length*6).toBeLessThanOrEqual(axis.width-12);expect(host.querySelector('canvas')).toHaveAttribute('aria-description',expect.stringContaining(String(price)));
  const before=engine.getSnapshot().scales;record.clear();engine.setPriceReferences!([{id:'session-two',price:price+Math.max(100,Math.abs(price)*2),label:'Exact second session',color,showAxisLabel:true,showPlotLabel:false,axisLabel:'Open'}]);await frame();expect(record.referenceStrokes()).toHaveLength(0);expect(record.texts.some(t=>t.text==='Open')).toBe(false);expect(engine.getSnapshot().scales).toEqual(before);expect(host.querySelector('canvas')).toHaveAttribute('aria-description',expect.stringContaining('Exact second session'));
  engine.setPriceReferences!([]);expect(host.querySelector('canvas')).not.toHaveAttribute('aria-description');
 });
 it('avoids moving-average endpoint boxes in the same axis lane without changing their values',async()=>{
  const {host,record}=await create({priceReferences:[{id:'open',price:24,label:'Complete supplied open',color,showAxisLabel:true,showPlotLabel:false,axisLabel:'Open'}],presentation:{badges:{movingAverages:'all-visible',style:'outline'},crosshair:{labels:false}}});
  // Add explicit supplied outputs through the real engine path, then inspect the shared geometry.
  const engine=engines.at(-1)!;engine.setIndicatorSeries([23.9,24,24.1,24.2].map((value,index)=>({id:`average-${index}`,paneId:'price',placement:'overlay',style:'line',color:'#995511',axisLabel:{kind:'moving-average',label:`Average ${index}`,status:'Supplied'},points:data.map(bar=>({time:bar.time,value}))})));
  record.clear();await frame();const caption=record.texts.find(t=>t.text==='Open')!;expect(caption).toBeDefined();
  for(const box of host.querySelectorAll<HTMLElement>('[data-endpoint-label]')){const middle=Number(box.dataset.endpointCenterY),height=parseFloat(box.style.height);expect(Math.abs(middle-(caption.y+3))).toBeGreaterThanOrEqual((height+31)/2);}
 });
 it.each([{side:'right' as const,axis:72,dpr:1},{side:'left' as const,axis:72,dpr:2},{side:'right' as const,axis:88,dpr:3},{side:'left' as const,axis:88,dpr:2}])('uses actual price-pane geometry and an outlined R badge ($side/$axis/DPR$dpr)',async({side,axis,dpr})=>{
  vi.stubGlobal('devicePixelRatio',dpr);const reference:MarketPriceReference={id:'rth-open',price:24,label:'RTH open',lineStyle:'dotted',color,showAxisLabel:true};
  const {engine,host,record}=await create({priceReferences:[reference],panes:[{id:'price',order:0,size:2,studyIds:[],scaleSide:side},{id:'oscillator',order:1,size:1,studyIds:[]}],presentation:{timeline:{scaleControls:axis===88?'icons':undefined},badges:{visible:false},crosshair:{labels:false}}});
  const pane=engine.getSnapshot().panes.find(p=>p.id==='price')!,stroke=record.referenceStrokes().at(-1)!;expect(stroke).toBeDefined();expect(stroke.dash).toHaveLength(2);expect(stroke.dash.every(n=>n>0)).toBe(true);expect(stroke.points).toHaveLength(2);expect(stroke.points[0][0]).toBe(pane.left??0);expect(stroke.points[1][0]).toBe((pane.left??0)+pane.width);expect(stroke.points[0][1]).toBeCloseTo(engine.coordinateFor({time:100,price:24})!.y);expect(stroke.points[0][1]).toBeGreaterThan(pane.top);expect(stroke.points[0][1]).toBeLessThan(pane.top+pane.height);
  expect(record.clips.some(r=>r[0]===(pane.left??0)&&r[1]===pane.top&&r[2]===pane.width&&r[3]===pane.height)).toBe(true);expect(record.texts.some(t=>t.text==='RTH open')).toBe(true);expect(record.texts.some(t=>/^R /.test(t.text))).toBe(true);expect(record.outlines.some(r=>r.color===color&&r.width<=axis)).toBe(true);expect(host.querySelector('canvas')!.width).toBe(500*dpr);
  record.clear();engine.resize(390,280);await frame();const next=engine.getSnapshot().panes[0];expect(record.referenceStrokes().at(-1)!.points[1][0]).toBe((next.left??0)+next.width);
 });
 it('rejects missing/duplicate/nonfinite/unsupported evidence and filters scale-domain/log/no-data cases without replacement',async()=>{
  const refs=[{id:'valid',label:'Accepted',price:24,color},{id:'valid',label:'Duplicate',price:23,color},{id:'',label:'No id',price:24,color},{id:'blank',label:'  ',price:24,color},{id:'nan',label:'NaN',price:NaN,color},{id:'infinity',label:'Infinity',price:Infinity,color},{id:'unsupported',label:'Wrong style',price:24,lineStyle:'dashed',color},{id:'outside',label:'Outside',price:999,color}] as MarketPriceReference[];
  const {engine,record}=await create({priceReferences:refs});expect(record.referenceStrokes()).toHaveLength(1);expect(record.texts.some(t=>t.text==='Accepted')).toBe(true);expect(record.texts.some(t=>['Duplicate','No id','NaN','Infinity','Outside','Wrong style'].includes(t.text))).toBe(false);
  record.clear();engine.setScale!({mode:'logarithmic',autoScale:false,manualRange:{minimum:Math.log(5),maximum:Math.log(40)}});engine.setPriceReferences!([{id:'zero',label:'Zero',price:0,color},{id:'negative',label:'Negative',price:-1,color},{id:'valid',label:'Accepted',price:24,color}]);await frame();expect(record.referenceStrokes()).toHaveLength(1);
  record.clear();engine.setData([]);await frame();expect(record.referenceStrokes()).toHaveLength(0);engine.setData(data);await frame();expect(record.referenceStrokes()).toHaveLength(1);record.clear();engine.setPriceReferences!([]);await frame();expect(record.referenceStrokes()).toHaveLength(0);
 });
 it('keeps default/autoscale/viewport state and immutable host inputs independent across instances',async()=>{
  const a=await create(),b=await create(),before=a.engine.getSnapshot(),refs=Object.freeze([Object.freeze({id:'open',label:'Host open',price:24,color})]);
  a.record.clear();b.record.clear();a.engine.setPriceReferences!(refs);await frame();expect(a.record.referenceStrokes()).toHaveLength(1);expect(b.record.referenceStrokes()).toHaveLength(0);expect(a.engine.getSnapshot().scales).toEqual(before.scales);expect(a.engine.getSnapshot().viewport).toEqual(before.viewport);expect(refs[0]).toEqual({id:'open',label:'Host open',price:24,color});
  a.engine.setPriceReferences!([{...refs[0],price:999}]);await frame();expect(a.engine.getSnapshot().scales).toEqual(before.scales);a.engine.setPriceReferences!([]);await frame();expect(a.engine.getSnapshot().scales).toEqual(b.engine.getSnapshot().scales);
 });
 it('keeps R badges in the actual outer axis lane with all-output endpoint gutters',async()=>{
  const {engine,record}=await create({priceReferences:[{id:'open',label:'Host open',price:24,color,showAxisLabel:true}],presentation:{timeline:{scaleControls:'icons'},badges:{endpointValues:'all-visible'},crosshair:{labels:false}}});
  const snapshot=engine.getSnapshot(),axis=snapshot.priceAxis!;expect(record.texts.some(t=>/^R /.test(t.text))).toBe(true);expect(record.outlines.some(r=>r.color===color&&r.x===axis.left+1&&r.width===86)).toBe(true);expect(record.referenceStrokes().at(-1)!.points[1][0]).toBe(snapshot.panes[0].width);
 });
 it('leaves the accepted crosshair/line inspection and pointer pan to the underlying canvas',async()=>{
  const options={interactions:{mode:'workspace' as const,contextKey:'price-reference-test'},viewport:{logicalRange:{from:5,to:20}}};const a=await create(options),b=await create({...options,priceReferences:[{id:'open',label:'Host open',price:24,color}]});
  for(const item of [a,b]){const canvas=item.host.querySelector('canvas')!,x=item.engine.coordinateForTime(100)!,y=item.engine.coordinateFor({time:100,price:24})!.y,before=item.engine.getSnapshot().viewport;canvas.dispatchEvent(new MouseEvent('pointermove',{clientX:x,clientY:100,bubbles:true}));expect(item.engine.getSnapshot().crosshair?.bar).toEqual(data[10]);expect(item.engine.getSnapshot().lineInspection?.source).toBe('exact');canvas.dispatchEvent(new MouseEvent('pointerdown',{clientX:x,clientY:y,button:0,buttons:1,bubbles:true}));canvas.dispatchEvent(new MouseEvent('pointermove',{clientX:x+40,clientY:y,buttons:1,bubbles:true}));canvas.dispatchEvent(new MouseEvent('pointerup',{clientX:x+40,clientY:y,bubbles:true}));expect(item.engine.getSnapshot().viewport).not.toEqual(before);}
  expect(a.engine.getSnapshot().viewport).toEqual(b.engine.getSnapshot().viewport);expect(b.host.querySelectorAll('button,[role="button"],[tabindex]')).toHaveLength(1);
 });
});
