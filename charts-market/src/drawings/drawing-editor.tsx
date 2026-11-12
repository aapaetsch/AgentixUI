"use client";
import * as React from 'react';
import {createPortal} from 'react-dom';
import {Button,Dialog,DialogTitle,DialogDescription,Tabs,TabsList,TabsTrigger,TabsContent,DropdownMenu,DropdownMenuTrigger,DropdownMenuItem,Popover,PopoverTrigger,Tooltip,TooltipTrigger,cn} from 'aapaetsch-ui-kit';
import {GripVerticalIcon,PaletteIcon,FileTextIcon,SettingsIcon,BellIcon,LockIcon,UnlockIcon,TrashIcon,MoreHorizontalIcon,EyeOffIcon,SlashIcon} from 'aapaetsch-icons';
import {DialogContent,DropdownMenuContent,PopoverContent,TooltipContent,ChartThemeContext,ChartPortalContainerContext} from '../components/technical-chart-view/scoped-theme';
import type {DrawingState,MarketChartEngine} from '../core';
import type {DrawingChangeMetadata} from './index';
import {drawingDocumentsEqual} from './index';
import type {MarketDrawingEditorOptions,MarketDrawingPresentation,MarketDrawingText} from './editor-types';
import {drawingPresentation,drawingIntervalLimits,drawingStatistics,statisticLabels,localDateTime,localTimeCandidates,chartTimeZone,validExactPrice,validateDrawingEditorDraft,drawingPriceInputValue} from './editor-state';
import {useEditorPosition} from './use-editor-position';
import {drawingDocumentComparisonKey} from './document-key';

const fieldClass='min-h-11 w-full min-w-0 rounded border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50';
const colors=['#64748b','#2563eb','#0891b2','#16a34a','#d97706','#dc2626','#9333ea','#db2777'];
const drawingTypeNames:Record<string,string>={'trend-line':'Trend line','horizontal-line':'Horizontal line','vertical-line':'Vertical line',rectangle:'Rectangle'};
const clone=(drawing:DrawingState):DrawingState=>JSON.parse(JSON.stringify(drawing)) as DrawingState;
function Field({label,children}:{label:string;children:React.ReactElement}) {const id=React.useId();return <label htmlFor={id} className="flex min-w-0 flex-col gap-1.5 text-xs text-muted-foreground"><span>{label}</span>{React.cloneElement(children as React.ReactElement<{id?:string}>,{id})}</label>;}
function Check({label,checked,onChange,disabled}:{label:string;checked:boolean;onChange:(value:boolean)=>void;disabled?:boolean}) {return <label className="flex min-h-11 min-w-0 items-center gap-2 text-sm"><input type="checkbox" className="size-4 shrink-0 accent-primary focus-visible:ring-2 focus-visible:ring-ring" checked={checked} disabled={disabled} onChange={e=>onChange(e.target.checked)}/>{label}</label>;}
function Choice({label,value,values,onChange}:{label:string;value:string;values:readonly string[];onChange:(value:string)=>void}) {return <Field label={label}><select className={fieldClass} value={value} onChange={e=>onChange(e.target.value)}>{values.map(value=><option key={value} value={value}>{value.charAt(0).toUpperCase()+value.slice(1)}</option>)}</select></Field>;}
function ColorField({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}) {return <div className="space-y-2"><Field label={label}><input type="text" spellCheck={false} className={fieldClass} value={value} onChange={e=>onChange(e.target.value)}/></Field><div className="flex flex-wrap gap-1">{colors.map(color=><button key={color} type="button" aria-label={`${label} ${color}`} aria-pressed={value===color} className="flex min-h-11 min-w-11 items-center justify-center rounded border border-transparent focus-visible:ring-2 focus-visible:ring-ring" onClick={()=>onChange(color)}><span className="size-5 rounded-full border border-border" style={{backgroundColor:color}}/></button>)}</div></div>;}

