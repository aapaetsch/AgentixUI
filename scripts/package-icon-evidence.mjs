import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const out=path.join(root,".icon-validation/artifacts");
fs.mkdirSync(out,{recursive:true});
const baselinePath=path.join(root,".icon-validation/baseline-head.txt");
let baselineHead=null,baselineSource="unavailable";
if(fs.existsSync(baselinePath)) {
  baselineHead=fs.readFileSync(baselinePath,"utf8").trim();
  baselineSource="saved-working-tree-baseline";
} else {
  try {
    baselineHead=execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();
    baselineSource="checkout-head";
  } catch { /* Exported source archives may not have Git metadata. */ }
}
const npm=process.platform==="win32"?"npm.cmd":"npm";
const packages=[];
for(const workspace of ["icons",".","charts","charts-market"]) {
 const stdout=execFileSync(npm,["pack","--ignore-scripts","--json","--pack-destination",out],{cwd:path.resolve(root,workspace),shell:process.platform==="win32",encoding:"utf8",stdio:["ignore","pipe","pipe"]});
 const [pack]=JSON.parse(stdout),file=path.join(out,pack.filename),bytes=fs.readFileSync(file);
 packages.push({name:pack.name,version:pack.version,archive:path.relative(root,file).replaceAll("\\","/"),sha256:createHash("sha256").update(bytes).digest("hex"),integrity:pack.integrity,size:pack.size,unpackedSize:pack.unpackedSize,fileCount:pack.entryCount,files:pack.files.map(file=>file.path)});
}
const lock=fs.readFileSync(path.join(root,"package-lock.json"));
const result={generatedAt:new Date().toISOString(),publication:false,baselineHead,baselineSource,node:process.version,lockSha256:createHash("sha256").update(lock).digest("hex"),packages};
fs.mkdirSync(path.join(root,"docs/evidence"),{recursive:true});
fs.writeFileSync(path.join(root,"docs/evidence/icons-artifacts.json"),JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify(packages.map(item=>({name:item.name,version:item.version,sha256:item.sha256,size:item.size})),null,2));

