import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const catalog=JSON.parse(fs.readFileSync(path.join(root,"catalog.json"),"utf8"));
// Each component has the same verified public contract. Bundle it once instead
// of asking the declaration bundler to duplicate React's types for every icon.
for(const [extension,target] of [["d.ts","js"],["d.cts","cjs"]]) {
  for(const icon of catalog) {
    fs.writeFileSync(path.join(root,"dist",icon.slug+"."+extension),
      'import type * as React from "react";\nimport type { IconProps } from "./types.'+target+'";\n'+
      'export declare const '+icon.name+': React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;\n');
  }
  fs.writeFileSync(path.join(root,"dist/index."+extension),
    'export type { IconProps, IconComponent } from "./types.'+target+'";\n'+
    catalog.map(icon=>'export { '+icon.name+' } from "./'+icon.slug+'.'+target+'";').join("\n")+"\n");
}
console.log("Emitted lightweight ESM/CommonJS declarations for "+catalog.length+" icons.");