interface SettingsProps {drawing:DrawingState;engine:MarketChartEngine;timeZone:string;tab:string;returnFocusRef:React.RefObject<HTMLButtonElement|null>;onClose:()=>void;onPreview:(drawing:DrawingState|null,geometryDraft?:boolean)=>void;onCommit:(drawing:DrawingState)=>void}
function DrawingSettings({drawing,engine,timeZone,tab:initialTab,returnFocusRef,onClose,onPreview,onCommit}:SettingsProps) {
  const [draft,setDraft]=React.useState(()=>clone(drawing)),[tab,setTab]=React.useState(initialTab),[error,setError]=React.useState<string|null>(null);
  const [coordinateInputs,setCoordinateInputs]=React.useState(()=>drawing.points.map(point=>({price:drawingPriceInputValue(point),local:localDateTime(point.time,timeZone),offset:''})));
  const previewRef=React.useRef(onPreview);previewRef.current=onPreview;
  const closeRef=React.useRef(onClose);closeRef.current=onClose;
  const geometryTouched=React.useRef(false);
  const rulerError=React.useRef<string|null>(null);
  const p=drawingPresentation(draft),paired=['trend-line','rectangle'].includes(draft.type),locked=drawing.locked;
  const update=(next:DrawingState)=>{setDraft(next);setError(null);if(!validateDrawingEditorDraft(next))onPreview(next,geometryTouched.current);};
  const parameter=(key:string,value:string|number|boolean)=>update({...draft,parameters:{...draft.parameters,[key]:value}});
  const presentation=(patch:Partial<MarketDrawingPresentation>)=>update({...draft,parameters:{...draft.parameters,presentation:{...p,...patch}}});
  const text:MarketDrawingText=p.text??{value:'',color:typeof draft.parameters.color==='string'?draft.parameters.color:'#64748b',fontSize:12,bold:false,italic:false,verticalAlignment:'middle',horizontalAlignment:'center'};
  const changeText=(patch:Partial<MarketDrawingText>)=>presentation({text:{...text,...patch}});
  const point=(index:number,change:Partial<DrawingState['points'][number]>)=>{geometryTouched.current=true;update({...draft,points:draft.points.map((point,i)=>i===index?{...point,...change,anchor:undefined}:point)});};
  const close=()=>{onPreview(null);onClose();};
  React.useEffect(()=>{const blur=()=>{previewRef.current(null);closeRef.current();};window.addEventListener('blur',blur);return()=>{window.removeEventListener('blur',blur);previewRef.current(null);};},[]);
  const apply=()=>{
    if(locked)return;
    if(rulerError.current){setError(rulerError.current);return;}
    const invalid=coordinateInputs.findIndex((input,index)=>input.price!==drawingPriceInputValue(drawing.points[index])&&!validExactPrice(input.price));
    if(invalid>=0){setError(`Anchor ${invalid+1} needs a finite decimal price.`);return;}
    for(let i=0;i<coordinateInputs.length;i++){const input=coordinateInputs[i],original=localDateTime(drawing.points[i].time,timeZone);if(input.local!==original){const candidates=localTimeCandidates(input.local,timeZone);if(!candidates.length){setError(`Anchor ${i+1} time does not exist in ${timeZone}.`);return;}const chosen=candidates.length===1?candidates[0]:candidates.find(candidate=>candidate.utcTime===input.offset);if(!chosen){setError(`Choose the UTC offset for anchor ${i+1}.`);return;}if(engine.coordinateForTime(Date.parse(chosen.utcTime)/1000)==null){setError(`Anchor ${i+1} is outside the available drawing ruler.`);return;}}}
    const message=validateDrawingEditorDraft(draft);if(message){setError(message);return;}
    onCommit(draft);onPreview(null);onClose();
  };
  return <Dialog open onOpenChange={open=>{if(!open)close();}}><DialogContent className="w-[calc(100vw-1rem)] max-w-[34rem] gap-3 overflow-y-auto p-4 text-foreground motion-reduce:!animate-none" onCloseAutoFocus={event=>{event.preventDefault();if(returnFocusRef.current?.isConnected)returnFocusRef.current.focus({preventScroll:true});}}>
    <DialogTitle className="min-w-0 break-words pr-8">Drawing settings — {draft.name?.trim()||(drawingTypeNames[draft.type]??draft.type)}</DialogTitle><DialogDescription className="sr-only">Edit one drawing. OK commits all settings once; Cancel discards the preview.</DialogDescription>
    <fieldset disabled={locked} className="min-w-0 space-y-3 border-0 p-0"><Field label="Name"><input className={fieldClass} value={draft.name??''} maxLength={240} placeholder={draft.type.replaceAll('-',' ')} onChange={event=>{const name=Array.from(event.target.value).slice(0,120).join('');if(name)update({...draft,name});else{const{name:_name,...unnamed}=draft;update(unnamed);}}}/></Field>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid h-auto w-full grid-cols-4">{['style','text','coordinates','visibility'].map(value=><TabsTrigger key={value} value={value} className="min-h-11 min-w-0 whitespace-normal break-words px-1 text-xs">{value.charAt(0).toUpperCase()+value.slice(1)}</TabsTrigger>)}</TabsList>
        <TabsContent value="style" className="space-y-2">
          <ColorField label="Line color" value={String(draft.parameters.color??'#64748b')} onChange={value=>parameter('color',value)}/>
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Line width"><select className={fieldClass} value={Number(draft.parameters.lineWidth??1)} onChange={e=>parameter('lineWidth',Number(e.target.value))}>{[1,2,3,4,5].map(value=><option key={value} value={value}>{value} px</option>)}</select></Field>
            <Choice label="Line style" value={String(draft.parameters.dashStyle??'solid')} values={['solid','dashed','dotted']} onChange={value=>parameter('dashStyle',value)}/>
            {draft.type==='trend-line'?<>
              <Choice label="Start cap" value={p.startCap??'normal'} values={['normal','arrow']} onChange={value=>presentation({startCap:value as 'normal'})}/>
              <Choice label="End cap" value={p.endCap??'normal'} values={['normal','arrow']} onChange={value=>presentation({endCap:value as 'normal'})}/>
            </>:null}
          </div>
          <div className="flex flex-wrap gap-x-4">
            {['trend-line','horizontal-line'].includes(draft.type)?(['extendLeft','extendRight'] as const).map((key,index)=><Check key={key} label={index?'Extend right':'Extend left'} checked={typeof draft.parameters[key]==='boolean'?draft.parameters[key]:draft.type==='horizontal-line'} onChange={value=>parameter(key,value)}/>):null}
            {paired?<Check label="Middle point" checked={p.middlePoint??false} onChange={middlePoint=>presentation({middlePoint})}/>:null}
            {draft.type!=='vertical-line'?<Check label="Price labels" checked={p.priceLabels??false} onChange={priceLabels=>presentation({priceLabels})}/>:null}
          </div>
          {paired?<fieldset className="space-y-2 rounded border border-border p-3">
            <legend className="px-1 text-xs text-muted-foreground">Statistics</legend>
            <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2">{drawingStatistics.map(stat=><Check key={stat} label={statisticLabels[stat]} checked={p.statistics?.includes(stat)??false} onChange={checked=>presentation({statistics:checked?[...(p.statistics??[]),stat]:(p.statistics??[]).filter(value=>value!==stat)})}/>)}</div>
            <p className="text-xs text-muted-foreground">Financial values are supplied. Pips are unavailable.</p>
            <div className="grid min-w-0 items-end gap-2 sm:grid-cols-2">
              <Choice label="Statistics position" value={p.statisticsPosition??'auto'} values={['left','center','right','auto']} onChange={value=>presentation({statisticsPosition:value as 'auto'})}/>
              <Check label="Always show statistics" checked={p.alwaysShowStatistics??false} onChange={alwaysShowStatistics=>presentation({alwaysShowStatistics})}/>
            </div>
          </fieldset>:null}
        </TabsContent>
        <TabsContent value="text" className="space-y-3"><Field label="Drawing text"><textarea rows={4} className={cn(fieldClass,'py-2')} maxLength={4000} value={text.value} onChange={e=>changeText({value:Array.from(e.target.value).slice(0,2000).join('')})}/></Field><ColorField label="Text color" value={text.color} onChange={color=>changeText({color})}/><Field label="Font size"><input type="number" min={8} max={48} step={1} className={fieldClass} value={text.fontSize} onChange={e=>changeText({fontSize:Number(e.target.value)})}/></Field><div className="flex gap-4"><Check label="Bold" checked={text.bold} onChange={bold=>changeText({bold})}/><Check label="Italic" checked={text.italic} onChange={italic=>changeText({italic})}/></div><div className="grid min-w-0 grid-cols-2 gap-3"><Choice label="Vertical alignment" value={text.verticalAlignment} values={['top','middle','bottom']} onChange={value=>changeText({verticalAlignment:value as 'top'})}/><Choice label="Horizontal alignment" value={text.horizontalAlignment} values={['left','center','right']} onChange={value=>changeText({horizontalAlignment:value as 'left'})}/></div></TabsContent>
        <TabsContent value="coordinates" className="space-y-4"><p className="text-xs text-muted-foreground">Times use {timeZone}; saved timestamps are UTC. Ruler coordinates are display positions, never future observations.</p>{draft.points.map((anchor,index)=>{
          const input=coordinateInputs[index],candidates=localTimeCandidates(input.local,timeZone),logical=engine.logicalForTime?.(anchor.time);
          const changeLocal=(local:string,offset='')=>{
            geometryTouched.current=true;onPreview(draft,true);
            const matches=localTimeCandidates(local,timeZone),chosen=matches.length===1?matches[0]:matches.find(match=>match.utcTime===offset);
            setCoordinateInputs(current=>current.map((value,i)=>i===index?{...value,local,offset:chosen?.utcTime??''}:value));
            if(chosen){rulerError.current=null;const time=Date.parse(chosen.utcTime)/1000;if(engine.coordinateForTime(time)==null){setError('Time is outside the available drawing ruler.');return;}const original=drawing.points[index];point(index,{time,utcTimeText:Number(original.time)===time&&original.utcTimeText?original.utcTimeText:chosen.utcTime});}else setError(matches.length?'Choose a UTC offset for this repeated local time.':'This local time does not exist.');
          };
          return <fieldset key={index} className="min-w-0 space-y-3 rounded border border-border p-3"><legend className="px-1 text-xs text-muted-foreground">Anchor {index+1}</legend><Field label={`Price ${index+1}`}><input type="text" inputMode="decimal" spellCheck={false} className={fieldClass} value={input.price} onChange={e=>{geometryTouched.current=true;onPreview(draft,true);const price=e.target.value;setCoordinateInputs(current=>current.map((value,i)=>i===index?{...value,price}:value));if(validExactPrice(price))point(index,{price:Number(price),priceText:price});else setError('Enter a finite decimal price.');}}/></Field><Field label={`Date and time ${index+1} (${timeZone})`}><input type="datetime-local" step="any" className={fieldClass} value={input.local} onChange={e=>changeLocal(e.target.value)}/></Field>{candidates.length>1?<Field label={`UTC offset ${index+1}`}><select className={fieldClass} value={input.offset} onChange={e=>changeLocal(input.local,e.target.value)}><option value="">Choose offset</option>{candidates.map(candidate=><option key={candidate.utcTime} value={candidate.utcTime}>{candidate.offset} · {candidate.utcTime}</option>)}</select></Field>:null}<Field label={`Ruler coordinate ${index+1}`}><input type="number" step="any" className={fieldClass} disabled={!engine.timeForLogical||logical==null} value={logical??''} onChange={e=>{geometryTouched.current=true;onPreview(draft,true);if(e.target.value===''){rulerError.current='Enter a ruler coordinate.';setError(rulerError.current);return;}const time=engine.timeForLogical?.(Number(e.target.value));if(time==null){rulerError.current='Ruler coordinate is outside the available horizon.';setError(rulerError.current);return;}rulerError.current=null;const utcTimeText=new Date(typeof time==='number'?time*1000:typeof time==='string'?Date.parse(time):Date.UTC(time.year,time.month-1,time.day)).toISOString();const projectedTime=Date.parse(utcTimeText)/1000;const original=drawing.points[index];const exact=Number(original.time)===projectedTime&&original.utcTimeText?original.utcTimeText:utcTimeText;point(index,{time:projectedTime,utcTimeText:exact});setCoordinateInputs(current=>current.map((value,i)=>i===index?{...value,local:localDateTime(time,timeZone),offset:utcTimeText}:value));}}/></Field><p className="break-all text-xs text-muted-foreground" title={anchor.utcTimeText}>{anchor.utcTimeText??new Date(typeof anchor.time==='number'?anchor.time*1000:typeof anchor.time==='string'?Date.parse(anchor.time):Date.UTC(anchor.time.year,anchor.time.month-1,anchor.time.day)).toISOString()}</p></fieldset>;
        })}</TabsContent>
        <TabsContent value="visibility" className="space-y-3">{Object.entries(drawingIntervalLimits).map(([family,maximum])=>{const key=family as keyof typeof drawingIntervalLimits,range=p.visibility?.[key]??{enabled:true,min:1,max:maximum};const change=(patch:Partial<typeof range>)=>presentation({visibility:{...p.visibility,[key]:{...range,...patch}}});return <fieldset key={family} className="grid min-w-0 grid-cols-2 gap-2 rounded border border-border p-3"><legend className="px-1 text-xs capitalize text-muted-foreground">{family}</legend><div className="col-span-2"><Check label={`Show on ${family}`} checked={range.enabled} onChange={enabled=>change({enabled})}/></div><Field label={`${family} minimum`}><input className={fieldClass} type="number" min={1} max={maximum} step={1} value={range.min} onChange={e=>change({min:Number(e.target.value)})}/></Field><Field label={`${family} maximum`}><input className={fieldClass} type="number" min={1} max={maximum} step={1} value={range.max} onChange={e=>change({max:Number(e.target.value)})}/></Field></fieldset>;})}<p className="text-xs text-muted-foreground">Ticks, Seconds and Ranges are unavailable. Missing interval settings preserve visibility.</p></TabsContent>
      </Tabs>
    </fieldset>
    {locked?<p className="text-xs text-muted-foreground">Unlock this drawing to edit its settings.</p>:null}{error?<p role="alert" className="text-sm text-destructive">{error}</p>:null}
    <div className="flex justify-end gap-2 border-t border-border pt-3"><Button type="button" colorStyle="ghost" className="min-h-11" onClick={close}>Cancel</Button><Button type="button" className="min-h-11" disabled={locked} onClick={apply}>OK</Button></div>
  </DialogContent></Dialog>;
}

