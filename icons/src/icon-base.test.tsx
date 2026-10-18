import * as React from "react";
import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "react";
import { SearchIcon } from "./components/search-icon";
import { CloseIcon } from "./components/close-icon";
import type { IconComponent } from "./types";

afterEach(cleanup);
describe("shared icon contract",()=>{
  it("is decorative without a name and does not introduce a tab stop",()=>{
    const {container}=render(<button aria-label="Search"><SearchIcon /></button>);
    const svg=container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden","true");
    expect(svg).toHaveAttribute("focusable","false");
    expect(svg).not.toHaveAttribute("tabindex");
    expect(screen.getByRole("button",{name:"Search"})).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
  });
  it("names standalone images without IDs and respects explicit hiding",()=>{
    const {rerender}=render(<SearchIcon aria-label="Find securities" />);
    expect(screen.getByRole("img",{name:"Find securities"})).toHaveAttribute("aria-hidden","false");
    rerender(<><span id="search-description">Find securities</span><SearchIcon aria-labelledby="search-description" /></>);
    expect(screen.getByRole("img",{name:"Find securities"})).toBeTruthy();
    rerender(<SearchIcon aria-label="Hidden search" aria-hidden />);
    expect(screen.queryByRole("img")).toBeNull();
  });
  it("forwards refs, SVG attributes and both dimensions without inline sizing styles",()=>{
    const ref=React.createRef<SVGSVGElement>();
    render(<SearchIcon ref={ref} size="2rem" width="3rem" strokeWidth={1.5} data-testid="icon" id="search" aria-describedby="hint" />);
    expect(ref.current).toBe(screen.getByTestId("icon"));
    expect(ref.current).toHaveAttribute("width","3rem");
    expect(ref.current).toHaveAttribute("height","2rem");
    expect(ref.current).toHaveAttribute("stroke-width","1.5");
    expect(ref.current).toHaveAttribute("aria-describedby","hint");
    expect(ref.current).not.toHaveAttribute("style");
  });
  it("merges Tailwind overrides and preserves inherited SVG colors",()=>{
    render(<CloseIcon data-testid="close" className="size-4 size-5 text-destructive" />);
    const svg=screen.getByTestId("close");
    expect(svg).toHaveClass("aapaetsch-icon","size-5","text-destructive");
    expect(svg).not.toHaveClass("size-4");
    expect(svg).toHaveAttribute("stroke","currentColor");
    expect(svg).toHaveAttribute("fill","none");
  });
  it("accepts caller-supplied SVG component types",()=>{
    const Custom:IconComponent=({size,...props})=><svg width={size} {...props}/>;
    render(<Custom aria-label="Custom" role="img" />);
    expect(screen.getByRole("img",{name:"Custom"})).toBeTruthy();
  });
  it("hydrates multiple named and decorative instances without mismatches",async()=>{
    const contents=<div><SearchIcon aria-label="Search"/><SearchIcon/><CloseIcon aria-label="Close"/></div>;
    const host=document.createElement("div");
    host.innerHTML=renderToString(contents);
    document.body.append(host);
    const errors:unknown[]=[];
    let root:ReturnType<typeof hydrateRoot>;
    await act(async()=>{ root=hydrateRoot(host,contents,{onRecoverableError:error=>errors.push(error)}); });
    expect(errors).toEqual([]);
    expect(host.querySelectorAll("svg")).toHaveLength(3);
    await act(async()=>root.unmount());
    host.remove();
  });
});

