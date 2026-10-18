import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { build } from "esbuild";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const out=path.join(root,".icon-validation/consumers");
fs.mkdirSync(out,{recursive:true});
const npm=process.platform==="win32"?"npm.cmd":"npm";
const run=(args,cwd)=>execFileSync(npm,args,{cwd,shell:process.platform==="win32",encoding:"utf8",env:{...process.env,npm_config_cache:path.join(root,".npm-cache")},stdio:["ignore","pipe","pipe"]});
const [archive]=JSON.parse(run(["pack","--ignore-scripts","--json","--pack-destination",out],path.join(root,"icons")));
const tarball=path.join(out,archive.filename);
const catalog=JSON.parse(fs.readFileSync(path.join(root,"icons/catalog.json"),"utf8"));
const results={archive:archive.filename,sha256:createHash("sha256").update(fs.readFileSync(tarball)).digest("hex"),consumers:[]};
for(const version of ["18.3.1","19.2.8"]) {
 const consumer=path.join(out,"react-"+version+"-"+results.sha256.slice(0,12));
 fs.mkdirSync(consumer,{recursive:true});
 fs.writeFileSync(path.join(consumer,"package.json"),JSON.stringify({name:"icons-consumer-"+version,version:"1.0.0",private:true,type:"module"}));
 const installed=run(["install","--ignore-scripts","--no-audit","--no-fund","--package-lock=false",tarball,"react@"+version,"react-dom@"+version,"@types/react@"+(version.startsWith("18")?"18.3.28":"19.2.0"),"@types/react-dom@"+(version.startsWith("18")?"18.3.7":"19.2.3")],consumer);
 console.log("Installed packed icon consumer for React "+version+" ("+installed.trim().split("\n").at(-1)+")");
 const assertion=[
  'import assert from "node:assert/strict";',
  'import fs from "node:fs";',
  'import { createRequire } from "node:module";',
  'import { createElement,createRef } from "react";',
  'import { renderToString } from "react-dom/server";',
  'import * as icons from "aapaetsch-icons";',
  'const require=createRequire(import.meta.url);',
  'const common=require("aapaetsch-icons");',
  'assert.equal(Object.keys(icons).length,'+catalog.length+');',
  'assert.equal(Object.keys(common).length,'+catalog.length+');',
  'for(const [name,Icon] of Object.entries(icons)) { const html=renderToString(createElement(Icon,{"aria-label":name,ref:createRef()})); assert(html.includes(\'viewBox="0 0 24 24"\')); assert(html.includes(\'role="img"\')); }',
  'const Search=(await import("aapaetsch-icons/search")).SearchIcon;',
  'assert.equal(Search,icons.SearchIcon); assert.equal(require("aapaetsch-icons/search").SearchIcon,common.SearchIcon);',
  'assert(fs.readFileSync(require.resolve("aapaetsch-icons/svg/search.svg"),"utf8").includes("currentColor"));',
  'const manifest=require("aapaetsch-icons/package.json"); assert.equal(manifest.sideEffects,false);',
 ].join("\n");
 fs.writeFileSync(path.join(consumer,"smoke.mjs"),assertion);
 execFileSync(process.execPath,["smoke.mjs"],{cwd:consumer,stdio:"pipe"});
 fs.writeFileSync(path.join(consumer,"server-import.mjs"),'import { SearchIcon } from "aapaetsch-icons"; if(!SearchIcon) throw new Error("Server import missing");');
 if(version.startsWith("19")) execFileSync(process.execPath,["--conditions=react-server","server-import.mjs"],{cwd:consumer,stdio:"pipe"});
 for(const extension of ["mts","cts"]) fs.writeFileSync(path.join(consumer,"types."+extension),[
  'import { SearchIcon, type IconProps, type IconComponent } from "aapaetsch-icons";',
  'import { CloseIcon } from "aapaetsch-icons/close";',
  'const props:IconProps={size:"1rem",className:"size-4","aria-label":"Find"};',
  'const original:IconComponent=SearchIcon;',
  'const close:IconComponent=CloseIcon;',
  'void [props,original,close];',
  '// @ts-expect-error size must be a number or string',
  'const bad:IconProps={size:false}; void bad;',
 ].join("\n"));
 fs.writeFileSync(path.join(consumer,"tsconfig.json"),JSON.stringify({compilerOptions:{strict:true,noEmit:true,skipLibCheck:false,target:"ES2022",module:"NodeNext",moduleResolution:"NodeNext",types:["react"],lib:["ES2022","DOM"]},include:["types.mts","types.cts"]}));
 execFileSync(process.execPath,[path.join(root,"node_modules/typescript/bin/tsc"),"-p","tsconfig.json"],{cwd:consumer,stdio:"pipe"});
 const bundle=await build({stdin:{contents:'import { SearchIcon } from "aapaetsch-icons"; console.log(SearchIcon);',resolveDir:consumer},bundle:true,format:"esm",write:false,metafile:true,minify:true,external:["react","react/jsx-runtime"]});
 const js=bundle.outputFiles[0].text;
 if(js.includes('data-icon":"trash"')||js.includes('data-icon":"calendar"')||js.includes("TrashIcon")) throw new Error("Unrelated icon artwork survived tree shaking");
 const kept=Object.entries(bundle.metafile.outputs).flatMap(([,v])=>Object.entries(v.inputs).filter(([,info])=>info.bytesInOutput>0).map(([file])=>file));
 if(kept.some(file=>file.includes("catalog.json"))) throw new Error("Runtime catalog bundled");
 results.consumers.push({react:version,esm:true,commonjs:true,ssrAllIcons:catalog.length,serverImport:version.startsWith("19")?true:"React 18 stable has no supported RSC entrypoint",nodeNextTypes:true,rawSvg:true,bundleBytes:Buffer.byteLength(js),retainedInputs:kept});
}
fs.writeFileSync(path.join(out,"results.json"),JSON.stringify(results,null,2)+"\n");
console.log(JSON.stringify(results.consumers,null,2));

