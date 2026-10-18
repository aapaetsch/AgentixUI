import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as icons from "./index";
import type { IconComponent } from "./types";
import catalog from "../catalog.json";
import { Button } from "../../src/components/button";
import { IconButton } from "../../src/components/button/icon-button";
import { ToggleIconButton } from "../../src/components/button/toggle-icon-button";
import { Input } from "../../src/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../src/components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../src/components/tooltip";

const sizes=["0.875rem","1rem","1.25rem","1.5rem"];
function Catalog({pilot=false}:{pilot?:boolean}) {
  const [query,setQuery]=React.useState("");
  const [category,setCategory]=React.useState("All");
  const [size,setSize]=React.useState("1.5rem");
  const [weight,setWeight]=React.useState("2");
  const entries=catalog.filter(i=>(!pilot||i.pilot)&&(category==="All"||i.category===category)&&[i.name,i.title,...i.keywords].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6 bg-background p-6 text-foreground">
    <header className="space-y-2"><h1 className="text-2xl font-semibold">{pilot?"Original icon pilot":"AgentixUI icons"}</h1><p className="text-sm text-muted-foreground">{entries.length} icons · Rounded outline · Original vector artwork</p></header>
    <div className="flex flex-wrap items-end gap-4">
      <label className="space-y-1 text-sm">Search icons<Input aria-label="Search icons" placeholder="Search names or keywords" value={query} onChange={e=>setQuery(e.target.value)}/></label>
      <label className="space-y-1 text-sm">Category<select aria-label="Icon category" className="block h-10 rounded-md border border-input bg-background px-3" value={category} onChange={e=>setCategory(e.target.value)}>{["All",...new Set(catalog.map(i=>i.category))].map(c=><option key={c}>{c}</option>)}</select></label>
      <label className="space-y-1 text-sm">Size<select aria-label="Icon size" className="block h-10 rounded-md border border-input bg-background px-3" value={size} onChange={e=>setSize(e.target.value)}>{sizes.map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="space-y-1 text-sm">Stroke<select aria-label="Stroke width" className="block h-10 rounded-md border border-input bg-background px-3" value={weight} onChange={e=>setWeight(e.target.value)}>{["1.5","1.75","2","2.25"].map(s=><option key={s}>{s}</option>)}</select></label>
    </div>
    <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5" aria-label="Icon catalog">{entries.map(item=>{
      const Icon=icons[item.name as keyof typeof icons] as IconComponent;
      return <li key={item.slug} data-catalog-icon={item.slug} className="flex min-h-24 items-center gap-3 border-b border-border py-4"><Icon size={size} strokeWidth={Number(weight)} className="shrink-0"/><div className="min-w-0"><p className="break-words text-sm font-medium">{item.title}</p><code className="break-all text-xs text-muted-foreground">{item.name}</code></div></li>;
    })}</ul>
    {entries.length===0&&<p role="status">No matching icons.</p>}
  </div>;
}
function Controls() {
  const [pressed,setPressed]=React.useState(false);
  return <TooltipProvider><div className="space-y-6 p-6">
    <div className="flex flex-wrap items-center gap-3">
      <Button><icons.PlusIcon className="size-4"/>Add security</Button>
      <Button colorStyle="outlined"><icons.SaveIcon className="size-4"/>Save layout</Button>
      <Button colorStyle="ghost"><icons.RefreshIcon className="size-4"/>Refresh</Button>
      <Button colorStyle="outlined" className="border-destructive/50"><icons.TrashIcon className="size-4 text-destructive"/>Remove draft</Button>
      <Button disabled><icons.SaveIcon className="size-4"/>Saved</Button>
      <Button loading>Saving</Button>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip><TooltipTrigger asChild><IconButton aria-label="Search securities"><icons.SearchIcon/></IconButton></TooltipTrigger><TooltipContent>Search securities</TooltipContent></Tooltip>
      <IconButton aria-label="Expand chart" colorStyle="outlined"><icons.MaximizeIcon/></IconButton>
      <IconButton aria-label="Open chart in another window" colorStyle="outlined"><icons.ExternalLinkIcon/></IconButton>
      <ToggleIconButton aria-label="Show watchlist panel" icon={<icons.PanelRightIcon/>} pressed={pressed} onPressedChange={setPressed}/>
      <DropdownMenu><DropdownMenuTrigger asChild><IconButton aria-label="Draft row actions"><icons.MoreHorizontalIcon/></IconButton></DropdownMenuTrigger><DropdownMenuContent>
        <DropdownMenuItem><icons.DuplicateIcon className="mr-2 size-4"/>Duplicate row</DropdownMenuItem>
        <DropdownMenuItem><icons.ClearIcon className="mr-2 size-4"/>Clear draft fields</DropdownMenuItem>
        <DropdownMenuItem><icons.TrashIcon className="mr-2 size-4"/>Remove draft row</DropdownMenuItem>
      </DropdownMenuContent></DropdownMenu>
      <Select defaultValue="daily"><SelectTrigger className="w-40" aria-label="Chart interval"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent></Select>
    </div>
    <div className="flex flex-wrap gap-4 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><icons.ClockIcon className="size-4"/>Delayed data</span><span className="flex items-center gap-2"><icons.WarningTriangleIcon className="size-4 text-destructive"/>Data unavailable</span><span className="flex items-center gap-2"><icons.CheckCircleIcon className="size-4"/>Saved</span></div>
  </div></TooltipProvider>;
}
const meta={title:"Icons/Overview",parameters:{layout:"fullscreen"}} satisfies Meta;
export default meta;
type Story=StoryObj<typeof meta>;
export const Browse:Story={render:()=> <Catalog/>};
export const Pilot:Story={render:()=> <Catalog pilot/>};
export const KitControls:Story={render:()=> <div className="bg-background text-foreground"><Controls/></div>};
export const LightAndDark:Story={render:()=> <div className="grid lg:grid-cols-2">{[false,true].map(dark=><section key={String(dark)} className={dark?"dark":""}><div className="min-h-72 bg-background text-foreground"><h2 className="px-6 pt-6 text-lg font-semibold">{dark?"Dark":"Light"}</h2><Controls/></div></section>)}</div>};
export const SizeAndWeight:Story={render:()=> <div className="space-y-5 bg-background p-6 text-foreground">{catalog.filter(i=>i.pilot).map(item=>{
 const Icon=icons[item.name as keyof typeof icons] as IconComponent;
 return <div key={item.slug} className="flex items-center gap-6 border-b border-border pb-4"><span className="w-36 text-sm">{item.title}</span>{sizes.map(size=><span key={size} className="flex w-16 flex-col items-center gap-2"><Icon size={size}/><span className="text-xs text-muted-foreground">{size}</span></span>)}</div>;
})}</div>};

