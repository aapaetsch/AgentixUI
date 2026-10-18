import {it,expect,vi} from 'vitest';
import {suppliedLinePoints} from './supplied-points';
it('projects an immutable supplied line once across changed viewport/result wrappers without changing values/nulls',()=>{
 const points=[{time:1,values:{adx:null,plus_di:30}},{time:2,values:{adx:25.123456789,plus_di:31}}],map=vi.spyOn(points,'map');
 const first=suppliedLinePoints(points,'adx');expect(first).toEqual([{time:1,value:null},{time:2,value:25.123456789}]);expect(suppliedLinePoints(points,'adx')).toBe(first);expect(map).toHaveBeenCalledTimes(1);expect(suppliedLinePoints(points,'plus_di')).not.toBe(first);expect(map).toHaveBeenCalledTimes(2);expect(suppliedLinePoints([...points],'adx')).not.toBe(first);
});
