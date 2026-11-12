import * as React from 'react';
import {cleanup,render,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {MarketChart} from '.';
import type {MarketChartEngine} from '../../core';
const bars=[{time:1,open:10,high:12,low:9,close:11}];
function fixture(){const destroy=vi.fn();const engine=new Proxy({destroy,getSnapshot:()=>({visibleRange:null,panes:[],scales:{},crosshair:null})},{get:(o,k)=>k==='then'?undefined:k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as MarketChartEngine;let host:HTMLElement|undefined;const factory=vi.fn((element:HTMLElement)=>{host=element;return engine;});return{factory,destroy,getHost:()=>host};}
afterEach(cleanup);
it('forwards the actual engine host and React19 callback-ref cleanup',async()=>{
 const f=fixture(),dispose=vi.fn(),ref=vi.fn(()=>dispose);const view=render(<MarketChart data={bars} engineFactory={f.factory} canvasHostRef={ref}/>);
 await waitFor(()=>expect(f.factory).toHaveBeenCalled());expect(ref).toHaveBeenCalledWith(f.getHost());expect(f.getHost()?.isConnected).toBe(true);
 view.unmount();expect(dispose).toHaveBeenCalledTimes(1);expect(ref).not.toHaveBeenCalledWith(null);await waitFor(()=>expect(f.destroy).toHaveBeenCalledTimes(1));
});
it('preserves conventional callback-ref null notification and object refs',async()=>{
 const f=fixture(),ref=vi.fn((_element:HTMLDivElement|null)=>{}),object=React.createRef<HTMLDivElement>();const view=render(<MarketChart data={bars} engineFactory={f.factory} canvasHostRef={ref}/>);
 await waitFor(()=>expect(f.factory).toHaveBeenCalled());const host=f.getHost();view.rerender(<MarketChart data={bars} engineFactory={f.factory} canvasHostRef={object}/>);
 expect(ref).toHaveBeenLastCalledWith(null);expect(object.current).toBe(host);view.unmount();expect(object.current).toBeNull();
});
