import { describe,it,expect } from "vitest";
import { validateSvg } from "./svg-validation.mjs";
const wrap=body=>'<svg viewBox="0 0 24 24" stroke="currentColor">'+body+"</svg>";
describe("authored SVG validation",()=>{
  it("accepts monochrome geometry",()=>expect(validateSvg(wrap('<path d="M3 3 21 21"/>'),"valid.svg")).toContain("<path"));
  it.each([
    '<script>alert(1)</script>',
    '<image href="https://example.com/image.png"/>',
    '<path d="M3 3" onclick="alert(1)"/>',
    '<path id="collision" d="M3 3"/>',
    '<path fill="red" d="M3 3"/>',
    '<path fill="url(#paint)" d="M3 3"/>',
    '<foreignObject/>',
  ])("rejects unsafe/unsupported geometry: %s",body=>expect(()=>validateSvg(wrap(body),"bad.svg")).toThrow());
  it("rejects nonstandard viewboxes and entities",()=>{
    expect(()=>validateSvg('<svg viewBox="0 0 32 32"/>',"bad.svg")).toThrow();
    expect(()=>validateSvg('<!DOCTYPE svg>'+wrap(""),"bad.svg")).toThrow();
  });
});

