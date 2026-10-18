import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const staging=path.join(root,".icon-validation/next-artifacts");
fs.mkdirSync(staging,{recursive:true});
const npm=process.platform==="win32"?"npm.cmd":"npm";
const run=(args,cwd)=>execFileSync(npm,args,{cwd,shell:process.platform==="win32",encoding:"utf8",env:{...process.env,NEXT_TELEMETRY_DISABLED:"1",npm_config_cache:path.join(root,".npm-cache")},stdio:["ignore","pipe","pipe"]});
const artifacts=[];
for(const workspace of ["icons","."]) {
 const [metadata]=JSON.parse(run(["pack","--ignore-scripts","--json","--pack-destination",staging],path.join(root,workspace)));
 artifacts.push(path.join(staging,metadata.filename));
}
const hashes=artifacts.map(file=>createHash("sha256").update(fs.readFileSync(file)).digest("hex"));
const candidateKey=createHash("sha256").update(hashes.join("")).digest("hex").slice(0,12);
const out=path.join(root,".icon-validation/next-consumer-"+candidateKey);
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,"package.json"),JSON.stringify({name:"agentix-icon-next-check",version:"1.0.0",private:true,type:"module"}));
console.log(run(["install","--ignore-scripts","--no-audit","--no-fund","--package-lock=false",...artifacts,"next@16.2.11","react@19.2.8","react-dom@19.2.8","typescript@5.9.3","@types/react@19.2.0","@types/react-dom@19.2.3","@types/node@22.15.0"],out));
fs.mkdirSync(path.join(out,"app"),{recursive:true});
fs.writeFileSync(path.join(out,"app/layout.tsx"),'export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }');
fs.writeFileSync(path.join(out,"app/page.tsx"),'import { SearchIcon } from "aapaetsch-icons"; import { CloseIcon } from "aapaetsch-ui-kit"; import Client from "./client"; export default function Page() { return <main><h1>Original icon consumer</h1><SearchIcon aria-label="Server search"/><CloseIcon aria-label="Kit server close"/><Client/></main>; }');
fs.writeFileSync(path.join(out,"app/client.tsx"),'"use client"; import { useState } from "react"; import { PlusIcon } from "aapaetsch-icons"; export default function Client() { const [count,setCount]=useState(0); return <button onClick={()=>setCount(count+1)} aria-label="Add item"><PlusIcon/>{count}</button>; }');
fs.writeFileSync(path.join(out,"next.config.mjs"),"export default {outputFileTracingRoot:process.cwd(),experimental:{cpus:2}};\n");
const output=run(["exec","--","next","build","--webpack"],out);
fs.writeFileSync(path.join(out,"build.log"),output);
console.log(output);
const html=fs.readFileSync(path.join(out,".next/server/app/index.html"),"utf8");
if(!html.includes('aria-label="Server search"')||!html.includes('aria-label="Kit server close"')) throw new Error("Server icons did not render in Next.js HTML");
const results={next:"16.2.11",react:"19.2.8",build:true,serverIcons:true,kitServerReexports:true,clientBoundary:true,publication:false,directory:out,archiveSha256:hashes};
fs.writeFileSync(path.join(out,"results.json"),JSON.stringify(results,null,2)+"\n");
fs.writeFileSync(path.join(root,".icon-validation/next-results.json"),JSON.stringify(results,null,2)+"\n");

