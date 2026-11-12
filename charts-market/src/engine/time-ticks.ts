import {marketTimeKey, type MarketTime, type MarketTimeTick, type MarketTimelinePresentation, type MarketTimelineRange} from '../core';

interface Day { time: number; last: number; year: string; month: string; day: string; ordinal: number; monthStart: boolean; yearStart: boolean }
interface Candidate {time: number; label: string; kind: MarketTimeTick['kind']; source: MarketTimeTick['source']}
const priority = {year: 4, month: 3, day: 2, clock: 1};
const lower = <T,>(items: readonly T[], value: number, key: (item:T)=>number): number => {
  let a=0,b=items.length; while(a<b){const m=(a+b)>>>1;if(key(items[m])<value)a=m+1;else b=m;}return a;
};

/** Index once per accepted coordinate set/timezone. Pan/inspection queries touch visible days only. */
export class TimelineTickIndex {
  private keys: number[];
  private days: Day[]=[];
  private months: Day[]=[];
  private observationDays: Day[]=[];
  private parts: Intl.DateTimeFormat;
  private month: Intl.DateTimeFormat;
  private sessionSource?: MarketTimelinePresentation['sessions'];
  private sessions: {from:number;to:number;maximumEnd:number}[]=[];
  constructor(times: readonly MarketTime[], locale?: string, timeZone='UTC', observations: readonly MarketTime[]=times) {
    this.keys=times.map(marketTimeKey);
    this.parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    this.month=new Intl.DateTimeFormat(locale,{timeZone,month:'short'});
    const group=(keys:readonly number[])=>{const days:Day[]=[];let previous='';
    for(const time of keys){
      const p=this.clock(time),key=`${p.year}-${p.month}-${p.day}`;
      if(key===previous){days[days.length-1].last=time;continue;}
      const before=days.at(-1);
      days.push({time,last:time,year:p.year,month:p.month,day:p.day,ordinal:days.length,monthStart:!before||before.month!==p.month||before.year!==p.year,yearStart:!!before&&before.year!==p.year});previous=key;
    }return days;};
    this.days=group(this.keys);
    this.observationDays=observations===times?this.days:group(observations.map(marketTimeKey));
    this.months=this.days.filter(d=>d.monthStart);
  }
  private clock(time:number): Record<string,string> {return Object.fromEntries(this.parts.formatToParts(new Date(time*1000)).map(p=>[p.type,p.value]));}
  /** Interpolation locates a label only; it never creates an observation or session. */
  coordinate(time:number, coordinate:(time:MarketTime)=>number|null): number|null {
    const direct=coordinate(time);if(direct!=null&&Number.isFinite(direct))return direct;
    const i=lower(this.keys,time,t=>t);if(!i||i>=this.keys.length)return null;
    const a=coordinate(this.keys[i-1]),b=coordinate(this.keys[i]);
    return a==null||b==null?null:a+(b-a)*(time-this.keys[i-1])/(this.keys[i]-this.keys[i-1]);
  }
  plan(options: {presentation:MarketTimelinePresentation; from:number; to:number; spanSeconds?:number; futureFrom?:number; left:number; right:number; coordinate:(time:MarketTime)=>number|null; measure:(label:string)=>number}): MarketTimeTick[] {
    const {presentation,from,to,left,right,coordinate,measure}=options;
    if((!this.keys.length&&options.futureFrom==null)||!Number.isFinite(from)||!Number.isFinite(to)||right-left<8)return [];
    const span=options.spanSeconds??to-from;
    const range:MarketTimelineRange=presentation.range&&presentation.range!=='auto'?presentation.range:span<=36*3600?'1D':span<=8*86400?'5D':span<=45*86400?'1M':span<=125*86400?'3M':'6M';
    const groups=range==='6M'||range==='1Y'||range==='all'?this.months:this.days;
    const first=lower(groups,from,d=>d.last),end=lower(groups,to+0.001,d=>d.time);
    const visible=groups.slice(first,end);
    const observed=range==='1M'||range==='3M'||range==='5D'?this.observationDays.slice(lower(this.observationDays,from,d=>d.last),lower(this.observationDays,to+0.001,d=>d.time)):[];
    const candidates:Candidate[]=[];
    const add=(time:number,label:string,kind:Candidate['kind'],source:Candidate['source'])=>{if(time>=from&&time<=to)candidates.push({time,label,kind,source});};
    // UTC calendar ruler, computed from visible bounds. Never builds future session/bar grids.
    if(options.futureFrom!=null&&to>options.futureFrom){
      const start=Math.max(from,options.futureFrom),seconds=to-start,utcMonth=new Intl.DateTimeFormat(this.month.resolvedOptions().locale,{timeZone:'UTC',month:'short'});
      const date=new Date(start*1000);date.setUTCDate(1);date.setUTCHours(0,0,0,0);
      for(let count=0;count<62&&date.getTime()/1000<=to;count++,date.setUTCMonth(date.getUTCMonth()+1)){
        const time=date.getTime()/1000;if(time<=options.futureFrom)continue;
        add(time,date.getUTCMonth()===0?String(date.getUTCFullYear()):utcMonth.format(date),date.getUTCMonth()===0?'year':'month','future-display');
      }
      if(seconds<=125*86400){
        const step=seconds<=36*3600?1800:seconds<=8*86400?21600:seconds<=45*86400?86400:5*86400;
        const stride=Math.max(step,Math.ceil(seconds/(step*4096))*step);
        for(let time=Math.ceil(start/stride)*stride;time<=to;time+=stride){
          if(time<=options.futureFrom)continue;
          const d=new Date(time*1000),clock=seconds<=36*3600;
          add(time,clock?`${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`:String(d.getUTCDate()),clock?'clock':'day','future-display');
        }
      }
    }
    for(const day of visible){
      if(day.yearStart)add(day.time,day.year,'year','supplied-coordinate');
      if(day.monthStart&&range!=='1D'&&range!=='5D')add(day.time,this.month.format(new Date(day.time*1000)),'month','supplied-coordinate');
    }
    if(range==='1M'||range==='3M')for(const day of observed)if(day.ordinal%(range==='1M'?2:5)===0)add(day.time,String(Number(day.day)),'day','first-observation');
    // All intraday ticks are wall-clock instants inside known display geometry.
    // Bounded to the visible span even if an explicit hint is inconsistent with it.
    const wallTicks=(a:number,b:number,callback:(time:number,p:Record<string,string>)=>void)=>{
      a=Math.max(from,a);b=Math.min(to,b,options.futureFrom??Infinity);if(b<a)return;
      const p=this.clock(a),seconds=Number(p.minute)%30*60+Number(p.second);
      let t=a-seconds;if(t<a)t+=1800;
      const count=Math.floor((b-t)/1800)+1,step=Math.max(1,Math.ceil(count/4096));
      for(;t<=b;t+=1800*step)callback(t,this.clock(t));
    };
    if(range==='1D')wallTicks(from,to,(time,p)=>add(time,`${p.hour}:${p.minute}`,'clock','wall-clock'));
    if(range==='5D'){
      const sessions=presentation.sessions;
      if(sessions){
        if(sessions!==this.sessionSource){this.sessionSource=sessions;let end=-Infinity;this.sessions=sessions.map(s=>({from:marketTimeKey(s.from),to:marketTimeKey(s.to),maximumEnd:0})).sort((a,b)=>a.from-b.from).map(s=>({...s,maximumEnd:end=Math.max(end,s.to)}));}
        const start=lower(this.sessions,from,s=>s.maximumEnd);
        const opened=new Set<string>();
        for(let i=start;i<this.sessions.length&&this.sessions[i].from<=to;i++){const {from:a,to:b}=this.sessions[i];if(b<from)continue;
          const p=this.clock(a),key=`${p.year}-${p.month}-${p.day}`;
          if(!opened.has(key)){opened.add(key);add(a,String(Number(p.day)),'day','supplied-session');}
          wallTicks(a,b,(time,p)=>{if((p.hour==='12'||p.hour==='14')&&p.minute==='00')add(time,`${p.hour}:00`,'clock','supplied-session');});
        }
      }else for(const day of observed){
        add(day.time,String(Number(day.day)),'day','first-observation');
        wallTicks(day.time,day.last,(time,p)=>{if((p.hour==='12'||p.hour==='14')&&p.minute==='00')add(time,`${p.hour}:00`,'clock','first-observation');});
      }
    }
    const boxes=candidates.map(c=>{const x=this.coordinate(c.time,coordinate),measured=measure(c.label),width=Number.isFinite(measured)&&measured>0?measured:c.label.length*7;return {...c,x,width,left:Math.max(left+2,Math.min(right-width-2,(x??0)-width/2))};})
      .filter((c):c is typeof c & {x:number}=>c.x!=null&&Number.isFinite(c.x)&&c.x>=left&&c.x<=right&&c.width<=right-left-4)
      .sort((a,b)=>priority[b.kind]-priority[a.kind]||a.time-b.time);
    const accepted:MarketTimeTick[]=[];
    // A repeated local clock at the fall DST transition is thinned, never printed twice.
    const clocks=new Set<string>();
    for(const c of boxes){
      const dayKey=c.kind==='clock'?this.clock(c.time):undefined,duplicate=dayKey?`${dayKey.year}-${dayKey.month}-${dayKey.day}:${c.label}`:undefined;
      if(duplicate&&clocks.has(duplicate))continue;
      if(accepted.some(a=>c.left<a.left+a.width+8&&c.left+c.width+8>a.left))continue;
      accepted.push({time:c.time,x:c.x,label:c.label,left:c.left,width:c.width,kind:c.kind,source:c.source});if(duplicate)clocks.add(duplicate);
    }
    return accepted.sort((a,b)=>a.x-b.x);
  }
}

/** Crosshair precision is independent of abbreviated axis ticks. */
export function formatTimelineInspection(time:MarketTime,locale?:string,timeZone='UTC'):string {
  return new Intl.DateTimeFormat(locale,{timeZone,year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'short'}).format(new Date(marketTimeKey(time)*1000));
}
