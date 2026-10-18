import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";
import { optimize } from "svgo";
import ts from "typescript";
import { validateSvg } from "./svg-validation.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const check=process.argv.includes("--check");
const catalog=JSON.parse(fs.readFileSync(path.join(root,"catalog.json"),"utf8"));
const outputs=new Map();
const seen=new Set();
const seenNames=new Set();
for (const icon of catalog) {
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(icon.slug) || !/^[A-Z][A-Za-z]+Icon$/.test(icon.name) || seen.has(icon.slug) || seenNames.has(icon.name)) throw new Error("Invalid/duplicate catalog entry "+icon.slug);
  seen.add(icon.slug);
  seenNames.add(icon.name);
  const filename=path.join(root,"svg",icon.slug+".svg");
  const original=fs.readFileSync(filename,"utf8");
  validateSvg(original,filename);
  const optimized=optimize(original,{path:filename,plugins:[{name:"preset-default",params:{overrides:{convertShapeToPath:false,mergePaths:false}}}]}).data;
  const code=await transform(optimized,{plugins:[jsx],typescript:true,expandProps:false,jsxRuntime:"automatic"},{componentName:icon.name});
  const ast=ts.createSourceFile(filename+".tsx",code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  let children;
  function visit(node) {
    if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(ast)==="svg") children=node.children.map(n=>n.getText(ast)).join("");
    else ts.forEachChild(node,visit);
  }
  visit(ast);
  if(children===undefined) throw new Error("SVGR did not emit SVG for "+icon.slug);
  const dir="src/components/"+icon.slug+"-icon/";
  outputs.set(dir+"index.tsx",[
    "// Generated from svg/"+icon.slug+".svg; edit artwork and run npm run generate.",
    'import * as React from "react";',
    'import { IconBase } from "../../icon-base";',
    'import type { IconProps } from "../../types";',
    "export const "+icon.name+" = /* @__PURE__ */ React.forwardRef<SVGSVGElement,IconProps>(",
    "  function "+icon.name+"(props,ref) {",
    '    return <IconBase data-icon="'+icon.slug+'" {...props} ref={ref}>'+children+"</IconBase>;",
    "  }",
    ");","",
  ].join("\n"));
  outputs.set(dir+icon.slug+"-icon.stories.tsx",[
    "// Generated; edit the catalog or generator.",
    'import type { Meta, StoryObj } from "@storybook/react";',
    'import { '+icon.name+' } from "./index";',
    'const meta={title:"Icons/'+icon.category+'/'+icon.title+'",component:'+icon.name+',args:{"aria-label":"'+icon.title+'"},tags:["autodocs"]} satisfies Meta<typeof '+icon.name+'>;',
    "export default meta;",
    "type Story=StoryObj<typeof meta>;",
    "export const Default:Story={};",
    'export const Sizes:Story={render:()=> <div className="flex items-center gap-5">'+["0.875rem","1rem","1.25rem","1.5rem"].map(size=>'<'+icon.name+' size="'+size+'" aria-label="'+icon.title+' '+size+'"/>').join("")+"</div>};","",
  ].join("\n"));
  outputs.set(dir+"README.md","# "+icon.name+"\n\n"+icon.title+" — "+icon.category+".\n\nImport "+icon.name+" from aapaetsch-icons or aapaetsch-icons/"+icon.slug+".\n\nAccepts IconProps, an SVG ref, size (default 1.5rem), strokeWidth (default 2), className, and standard SVG attributes. Decorative by default; name meaningful standalone images with aria-label or aria-labelledby. Name icon-only buttons on the button.\n\nArtwork: svg/"+icon.slug+".svg. "+icon.provenance+"\n\nGenerated documentation; edit catalog.json or the generator. See the package DESIGN.md for geometry and semantics.\n");
  outputs.set(dir+"agents.md","# "+icon.name+"\n\n- **Props:** IconProps and SVGSVGElement ref; SVG attributes, size, strokeWidth, className, and accessible name.\n- **Dependencies:** React; internal IconBase; package-local clsx/tailwind-merge helper.\n- **Styling Decisions:** 24-unit rounded outline, 2-unit strokes, currentColor. No CVA variants or required CSS; the enclosing control owns state styling.\n- **Maintenance Notes:** Generated from svg/"+icon.slug+".svg and catalog.json. Do not edit generated output. Review at 14/16/20/24 CSS-pixel equivalents; keep icon-only control labels on their controls.\n");
}
outputs.set("src/index.ts",'// Generated public API. No catalog-wide runtime registry.\nexport type { IconProps, IconComponent } from "./types";\n'+catalog.map(icon=>'export { '+icon.name+' } from "./components/'+icon.slug+'-icon";').join("\n")+"\n");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const entryExport = (name) => ({import:{types:"./dist/"+name+".d.ts",default:"./dist/"+name+".js"},require:{types:"./dist/"+name+".d.cts",default:"./dist/"+name+".cjs"}});
manifest.exports["."]=entryExport("index");
for(const key of Object.keys(manifest.exports)) if(![".","./svg/*.svg","./catalog.json","./package.json"].includes(key)) delete manifest.exports[key];
for(const icon of catalog) manifest.exports["./"+icon.slug]=entryExport(icon.slug);
outputs.set("package.json",JSON.stringify(manifest,null,2)+"\n");
const unexpected=fs.readdirSync(path.join(root,"svg")).filter(file=>!seen.has(file.replace(/\.svg$/,"")));
if(unexpected.length) throw new Error("Uncatalogued SVGs: "+unexpected.join(", "));
const generatedRoot=path.join(root,"src/components");
if(fs.existsSync(generatedRoot)) for(const dir of fs.readdirSync(generatedRoot)) if(!seen.has(dir.replace(/-icon$/,""))) throw new Error("Stale generated folder: "+dir);
let stale=0;
for(const [file,content] of outputs) {
  const absolute=path.join(root,file);
  if(check) {
    if(!fs.existsSync(absolute)||fs.readFileSync(absolute,"utf8")!==content) { console.error("Stale generated output: "+file); stale++; }
  } else { fs.mkdirSync(path.dirname(absolute),{recursive:true}); fs.writeFileSync(absolute,content); }
}
if(stale) process.exitCode=1;
else console.log((check?"Verified ":"Generated ")+catalog.length+" original icons and "+outputs.size+" deterministic files.");

