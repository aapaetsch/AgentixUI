import fs from "node:fs";
import path from "node:path";
const roots=["src","charts/src","charts-market/src","icons/src",".storybook","scripts"];
const violations=[];
function walk(dir) {
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
  if(["node_modules","dist"].includes(entry.name)) continue;
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()) walk(file);
  else if(/\.[cm]?[jt]sx?$/.test(file)&&!file.endsWith("check-icon-migration.mjs")) {
   const text=fs.readFileSync(file,"utf8");
   if(/(?:from\s*|import\s*\(|require\s*\()\s*["']lucide-react(?:\/[^"']*)?["']|\bLucide(?:Icon|Props)\b/.test(text)) violations.push(file);
  }
 }
}
roots.forEach(walk);
for(const file of ["package.json","icons/package.json","charts/package.json","charts-market/package.json"]) {
 const manifest=JSON.parse(fs.readFileSync(file,"utf8"));
 for(const group of ["dependencies","devDependencies","peerDependencies","optionalDependencies"]) if(manifest[group]?.["lucide-react"]) violations.push(file+":"+group);
}
if(violations.length) throw new Error("Unmigrated icon dependencies:\n"+violations.join("\n"));
console.log("Verified maintained sources and workspace manifests use original icons.");

