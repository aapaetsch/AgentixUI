import { defineConfig } from "tsup";
import catalog from "./catalog.json";
const entry: Record<string,string> = {index:"src/index.ts"};
for (const icon of catalog) entry[icon.slug] = "src/components/"+icon.slug+"-icon/index.tsx";
export default defineConfig([{
  entry, format:["esm","cjs"], dts:false, splitting:true, sourcemap:true,
  clean:true, treeshake:true,
  external:["react","react/jsx-runtime","clsx","tailwind-merge"],
  outExtension:({format})=>({js:format==="cjs"?".cjs":".js"}),
}, {
  entry:{types:"src/types.ts"}, format:["esm","cjs"],
  dts:{only:true}, clean:false, external:["react"],
}]);