interface FloatingEditorProps {drawing:DrawingState;engine:MarketChartEngine;options:MarketDrawingEditorOptions;anchorRef:React.RefObject<Element|null>;onPreview:(drawing:DrawingState|null,geometryDraft?:boolean)=>void;onCommit:(drawing:DrawingState,metadata:DrawingChangeMetadata)=>void;onDelete:()=>void;onHide:()=>void}
export function FloatingDrawingEditor({drawing,engine,options,anchorRef,onPreview,onCommit,onDelete,onHide}:FloatingEditorProps) {
  const [dialog,setDialog]=React.useState<string|null>(null),[quick,setQuick]=React.useState<'color'|'width'|'dash'|null>(null),[quickDraft,setQuickDraft]=React.useState<DrawingState|null>(null),[quickError,setQuickError]=React.useState<string|null>(null);
  const {toolbarRef,position,handleProps,reset,cancel,portalContainer}=useEditorPosition(options,anchorRef),theme=React.useContext(ChartThemeContext);
  const previewRef=React.useRef(onPreview);previewRef.current=onPreview;
  const returnFocusRef=React.useRef<HTMLButtonElement|null>(null),moreRef=React.useRef<HTMLButtonElement>(null);
  const showAlertAction=!options.onAlertIntent||['horizontal-line','trend-line','rectangle'].includes(drawing.type);
  const alertLabel=options.onAlertIntent?'Create alert':'Drawing alerts — coming later';
  const requestAlert=()=>options.onAlertIntent?.(drawing.id);
  const openFromMore=(tab:string)=>{returnFocusRef.current=moreRef.current;setDialog(tab);};
  const commit=(next:DrawingState)=>{if(!drawingDocumentsEqual([next],[drawing]))onCommit(next,{type:'style',drawingIds:[drawing.id],transactionId:`editor-${drawing.id}-${globalThis.crypto?.randomUUID?.()??Date.now()}`});};
  const cancelQuick=()=>{setQuick(null);setQuickDraft(null);setQuickError(null);onPreview(null);};
  React.useEffect(()=>{const blur=()=>{returnFocusRef.current=null;setDialog(null);setQuick(null);setQuickDraft(null);previewRef.current(null);};window.addEventListener('blur',blur);return()=>{window.removeEventListener('blur',blur);previewRef.current(null);};},[]);
  const documentKey=drawingDocumentComparisonKey([drawing]),timeZone=chartTimeZone(options.timeZone);
  React.useEffect(()=>{setDialog(null);setQuick(null);setQuickDraft(null);previewRef.current(null);},[documentKey,timeZone]);
  const startQuick=(kind:'color'|'width'|'dash')=>{if(drawing.locked)return;setQuick(kind);setQuickDraft(clone(drawing));setQuickError(null);};
  const quickChange=(key:string,value:string|number)=>{const next={...(quickDraft??drawing),parameters:{...(quickDraft??drawing).parameters,[key]:value}};setQuickDraft(next);setQuickError(null);if(!validateDrawingEditorDraft(next))onPreview(next);};
  const quickApply=()=>{if(!quickDraft||drawing.locked)return;const message=validateDrawingEditorDraft(quickDraft);if(message){setQuickError(message);return;}commit(quickDraft);cancelQuick();};
  const action=(label:string,icon:React.ReactNode,onClick:()=>void,disabled=false,extraClass?:string)=><Tooltip><TooltipTrigger asChild><Button type="button" aria-label={label} disabled={disabled} size="sm" colorStyle="ghost" className={cn('min-h-11 min-w-11 shrink-0 focus-visible:ring-2 focus-visible:ring-ring',extraClass)} onClick={event=>{returnFocusRef.current=event.currentTarget;onClick();}}>{icon}</Button></TooltipTrigger><TooltipContent size="xs" className="motion-reduce:!animate-none">{label}</TooltipContent></Tooltip>;
  if(typeof document==='undefined')return null;
  return createPortal(<ChartPortalContainerContext.Provider value={portalContainer&&portalContainer!==document.body?portalContainer:undefined}>
    <div ref={toolbarRef} role="toolbar" aria-label={`Edit ${drawing.name??drawing.type}`} data-drawing-editor={drawing.id} className={cn('fixed z-40 flex max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] flex-wrap items-center gap-0.5 overflow-y-auto rounded border border-border bg-background p-1 text-foreground shadow-md motion-safe:transition-shadow motion-reduce:transition-none',theme.theme&&theme.theme!=='light'&&'dark')} style={{...theme.style,left:position.x,top:position.y}} onKeyDown={e=>{if(e.key==='Escape'){cancel();cancelQuick();setDialog(null);}}}>
      <Button type="button" size="sm" colorStyle="ghost" className="min-h-11 min-w-11 shrink-0 touch-none cursor-grab active:cursor-grabbing" {...handleProps}><GripVerticalIcon aria-hidden="true"/></Button>
      {(['color','width','dash'] as const).map(kind=><Popover key={kind} open={quick===kind} onOpenChange={open=>open?startQuick(kind):cancelQuick()}><Tooltip><TooltipTrigger asChild><PopoverTrigger asChild><Button type="button" size="sm" colorStyle="ghost" disabled={drawing.locked} aria-label={kind==='color'?'Drawing color':kind==='width'?'Drawing width':'Drawing line style'} className={cn('min-h-11 min-w-11 shrink-0',kind!=='color'&&'hidden sm:inline-flex')}>{kind==='color'?<PaletteIcon/>:kind==='width'?<span className="text-xs">{String(drawing.parameters.lineWidth??1)} px</span>:<SlashIcon/>}</Button></PopoverTrigger></TooltipTrigger><TooltipContent size="xs" className="motion-reduce:!animate-none">{kind==='color'?'Color':kind==='width'?'Width':'Line style'}</TooltipContent></Tooltip><PopoverContent align="start" className="w-[min(18rem,calc(100vw-1rem))] space-y-3 text-foreground motion-reduce:!animate-none" onEscapeKeyDown={cancelQuick}>
        {kind==='color'?<ColorField label="Quick color" value={String(quickDraft?.parameters.color??drawing.parameters.color??'#64748b')} onChange={value=>quickChange('color',value)}/>:kind==='width'?<Field label="Quick width"><select className={fieldClass} value={Number(quickDraft?.parameters.lineWidth??drawing.parameters.lineWidth??1)} onChange={e=>quickChange('lineWidth',Number(e.target.value))}>{[1,2,3,4,5].map(value=><option key={value} value={value}>{value} px</option>)}</select></Field>:<Choice label="Quick line style" value={String(quickDraft?.parameters.dashStyle??drawing.parameters.dashStyle??'solid')} values={['solid','dashed','dotted']} onChange={value=>quickChange('dashStyle',value)}/>}
        {quickError?<p role="alert" className="text-xs text-destructive">{quickError}</p>:null}<div className="flex justify-end gap-2"><Button type="button" colorStyle="ghost" onClick={cancelQuick}>Cancel</Button><Button type="button" onClick={quickApply}>Apply</Button></div>
      </PopoverContent></Popover>)}
      {action('Drawing text',<FileTextIcon/>,()=>setDialog('text'),drawing.locked,'hidden sm:inline-flex')}
      {action('Drawing settings',<SettingsIcon/>,()=>setDialog('style'))}
      {showAlertAction? action(alertLabel,<BellIcon/>,requestAlert,!options.onAlertIntent,'hidden sm:inline-flex'):null}
      {action(drawing.locked?'Unlock drawing':'Lock drawing',drawing.locked?<UnlockIcon/>:<LockIcon/>,()=>onCommit({...drawing,locked:!drawing.locked},{type:'lock',drawingIds:[drawing.id]}),false,'hidden sm:inline-flex')}
      {action('Delete drawing',<TrashIcon/>,onDelete,false,'hidden sm:inline-flex')}
      <DropdownMenu><DropdownMenuTrigger asChild><Button ref={moreRef} type="button" size="sm" colorStyle="ghost" aria-label="More drawing actions" className="min-h-11 min-w-11 shrink-0"><MoreHorizontalIcon/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="max-h-[calc(100dvh-1rem)] overflow-y-auto motion-reduce:!animate-none">
        <DropdownMenuItem disabled={drawing.locked} onSelect={()=>openFromMore('text')}>Text</DropdownMenuItem><DropdownMenuItem disabled={drawing.locked} onSelect={()=>openFromMore('style')}>Width</DropdownMenuItem><DropdownMenuItem disabled={drawing.locked} onSelect={()=>openFromMore('style')}>Line style</DropdownMenuItem><DropdownMenuItem onSelect={()=>onCommit({...drawing,locked:!drawing.locked},{type:'lock',drawingIds:[drawing.id]})}>{drawing.locked?'Unlock':'Lock'}</DropdownMenuItem>{showAlertAction?<DropdownMenuItem disabled={!options.onAlertIntent} onSelect={requestAlert}>{alertLabel}</DropdownMenuItem>:null}<DropdownMenuItem icon={<EyeOffIcon/>} onSelect={onHide}>Hide</DropdownMenuItem><DropdownMenuItem icon={<TrashIcon/>} onSelect={onDelete}>Delete</DropdownMenuItem><DropdownMenuItem onSelect={reset}>Reset position</DropdownMenuItem>
      </DropdownMenuContent></DropdownMenu>
    </div>
    {dialog?<DrawingSettings key={`${drawing.id}:${timeZone}`} drawing={drawing} engine={engine} timeZone={timeZone} tab={dialog} returnFocusRef={returnFocusRef} onClose={()=>setDialog(null)} onPreview={onPreview} onCommit={commit}/>:null}
  </ChartPortalContainerContext.Provider>,portalContainer??document.body);
}
