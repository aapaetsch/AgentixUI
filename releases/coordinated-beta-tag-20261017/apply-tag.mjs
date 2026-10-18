import fs from 'node:fs';import{execFileSync}from'node:child_process';
const before=JSON.parse(fs.readFileSync('before-tag.json','utf8'));
if(before.name!=='aapaetsch-charts-market'||before.version!=='0.1.0-beta.2'||before.sha256!=='51bce4897d443b2e57796a528b3bba919d203a1ca0526c458b9e717bc4637bf5'||!['0.1.0-beta.1-refinement.20261017.2','0.1.0-beta.2'].includes(before.beta))throw Error('Missing approved preflight');
if(before.beta!==before.version)execFileSync('npm',['dist-tag','add','aapaetsch-charts-market@0.1.0-beta.2','beta','--ignore-scripts','--registry=https://registry.npmjs.org/'],{stdio:'inherit'});else console.log('Selected beta tag already correct.');
