import * as React from 'react';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {SuppliedStatus} from './supplied-status';
import type {CalculationRequest,SuppliedCalculationResults} from '../../core';
const request:CalculationRequest={kind:'indicator',instanceId:'opaque',requestKey:'accepted-key',symbol:'SYNTHETIC',interval:'1D',settings:{}};
const result:SuppliedCalculationResults={opaque:{kind:'indicator',requestKey:'accepted-key',status:'unavailable',provenanceLabel:'Synthetic producer',warning:'No supplied result for this range',points:[]}};
afterEach(cleanup);
describe('compact supplied details opt-out',()=>{
 it('keeps the summary and critical warnings without an interactive details entry point',()=>{
  const host=vi.fn();render(<SuppliedStatus requests={[request]} results={result} incoming={result} missingIdentity={false} compact showDetails={false} onRequestDetails={host} availability={{status:'error',description:'Producer unavailable'}}/>);
  const status=screen.getByRole('status');expect(status).toHaveTextContent('1 unavailable');expect(status).toHaveTextContent('No supplied result for this range');expect(status).toHaveTextContent('Producer unavailable');expect(screen.queryByRole('button',{name:'Supplied calculation details'})).not.toBeInTheDocument();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(host).not.toHaveBeenCalled();
 });
 it('retains rejected-result warning text and never renders superseded numeric values',()=>{
  render(<SuppliedStatus requests={[request]} results={{}} incoming={result} missingIdentity={false} compact showDetails={false}/>);expect(screen.getByRole('status')).toHaveTextContent('Stale response rejected');expect(screen.getByRole('status')).toHaveTextContent('Rejected response warning: No supplied result for this range');
 });
 it('retains a supplied unavailable profile reason and missing identity independently of the details button',()=>{
  const profileRequest={...request,kind:'profile' as const},profile:SuppliedCalculationResults={opaque:{kind:'profile',requestKey:request.requestKey,status:'unavailable',provenanceLabel:'Synthetic producer',profile:{rows:[],poc:null,vah:null,val:null,totalVolume:0,provenance:'supplied-levels',unavailable:'No supplied volume coverage'}}};
  const view=render(<SuppliedStatus requests={[profileRequest]} results={profile} incoming={profile} missingIdentity={false} compact showDetails={false}/>);expect(screen.getByRole('status')).toHaveTextContent('No supplied volume coverage');view.rerender(<SuppliedStatus requests={[profileRequest]} results={{}} incoming={{}} missingIdentity compact showDetails={false}/>);expect(screen.getByRole('status')).toHaveTextContent('calculationIdentity is required');expect(screen.queryByRole('button')).not.toBeInTheDocument();
 });
 it('preserves the default dialog and closes it if the host disables details at runtime',async()=>{
  const props={requests:[request],results:result,incoming:result,missingIdentity:false,compact:true};const view=render(<SuppliedStatus {...props}/>);fireEvent.click(screen.getByRole('button',{name:'Supplied calculation details'}));expect(await screen.findByRole('dialog')).toBeVisible();view.rerender(<SuppliedStatus {...props} showDetails={false}/>);await waitFor(()=>expect(screen.queryByRole('dialog')).not.toBeInTheDocument());expect(screen.queryByRole('button',{name:'Supplied calculation details'})).not.toBeInTheDocument();
 });
});
