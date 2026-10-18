import { optimize } from "svgo";
const elements = new Set(["svg","g","path","line","polyline","polygon","circle","ellipse","rect"]);
const attributes = new Set([
  "xmlns","viewBox","width","height","fill","fill-rule","clip-rule","stroke","stroke-width",
  "stroke-linecap","stroke-linejoin","stroke-dasharray","stroke-dashoffset","opacity",
  "d","points","x","y","x1","y1","x2","y2","cx","cy","r","rx","ry","transform",
]);
/** Restrict authored assets to standalone, monochrome geometry without IDs or executable content. */
export function validateSvg(source, filename) {
  if (/<!DOCTYPE|<!ENTITY|<\?/i.test(source)) throw new Error(filename+": XML declarations/entities are unsupported");
  let roots=0;
  const result = optimize(source,{path:filename,plugins:[{
    name:"agentix-geometry",
    fn:()=>({element:{enter(node) {
      if (!elements.has(node.name)) throw new Error(filename+": unsupported element "+node.name);
      if (node.name==="svg") {
        roots++;
        if (roots>1 || node.attributes.viewBox!=="0 0 24 24") throw new Error(filename+": require one 24-unit SVG root");
      }
      for (const [key,value] of Object.entries(node.attributes)) {
        if (!attributes.has(key) || /url\s*\(|javascript:|data:/i.test(value)) throw new Error(filename+": unsupported attribute "+key);
        if ((key==="fill"||key==="stroke")&&!["none","currentColor"].includes(value)) throw new Error(filename+": use currentColor or none");
      }
    }}}),
  }]});
  if (roots!==1) throw new Error(filename+": SVG root missing");
  return result.data;
}

