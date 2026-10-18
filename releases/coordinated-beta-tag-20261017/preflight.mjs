import fs from 'node:fs';import{createHash}from'node:crypto';
const name='aapaetsch-charts-market',version='0.1.0-beta.2',sha256='51bce4897d443b2e57796a528b3bba919d203a1ca0526c458b9e717bc4637bf5',integrity='sha512-xpl61MB9L8FQRXBMjWiIpiUYE/knIPQB+7BHLKOaucRB62+6wKGEj75bX31nxtLiPFFHB0GHIiekwqJBypcIeQ==';
async function get(url){if(new URL(url).origin!=='https://registry.npmjs.org')throw Error('Unexpected registry URL');const response=await fetch(url,{headers:{'Cache-Control':'no-cache'}});if(!response.ok)throw Error('Registry request failed '+response.status);return response;}
const metadata=await(await get('https://registry.npmjs.org/'+name)).json(),entry=metadata.versions?.[version],tags=metadata['dist-tags'];
if(entry?.name!==name||entry.version!==version||entry.dist?.integrity!==integrity)throw Error('Selected version/integrity mismatch');
if(!['0.1.0-beta.1-refinement.20261017.2',version].includes(tags?.beta)||typeof tags.latest!=='string')throw Error('Unexpected beta/latest before correction');
const bytes=Buffer.from(await(await get(entry.dist.tarball)).arrayBuffer());if(bytes.length!==579682||createHash('sha256').update(bytes).digest('hex')!==sha256||'sha512-'+createHash('sha512').update(bytes).digest('base64')!==integrity)throw Error('Selected public archive differs from reviewed CI bytes');
fs.writeFileSync('before-tag.json',JSON.stringify({name,version,sha256,integrity,size:bytes.length,beta:tags.beta,latest:tags.latest,distTags:tags,at:new Date().toISOString()},null,2)+String.fromCharCode(10));console.log('Selected archive verified; before tags recorded.');
