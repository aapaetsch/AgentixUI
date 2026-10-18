import * as React from 'react';
import {act,cleanup,render,screen} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {useMarketDataRevision} from './use-data-revision';
afterEach(cleanup);
it('does not advance a committed revision from an abandoned suspended render',async()=>{
 const data=[{time:1,open:1,high:2,low:0,close:1}],never=new Promise(()=>{});let set:React.Dispatch<React.SetStateAction<number>>;
 function Gate({revision}:{revision:number}){const accepted=useMarketDataRevision(data,'bars',{identity:'bars',revision});if(revision===10)throw never;return <output>{accepted.revision}:{accepted.receipt?.status}</output>;}
 function Harness(){const[revision,update]=React.useState(1);set=update;return <React.Suspense fallback="Pending"><Gate revision={revision}/></React.Suspense>;}
 render(<Harness/>);expect(screen.getByText('1:accepted')).toBeInTheDocument();await act(async()=>React.startTransition(()=>set(10)));act(()=>set(2));expect(screen.getByText('2:accepted')).toBeInTheDocument();
});
