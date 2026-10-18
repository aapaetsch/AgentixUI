import {describe,it,expect} from "vitest";
import {applyDashboardGridCommand,dashboardGridColumns,findDashboardGridInsertion,packDashboardGrid,projectDashboardGridWidth,snapDashboardGridHeight,validateDashboardGridItems,type DashboardGridItem} from "./layout";

const items:DashboardGridItem[]=[{id:"a",width:3,height:240},{id:"b",width:2,height:400},{id:"c",width:1,height:280},{id:"d",width:4,height:720}];
describe("DashboardGrid geometry",()=>{
  it("packs stable sequential rows using tallest height, without backfilling",()=>{
    expect(packDashboardGrid(items,4)).toEqual([
      {id:"a",row:0,column:0,span:3,height:240,rowHeight:240,top:0},
      {id:"b",row:1,column:0,span:2,height:400,rowHeight:400,top:252},
      {id:"c",row:1,column:2,span:1,height:280,rowHeight:400,top:252},
      {id:"d",row:2,column:0,span:4,height:720,rowHeight:720,top:664},
    ]);
    expect(packDashboardGrid([],4)).toEqual([]);
  });
  it.each([0,639.9,640,1099.9,1100,1920])("uses container width %s at exact breakpoints",width=>{
    expect(dashboardGridColumns(width)).toBe(width>=1100?4:width>=640?2:1);
  });
  it("projects every canonical width without modifying items",()=>{
    for(const columns of [1,2,4] as const){
      expect(([1,2,3,4] as const).map(w=>projectDashboardGridWidth(w,columns))).toEqual(columns===1?[1,1,1,1]:columns===2?[1,1,2,2]:[1,2,3,4]);
      const packed=packDashboardGrid(items,columns);expect(packed.map(p=>p.id)).toEqual(items.map(p=>p.id));
      for(const p of packed)expect(p.column+p.span).toBeLessThanOrEqual(columns);
    }
    expect(items[0].width).toBe(3);
  });
  it("moves to each final index and emits only geometry fields",()=>{
    const extended=items.map(item=>({...item,settings:{secret:"host-only"}}));
    for(const item of items)for(let index=0;index<items.length;index++){
      const next=applyDashboardGridCommand(extended,{type:"move",id:item.id,toIndex:index});
      expect(next[index].id).toBe(item.id);expect(next.map(p=>p.id).filter(id=>id!==item.id)).toEqual(items.filter(p=>p.id!==item.id).map(p=>p.id));
      expect(next.every(item=>Object.keys(item).sort().join(",")==="height,id,width")).toBe(true);
    }
    expect(extended.map(p=>p.id)).toEqual(["a","b","c","d"]);
  });
  it("supports every width/height through the same command",()=>{
    for(const width of [1,2,3,4] as const)for(let height=240;height<=720;height+=40){
      const next=applyDashboardGridCommand(items,{type:"resize",id:"a",width,height});expect(next[0]).toEqual({id:"a",width,height});expect(next.slice(1)).toEqual(items.slice(1));
    }
    expect(snapDashboardGridHeight(259)).toBe(240);expect(snapDashboardGridHeight(260)).toBe(280);expect(snapDashboardGridHeight(800)).toBe(720);expect(snapDashboardGridHeight(1)).toBe(240);
  });
  it("accepts 24, rejects 25, duplicate/blank IDs and invalid persisted sizes explicitly",()=>{
    const maximum=Array.from({length:24},(_,i)=>({id:`card-${i}`,width:1 as const,height:240}));
    expect(()=>validateDashboardGridItems(maximum)).not.toThrow();expect(()=>validateDashboardGridItems([...maximum,{...maximum[0],id:"extra"}])).toThrow();
    for(const height of [0,239,241,260,721,NaN,Infinity])expect(()=>validateDashboardGridItems([{id:"bad",width:1,height}])).toThrow();
    for(const width of [0,5,1.5,"1",NaN])expect(()=>validateDashboardGridItems([{id:"bad",width,height:240}] as DashboardGridItem[])).toThrow();
    expect(()=>validateDashboardGridItems([items[0],items[0]])).toThrow();expect(()=>validateDashboardGridItems([{...items[0],id:" "}])).toThrow();
    expect(()=>applyDashboardGridCommand(items,{type:"move",id:"unknown",toIndex:0})).toThrow();
    expect(()=>applyDashboardGridCommand(items,{type:"move",id:"a",toIndex:4})).toThrow();
    expect(()=>dashboardGridColumns(Infinity)).toThrow();expect(()=>snapDashboardGridHeight(NaN)).toThrow();
  });
  it("chooses before/after from observed rectangles in canonical order",()=>{
    const rects=[{id:"a",left:0,top:0,width:200,height:240},{id:"b",left:212,top:0,width:200,height:240},{id:"c",left:0,top:252,width:400,height:240}];
    expect(findDashboardGridInsertion(rects,{x:10,y:50})).toEqual({targetId:"a",position:"before",toIndex:0});
    expect(findDashboardGridInsertion(rects,{x:390,y:50})).toEqual({targetId:"b",position:"after",toIndex:2});
    expect(findDashboardGridInsertion(rects,{x:10,y:600})).toEqual({targetId:"c",position:"after",toIndex:3});
    expect(findDashboardGridInsertion([],{x:0,y:0})).toBeNull();
  });
});
