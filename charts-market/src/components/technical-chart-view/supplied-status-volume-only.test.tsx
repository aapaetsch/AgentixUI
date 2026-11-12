import * as React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import type {CalculationRequest, SuppliedCalculationResults} from '../../core';
import {SuppliedStatus} from './supplied-status';

const request:CalculationRequest={kind:'indicator',instanceId:'average',requestKey:'admitted',symbol:'SYN',interval:'1D',settings:{}};
const warning='Full upstream warning: the incomplete session has a missing closing observation, do not substitute another sample.';
const evidence:SuppliedCalculationResults={average:{kind:'indicator',requestKey:'admitted',status:'partial',provenanceLabel:'Original producer identity',coverageSummary:'17 of 20 admitted observations',warning,stale:true,points:[]}};
const base={requests:[request],results:evidence,incoming:evidence,missingIdentity:false,compact:true,showDetails:false,boundWarnings:true};
afterEach(cleanup);
const status=()=>screen.getByRole('status',{name:'Supplied calculation status'});
const expectBound=()=>{expect(status()).toHaveAttribute('tabindex','0');expect(status()).toHaveClass('max-h-16','overflow-y-auto','focus-visible:ring-inset');};
const expectUnbound=()=>{expect(status()).not.toHaveAttribute('tabindex');expect(status()).not.toHaveClass('max-h-16');expect(status()).not.toHaveClass('overflow-y-auto');};

describe('opt-in bounded critical status preserves evidence',()=>{
  it('bounds the same existing status region, retains every warning/source/coverage word and adds no controls',()=>{
    const details=vi.fn(),view=render(<SuppliedStatus {...base} labels={{average:'20 EMA'}} onRequestDetails={details}/>);
    expectBound();expect(screen.getAllByRole('status')).toHaveLength(1);expect(status()).toHaveTextContent(warning);expect(status()).toHaveTextContent('20 EMA: partial · Original producer identity · Stale');expect(status()).toHaveTextContent('17 of 20 admitted observations');
    expect(view.container.querySelectorAll('button,summary,[role="dialog"]')).toHaveLength(0);expect(details).not.toHaveBeenCalled();status().focus();expect(status()).toHaveFocus();
  });
  it('retains the complete rejected warning while never presenting rejected numeric points as accepted',()=>{
    const incoming:SuppliedCalculationResults={average:{...evidence.average!,kind:'indicator',requestKey:'superseded',status:'available',points:[{time:1,values:{ema:987654321}}]}};
    render(<SuppliedStatus {...base} results={{}} incoming={incoming}/>);expectBound();expect(status()).toHaveTextContent('Stale response rejected');expect(status()).toHaveTextContent('Rejected response warning: '+warning);expect(status()).not.toHaveTextContent('987654321');
  });
  it('includes a profile unavailable reason even without a result.warning or unavailable top-level status',()=>{
    const profileRequest:CalculationRequest={...request,kind:'profile'},profile:SuppliedCalculationResults={average:{kind:'profile',requestKey:'admitted',status:'partial',provenanceLabel:'Supplied profile source',profile:{rows:[],poc:null,vah:null,val:null,totalVolume:0,provenance:'supplied-levels',unavailable:'No accepted profile-level volume coverage'}}};
    render(<SuppliedStatus {...base} requests={[profileRequest]} results={profile} incoming={profile}/>);expectBound();expect(status()).toHaveTextContent('No accepted profile-level volume coverage');expect(status()).toHaveTextContent('Supplied profile source');
  });
  it('bounds an unavailable study even with no explicit warning text',()=>{const results:SuppliedCalculationResults={average:{kind:'indicator',requestKey:'admitted',status:'unavailable',provenanceLabel:'Exact unavailable source',points:[]}};render(<SuppliedStatus {...base} results={results} incoming={results}/>);expectBound();expect(status()).toHaveTextContent('Exact unavailable source');expect(status()).toHaveTextContent('unavailable');});
  it.each(['error','unavailable','stale'])('bounds an availability-only %s description without request warning rows',kind=>{
    const reason='Exact host availability reason '+('source timing detail '.repeat(30));render(<SuppliedStatus {...base} requests={[]} results={{}} incoming={{}} availability={{status:kind,description:reason}}/>);expectBound();expect(status()).toHaveTextContent(reason.trim());expect(status()).toHaveTextContent(kind==='stale'?'Stale':kind);
  });
  it.each(['available','loading'] as const)('keeps ordinary %s status out of the tab order and unconstrained',kind=>{
    const results:SuppliedCalculationResults=kind==='loading'?{}:{average:{kind:'indicator',requestKey:'admitted',status:'available',provenanceLabel:'Producer',points:[]}};render(<SuppliedStatus {...base} results={results} incoming={results}/>);expectUnbound();expect(status()).toHaveTextContent(kind);expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it.each([{boundWarnings:undefined,compact:true,showDetails:false},{boundWarnings:false,compact:true,showDetails:false},{boundWarnings:true,compact:false,showDetails:false},{boundWarnings:true,compact:true,showDetails:true}])('preserves non-opt-in/expanded/details policy %j',policy=>{
    render(<SuppliedStatus {...base} {...policy}/>);expectUnbound();if(policy.compact&&!policy.showDetails)expect(status()).toHaveTextContent(warning);if(policy.showDetails)expect(screen.getByRole('button',{name:'Supplied calculation details'})).toBeVisible();
  });
  it('removes stale cap/tabstop on positive data, policy opt-out and details restoration, while restoring them for new critical evidence',()=>{
    const view=render(<SuppliedStatus {...base}/>);expectBound();const positive:SuppliedCalculationResults={average:{kind:'indicator',requestKey:'admitted',status:'available',provenanceLabel:'Producer',points:[]}};
    view.rerender(<SuppliedStatus {...base} results={positive} incoming={positive}/>);expectUnbound();expect(status()).not.toHaveTextContent(warning);
    view.rerender(<SuppliedStatus {...base}/>);expectBound();view.rerender(<SuppliedStatus {...base} boundWarnings={false}/>);expectUnbound();expect(status()).toHaveTextContent(warning);
    view.rerender(<SuppliedStatus {...base}/>);expectBound();view.rerender(<SuppliedStatus {...base} showDetails/>);expectUnbound();expect(screen.getByRole('button',{name:'Supplied calculation details'})).toBeVisible();expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
