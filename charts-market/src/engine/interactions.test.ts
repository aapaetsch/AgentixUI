import {afterEach,describe,expect,it,vi} from 'vitest';
import {routeMarketWheel,WorkspaceGestureController,type WorkspaceGesturePort,type InteractionPointer} from './interactions';
const point=(id:number,x:number,y:number,touch=true):InteractionPointer=>({id,x,y,touch});
function setup(target:ReturnType<WorkspaceGesturePort['hit']>={kind:'plot',paneId:'price'}){
 let top=100;const port:WorkspaceGesturePort={hit:()=>target,pan:vi.fn(),zoom:vi.fn(),scale:vi.fn(),resize:vi.fn(),inspect:vi.fn(),capture:vi.fn(),release:vi.fn(),scrollOwner:{getScrollTop:()=>top,scrollTo:value=>{top=value;}}};
 return {port,gesture:new WorkspaceGestureController(port),top:()=>top};
}
afterEach(()=>vi.useRealTimers());
describe('workspace single-owner input contract',()=>{
 it.each([0,1,2])('normalizes both delta axes before choosing one owner (mode %s)',deltaMode=>{
  const unit=deltaMode===0?1:deltaMode===1?16:500;
  expect(routeMarketWheel({deltaMode,deltaX:2,deltaY:1},500)).toEqual({kind:'pan',delta:2*unit});
  expect(routeMarketWheel({deltaMode,deltaX:1,deltaY:1},500)).toEqual({kind:'zoom',delta:unit});
  expect(routeMarketWheel({deltaMode,deltaX:0,deltaY:-1,shiftKey:true},500)).toEqual({kind:'pan',delta:-unit});
 });
 it('locks after 8 CSS pixels, ties vertically, and never pans then scrolls the same sequence',()=>{
  const a=setup();a.gesture.down(point(1,100,100));a.gesture.move(point(1,105,100));expect(a.port.pan).not.toHaveBeenCalled();expect(a.port.capture).not.toHaveBeenCalled();
  a.gesture.move(point(1,108,100));expect(a.port.pan).toHaveBeenCalledWith(8,expect.objectContaining({gesture:'pan'}));a.gesture.move(point(1,108,180));expect(a.top()).toBe(100);a.gesture.up(1);
  const b=setup();b.gesture.down(point(1,100,100));b.gesture.move(point(1,106,106));expect(b.top()).toBe(94);b.gesture.move(point(1,180,108));expect(b.port.pan).not.toHaveBeenCalled();expect(b.top()).toBe(92);
 });
 it('long-press inspects once at450ms; motion and a second finger cancel it',()=>{
  vi.useFakeTimers();const a=setup();a.gesture.down(point(1,100,100));vi.advanceTimersByTime(449);expect(a.port.inspect).not.toHaveBeenCalled();vi.advanceTimersByTime(1);expect(a.port.inspect).toHaveBeenCalledWith(point(1,100,100));a.gesture.cancel();
  const b=setup();b.gesture.down(point(1,100,100));b.gesture.move(point(1,109,100));vi.advanceTimersByTime(500);expect(b.port.inspect).not.toHaveBeenCalled();b.gesture.cancel();
  const c=setup();c.gesture.down(point(1,100,100));c.gesture.down(point(2,200,100));vi.advanceTimersByTime(500);expect(c.port.inspect).not.toHaveBeenCalled();
 });
 it('pinches around midpoint then blocks remaining-finger jump until a new sequence',()=>{
  const a=setup();a.gesture.down(point(1,100,100));a.gesture.down(point(2,200,100));a.gesture.move(point(2,240,100));expect(a.port.zoom).toHaveBeenCalledWith(170,100/140,expect.objectContaining({gesture:'pinch'}));a.gesture.up(2);a.gesture.move(point(1,140,100));expect(a.port.pan).not.toHaveBeenCalled();a.gesture.up(1);a.gesture.down(point(3,100,100));a.gesture.move(point(3,120,100));expect(a.port.pan).toHaveBeenCalledTimes(1);
 });
 it.each(['value','time','separator'] as const)('owns %s immediately; cancellation clears capture and emits no final resize commit',kind=>{
  vi.useFakeTimers();const a=setup({kind,paneId:'rsi',boundary:1});a.gesture.down(point(1,100,100));expect(a.port.capture).toHaveBeenCalledWith(1);a.gesture.move({...point(1,120,120),shift:true});a.gesture.cancel();vi.advanceTimersByTime(1000);expect(a.port.release).toHaveBeenCalledWith(1);expect(a.port.inspect).not.toHaveBeenCalled();expect(a.port.resize).not.toHaveBeenCalledWith(1,0,expect.objectContaining({phase:'end'}));
 });
 it('touch gutter scrolls its explicit owner without chart motion',()=>{const a=setup({kind:'gutter'});a.gesture.down(point(1,100,100));a.gesture.move(point(1,110,120));expect(a.top()).toBe(80);expect(a.port.pan).not.toHaveBeenCalled();expect(a.port.zoom).not.toHaveBeenCalled();a.gesture.cancel();});
 it('gutter leaves events unowned even in drawing contexts',()=>{const a=setup({kind:'gutter'});expect(a.gesture.down(point(1,100,100,false))).toBe(false);expect(a.port.capture).not.toHaveBeenCalled();});
});
