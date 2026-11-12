import {createTechnicalChartViewState,type OhlcBar} from '../../core';
const sec=(s:string)=>Date.parse(s)/1000;
export const boardTimes=['2026-03-06T12:00Z','2026-03-06T12:10Z','2026-03-06T14:40Z','2026-03-06T20:50Z','2026-03-09T13:30Z','2026-03-09T13:40Z','2026-03-09T17:20Z','2026-03-09T19:55Z'].map(sec);
export const boardBars:OhlcBar[]=boardTimes.map((time,i)=>({time,open:25+i,high:40+i,low:20,close:[28,27,35,34,30,31,29,33][i],volume:100+i}));
export const boardGaps=[{from:boardTimes[3],to:boardTimes[4]}];
export const boardCalendar=[...new Set([...boardTimes,...Array.from({length:28},(_,i)=>boardTimes[0]+i*1800),boardTimes[7]+3600])].sort((a,b)=>a-b);
export function boardState(){const state=createTechnicalChartViewState('price-only');state.chartType='line';state.indicators=[];state.profiles=[];state.drawings=[];state.panes=state.panes.slice(0,1).map(p=>({...p,studyIds:[],showVolume:false,minimumSize:100}));state.viewport={};return state;}
